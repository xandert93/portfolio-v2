# Feature Flags (deploying unfinished features safely)

**Problem:** `main` is your only branch and it's always deployed to production. Some sections
of the site are half-built and shouldn't be visible in production yet — but you still want to
work on them normally, see them locally, and check them on Vercel preview deployments.

**Solution:** one config file + a central route guard (middleware) + different env var values
per Vercel environment. No branches, no commenting code out before deploying.

## 1. One source of truth

List every top-level section of the site, not just the half-built ones — flags default to
`true` (feature counts as "on"/deployable) unless explicitly turned off.

```ts
// src/config/features.ts
export const FEATURES = {
  project: process.env.NEXT_PUBLIC_FEATURE_PROJECT !== 'false',
  about: process.env.NEXT_PUBLIC_FEATURE_ABOUT !== 'false',
  experience: process.env.NEXT_PUBLIC_FEATURE_EXPERIENCE !== 'false',
  blog: process.env.NEXT_PUBLIC_FEATURE_BLOG !== 'false',
} as const
```

Notes on the pattern above:

- `!== 'false'` means "visible unless explicitly disabled" — safe if you forget to set the
  env var somewhere, it just stays visible. The flip side: if you _mean_ to hide something in
  production, you must actively set its env var to `'false'` there — forgetting to set it
  means it defaults to visible, not hidden. Double-check Vercel's env vars for anything you're
  relying on being gated.
- `NEXT_PUBLIC_` is only required because `Navbar.tsx` is a client component and reads
  `FEATURES` too. The prefix has nothing to do with middleware specifically — see the note at
  the bottom on why.

## 2. Hide the nav link (cosmetic layer)

```ts
// Navbar.tsx
const NAV_LINKS = [
  FEATURES.project && { label: 'Work', href: '/projects' },
  FEATURES.about && { label: 'About', href: '/about' },
  FEATURES.experience && { label: 'Experience', href: '/experience' },
  FEATURES.blog && { label: 'Blog', href: '/blog' },
].filter((link): link is { label: string; href: string } => Boolean(link))
```

This alone is NOT enough — someone could still visit the URL directly. It just declutters the
UI for real visitors. The actual gate is the middleware below.

## 3. Block the routes themselves — centrally, via middleware

Rather than adding an `if (!FEATURES.x) notFound()` layout to every gated folder (duplication
that gets worse as features grow), gate everything from one file:

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { FEATURES } from '@/config/features'

const GATED_ROUTES: Record<string, keyof typeof FEATURES> = {
  '/projects': 'projects',
  '/about': 'about',
  '/experience': 'experience',
  '/blog': 'blog',
}

/* 📚 Request URL terminology:

/blog/post-1 → the full pathname or route path
/blog        → the parent route segment (aka route prefix)
/post-1      → the child route segment

*/

// Middleware only runs for paths matched by config.matcher.
// Keep this list in sync with the keys of GATED_ROUTES above — it's a
// second, manually-maintained list, which is the trade-off of doing it
// this way. See the alternative at the bottom of this section.
export const config = {
  matcher: ['/projects/:path*', '/about/:path*', '/experience/:path*', '/blog/:path*'],
}

export function middleware(request: NextRequest) {
  const reqPathname = request.nextUrl.pathname // e.g. '/about' or '/blog/post-1'

  const reqPrefix = Object.keys(GATED_ROUTES).find(
    (prefix) =>
      reqPathname === prefix || // matches route root exactly, e.g. '/blog' === '/blog' ✅
      reqPathname.startsWith(`${prefix}/`), // nested routes only, e.g. '/blog/post-1'.startsWith('/blog/') ✅
  )

  if (!reqPrefix) return // not a gated route — do nothing

  const isGateActive = !FEATURES[GATED_ROUTES[reqPrefix]]

  if (isGateActive) {
    // "Internal rewrite" — the client's URL does not change. Next tries to
    // render app/__gone/page.tsx; since that file doesn't exist, normal 404
    // handling kicks in, which is exactly what we want.
    return NextResponse.rewrite(new URL('/__gone', request.url))
  }
}

/* 📚 Why not just `reqPathname.startsWith(prefix)` (no trailing slash)?

- doesn't match the route root exactly, e.g. '/blog' vs '/blog' — actually fine here, but:
- falsely matches unrelated routes like `/blog-anything` starting with the same prefix

*/
```

**Guard-clause structure matters here, not just style:** `reqPrefix` is `string | undefined`.
Looking it up in `GATED_ROUTES`/`FEATURES` _before_ checking it exists won't compile under
strict TypeScript, and even where it does run, you'd be doing the lookup for every single
non-gated request instead of bailing out immediately. Return early when there's no match, then
compute the gate — don't compute the gate and rely on an `if` at the end to ignore a bad result.

**Scaling this up:** once you have more than ~4 gated sections, keeping `GATED_ROUTES` and
`matcher` in sync by hand gets error-prone (forgetting to add a route to `matcher` silently
un-gates it — middleware simply never runs for that path). At that point, swap the matcher for
a broad catch-all so `GATED_ROUTES` becomes the _only_ list to maintain:

```ts
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

Trade-off: middleware now runs on nearly every request instead of just the gated ones. For a
site this size that's a non-issue (middleware is edge-runtime and cheap) — but it's a real
trade-off, which is why the manual, explicit matcher above is a perfectly good starting point.

## 4. Different flag values per environment (the actual magic)

In Vercel: **Project → Settings → Environment Variables**, set a different value for the
_same key_ per environment:

| Env var                          | Production | Preview | Development (`.env.local`) |
| -------------------------------- | ---------- | ------- | -------------------------- |
| `NEXT_PUBLIC_FEATURE_PROJECT`    | `true`     | `true`  | `true`                     |
| `NEXT_PUBLIC_FEATURE_ABOUT`      | `true`     | `true`  | `true`                     |
| `NEXT_PUBLIC_FEATURE_EXPERIENCE` | `false`    | `true`  | `true`                     |
| `NEXT_PUBLIC_FEATURE_BLOG`       | `false`    | `true`  | `true`                     |

Result: you build every section normally, see it locally and on every preview URL (every
branch/PR gets its own preview deployment automatically) — and unfinished sections simply
aren't reachable in production. When one's ready, flip its value in the dashboard. No code
changes, no redeploy juggling, no branches involved.

## Appendix: why `NEXT_PUBLIC_` and does middleware need it?

- `NEXT_PUBLIC_` is a signal for **client/browser code only**. Browsers can't read
  `process.env` — there's no Node process in a browser. At build time, Next scans for
  `NEXT_PUBLIC_*` usages and string-replaces them with their literal values directly into the
  JS bundle sent to the browser. That's the entire mechanism.
- **Server-side code** (middleware, server components, API routes, server actions) runs in a
  real Node/Edge runtime where `process.env` works normally, prefix or not.
- So middleware never actually _needed_ the prefix — it would read `FEATURES` fine either way.
  The prefix is required here only because `Navbar.tsx` (`'use client'`) reads the same
  `FEATURES` object to filter `NAV_LINKS`. `NEXT_PUBLIC_` is a superset (works everywhere); it's
  just not a strict requirement for server-only consumers like middleware.

## Appendix: gated routes vs protected routes

These overlap but usually imply different reasons access is restricted:

- **Gated route** → availability controlled by a feature gate/flag/rollout state.
- **Protected route** → requires some condition to access (auth, role, subscription, feature
  availability, etc.).

A **route guard** is the code/middleware that checks the condition and allows, redirects, or
blocks access — the mechanism used above is a route guard implementing a feature gate.
