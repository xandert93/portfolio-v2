# Known Issues & Workarounds

## Studio has its own root layout, separate from the site

**What:** `(site)` and `studio` each have their own independent root layout (their own
`<html>`/`<body>`), instead of sharing one `src/app/layout.tsx`. Only `(site)/layout.tsx`
imports `globals.css`; Studio's layout doesn't import any app CSS at all.

**Why:** briefly merged into one shared root layout while building a custom global
not-found page. That surfaced two separate problems: (1) an open Turbopack bug on Windows
that crashes while processing CSS through PostCSS ("connection forcibly closed", os error 10054) — Studio's route compiling `globals.css` for the first time seemingly made the
underlying race condition more likely to trigger; and (2) Studio's own admin bundle is
heavy enough to exhaust available memory during compilation regardless, independent of the
CSS issue. Reverted back to separate root layouts to remove the CSS angle entirely and get
back to a stable baseline. The memory pressure from compiling Studio itself is a separate,
still-open concern — see the Studio memory usage entry below.

**Trade-off:** Next.js doesn't support one shared `app/not-found.tsx` across multiple root
layouts, so there's currently no custom 404 page — Next's plain default is used instead.
See "Custom not-found page — parked" below for the plan to bring it back.

---

## Studio's dev compile is heavy on memory — parked memory issue

**What:** Even without the CSS/Turbopack bug above, visiting `/studio` in dev sometimes
crashes the dev server, the browser tab, and even the editor — accompanied by Rust "raw
alloc" failures and Chrome "insufficient memory" errors. This is Turbopack running out of
RAM compiling Studio's large admin bundle, not a bug in our code.

**Options not yet tried/decided on:**

- `next dev --webpack` — webpack has a lower peak memory ceiling than Turbopack for large
  builds, at the cost of slower startup/hot-reload generally.
- Run Studio as its own separate process during local content editing instead of visiting
  the embedded `/studio` route: `npx sanity dev` (typically on `localhost:3333`), keeping
  it fully decoupled from the Next.js dev server's memory usage. Studio would still stay
  embedded in the app for production/deployment either way — this only changes the local
  dev workflow.

**Status:** unresolved, revisit if it keeps being disruptive.

---

## Custom not-found page — parked

**What:** a styled 404 page (matching the site's design) was built for `(site)`, but was
reverted along with the shared-root-layout attempt above to get back to a stable baseline.
Its content is saved, untouched, at `docs/wip/not-found.txt` — not wired into the app, not
compiled, not routed; just parked there for later.

**To bring it back later**, now that `(site)` and `studio` already have separate root
layouts (see above), it's just two small additions — no layout changes needed:

1. Move the saved content into `src/app/(site)/not-found.tsx`.
2. Add a small catch-all so genuinely mistyped URLs (not just explicit `notFound()` calls,
   e.g. from the feature-flag gate in `proxy.ts`) also hit it:
   ```tsx
   // src/app/(site)/[...not-found]/page.tsx
   import { notFound } from 'next/navigation'

   export default function CatchAll() {
     notFound()
   }
   ```
   (Needed because Next can't render one shared `app/not-found.tsx` across multiple root
   layouts — a nested `not-found.tsx` only fires for explicit `notFound()` calls within its
   own group unless paired with a catch-all like this.)

**Status:** parked, not forgotten. Revisit when there's a calmer moment.
