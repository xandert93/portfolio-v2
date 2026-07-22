# Known Issues & Workarounds

A running log of "why did we do this weird thing" notes — workarounds for bugs in tooling
(not our code), kept here so we don't waste time re-diagnosing them later.

---

## Dev server uses Webpack instead of Turbopack (Windows)

**What:** `package.json`'s `dev` script is `next dev --webpack` instead of the Next 16
default (`next dev`, which uses Turbopack).

**Why:** Turbopack has an open, currently-unfixed bug on Windows where it crashes while
processing CSS through PostCSS — a helper process it spawns for that work occasionally dies
mid-task, and Turbopack can't recover (logged as "connection forcibly closed", os error
10054). It first surfaced for us after merging Sanity Studio into the shared root layout
(so Studio's route compiles `globals.css` for the first time) — Studio's heavy bundle likely
made the underlying race condition more likely to trigger, though the bug isn't specific to
Studio or to our CSS itself; it's an upstream Turbopack/Windows issue affecting any project
that hits this code path.

**Cost:** Webpack is somewhat slower than Turbopack for dev server startup and hot-reload.
Noticeable but not painful for a project this size.

**Revisit when:** the upstream bug is fixed. Tracking issue:
https://github.com/vercel/next.js/discussions/85800
