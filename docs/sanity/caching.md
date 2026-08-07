# Sanity + Next.js: Caching & On-Demand Revalidation

This doc explains a bug we hit (published Sanity edits weren't showing up on the
live site) and the fix we built for it.
---

## 1. The problem

By default, unless a page opts into dynamic rendering (via
cookies, headers, `searchParams`, or an explicit config), the Next App
Router treats Server Components as static and caches both the fetched data
and the rendered output indefinitely. Publishing a change in Sanity updates
the source data, but nothing tells Next.js that its cached copy is now
outdated — that has to be configured explicitly.

---

## 2. Two caches, not one

Next.js (App Router, on Vercel) has **two separate caching layers** stacked on
top of each other. Both needed handling.

### a) The Data Cache

Every time our app calls `client.fetch(query)`, the _result_ of that call can be
cached. By default, if we don't tell Next.js otherwise, a `fetch` result is
cached indefinitely — Next.js has no way of knowing the data might change.

### b) The Full Route Cache

Separately, Next.js also caches the _rendered output_ of an entire page (the
HTML/RSC payload). If a page has no per-request inputs (no cookies, no
`searchParams`, no dynamic APIs), Next.js concludes at build time: "this page
will always render the same way, so I'll render it once and reuse that forever."

**Both layers needed a way to be told "this is now stale, throw it away."**
That's what the rest of this doc is about.

---

## 3. Two ways to invalidate a cache — and why we picked one

There are two general strategies for telling Next.js "this cached thing is old,
get rid of it":

### Option A — Time-based (ISR)

You tell Next.js "cache this, but only for x seconds." e.g.
`export const revalidate = 60`. After 60 seconds, the next visitor triggers a
regeneration.

- Simple, no extra infrastructure.
- **Downside**: always some lag — up to N seconds between publishing and it
  showing up, even if nothing changed in between (or you published 2 seconds
  after the site last regenerated, you wait the full window).

### Option B — On-demand (webhook-triggered) — **what we used**

Instead of guessing a time window, we get Sanity to contact our Next server and tell it the _exact moment_ something changed, and only regenerate then.

- Content shows up within seconds of publishing, not "eventually."
- No wasted regeneration when nothing changed.
- Slightly more setup (a webhook + an API route).

We went with **B** because the whole point was "I publish something, I expect
to see it" — not "I publish something and it shows up within a minute, maybe."

---

## 4. Tags: the mechanism that ties it all together

A **tag** is just a string label we attach to a `fetch()` call. It's not an ID,
it's not unique per-fetch — it's a group name. Multiple different fetches can
share the same tag.

```typescript
export const fetchFeaturedProjects = () =>
  client.fetch(FEATURED_PROJECTS_QUERY, {}, { next: { tags: ['project'] } })
```

We tag every Sanity fetch with the Sanity document `_type` it depends on
(`'project'`, `'post'`, `'about'`, `'siteSettings'`, etc.) That naming choice
matters — see §5.

### What `revalidateTag()` actually does in our route handler

```typescript
revalidateTag('project', { expire: 0 })
```

This does **two** things at once, not one:

1. **Wipes every Data Cache entry tagged `'project'`.** Not just one fetch —
   _every_ fetch anywhere in the app carrying that tag. So `fetchProjects()`,
   `fetchFeaturedProjects()`, and `fetchProject(slug)` would _all_ get
   invalidated by one call, even though they're three different functions.

2. **Wipes the Full Route Cache for every page that touched that tag while
   rendering.** Next.js silently tracks, during a page's render, which tags
   its `fetch()` calls used. So when `Home()` calls `fetchFeaturedProjects()`
   (tagged `'project'`) as part of rendering `/`, Next.js remembers "`/`
   depends on `project`." Revalidating that tag later invalidates the cached
   _page_, too — automatically, without us ever telling Next.js "also
   invalidate the homepage."

That second point is the one that's easy to miss: **one tag, invalidated once,
can clear both raw data _and_ whole rendered pages that used it**, in one call.

### What happens after invalidation

Nothing regenerates immediately. Invalidating just marks things stale. The
_next_ request to an affected route is what triggers Next.js to actually re-run
the Server Component, hit Sanity for real, and cache the new result under the
same tags — ready to serve to everyone after that, until invalidated again.

---

## 5. Why tags are named after Sanity's `_type`

This is a deliberate convention, not a coincidence.

Sanity's webhook, when a document changes, can send us that document's
`_type` (e.g. `"project"`) as part of the payload. Our API route reads
`body._type` and passes it straight into `revalidateTag(body._type)`.

If our tags in `fetch.ts` **exactly match** the real `_type` values in Sanity's
schema, this works with zero extra code — the webhook tells us what changed,
and that string doubles as the tag to invalidate. No lookup table, no mapping
object. If a tag is misspelled or doesn't match the schema exactly (case
matters), `revalidateTag` runs "successfully" but invalidates nothing, because
nothing was ever cached under that (wrong) name — a silent, hard-to-spot bug.

---

## 6. The webhook + API route

### The webhook (configured in Sanity's manage console)

- **Filter**: restricts which document types/changes trigger the webhook at
  all (we exclude drafts, since only published changes should count).
- **Projection**: a GROQ query that shapes the JSON body Sanity sends us. We
  keep it minimal — just enough to identify what changed:
  ```groq
  { "_type": _type, "_id": _id, "slug": slug.current }
  ```
- **Secret**: a shared string, known to both Sanity and our app
  (`SANITY_REVALIDATE_SECRET`). This is how our endpoint proves a request
  really came from Sanity, and not from a random POST off the internet.

### The route: `app/api/revalidate/route.ts`

```typescript
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Next's server and Sanity both know this secret. Sanity signs its
      // request with it; parseBody checks the signature matches. This
      // confirms the request genuinely came from our Sanity webhook, and
      // not from someone else hitting this public endpoint directly.
    )

    if (!isValidSignature)
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    if (!body?._type)
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })

    revalidateTag(
      body._type, // e.g. 'post', 'project', 'about'
      { expire: 0 }, // immediately expire — the next request waits for
      // genuinely fresh data, rather than being served one
      // more stale copy while regenerating in the background.
    )

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
```

Walking through it step by step:

1. Sanity POSTs to this endpoint whenever a filtered document is published.
2. `parseBody` verifies the request's signature against our shared secret →
   `isValidSignature`.
3. We bail out with `401` if the signature's wrong (not really Sanity), or
   `400` if there's no `_type` on the payload (nothing to invalidate).
4. Otherwise, `revalidateTag(body._type, { expire: 0 })` wipes the relevant
   Data Cache entries _and_ any page that depended on them (see §4).
5. We respond `200` with `{ revalidated: true }` so Sanity's delivery log shows
   success.

---

## 7. The `useCdn` caveat

Separately from all of the above, our Sanity client has:

```typescript
useCdn: process.env.NEXT_PUBLIC_SANITY_DATASET === 'production',
```

When `true`, reads go through **Sanity's own CDN**, not Sanity's live API
directly. That CDN is a _different_ cache from anything Next.js controls —
it has its own freshness window (roughly 30–60s) before it picks up a
just-published change.

This means: even after `revalidateTag` correctly wipes Next.js's cache, the
very next fetch might still get a slightly-stale answer _from Sanity's CDN_,
because Next re-fetching doesn't force Sanity's CDN to be current — it just
asks it "what have you got," and the CDN might still be holding last minute's
answer.

We decided to **keep `useCdn: true`** and accept the small CDN lag, in
exchange for staying within Sanity's (much larger) CDN request quota instead
of the live API quota. For a low-traffic personal site this trade-off is fine.
Setting it to `false` would remove this specific lag, at the cost of every
read hitting Sanity's live API directly.

---

## 8. Testing limitations

**Webhooks can't reach `localhost`.** Sanity's webhook service lives on
Sanity's own servers on the public internet — it has no route to your laptop.
So this can't be tested end-to-end in local dev without a tunneling tool (e.g.
`ngrok`) to expose `localhost` temporarily. We didn't bother with this for a
personal project — the webhook is only ever pointed at the **production** URL,
and testing happens there directly.

**Also**: preview deployments (e.g. a feature branch's own Vercel URL) are
protected by Vercel's SSO wall by default, and have their own _separate_
cache from production anyway. The webhook only ever targets the stable
production URL — checking a preview URL will never reflect what the webhook
is doing.

### How to check whether it's actually working

Go to **Sanity's manage console → your project → API → Webhooks → click the
webhook**, and look at its delivery log. Each entry shows:

- The HTTP status code our route returned (`200` = success).
- The response body — should show `{"revalidated":true, "now": <timestamp>}`.
- `401`/`400`/`500` responses indicate exactly what went wrong (bad secret,
  missing `_type`, or a thrown error in the route, respectively).

It's a genuinely messy log to read (raw JSON, not a nice UI), but the fields
you actually care about are just `resultCode` and `resultBody` on each entry.

---

## 9. A known limitation we chose to accept

Under **rapid, back-to-back edits** (multiple publishes within seconds of each
other), we observed that a change sometimes takes noticeably longer than
expected to show up — sometimes only reliably clearing after roughly a minute.

This turned out to be a documented rough edge in Vercel's Data Cache: despite
Vercel's docs stating on-demand revalidation propagates within ~300ms, several
developers have independently reported the same inconsistency under similar
conditions when deployed to Vercel specifically (working fine in local
production builds, less reliable once deployed). This is platform-level
behavior in Vercel's distributed cache, not something fixable from our
application code.

In practice, this doesn't matter for normal usage — nobody publishes several
unrelated edits seconds apart in real content editing. We chose to accept this
rather than add workaround complexity (e.g. artificial delays) for an edge
case that doesn't reflect how the site is actually used.
