import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { FEATURES } from '@/config/features'
import { ROUTES } from '@/config/routes'

const GATED_ROUTES: Record<string, keyof typeof FEATURES> = {
  [ROUTES.projects]: 'projects',
  [ROUTES.about]: 'about',
  [ROUTES.experience]: 'experience',
  [ROUTES.blog]: 'blog',
}

/* 📚 Request URL terminology:

/blog/post-1 → the pathname
/blog → the parent route segment (or route prefix)
/post-1 → the child route segment

*/

export function proxy(request: NextRequest) {
  const reqPathname = request.nextUrl.pathname

  const gatedPrefixes = Object.keys(GATED_ROUTES)

  const reqPrefix = gatedPrefixes.find((prefix) => {
    return reqPathname === prefix || reqPathname.startsWith(`${prefix}/`)
  })

  if (!reqPrefix) return

  const isGateActive = !FEATURES[GATED_ROUTES[reqPrefix]]
  if (isGateActive) return NextResponse.rewrite(new URL('/whocares', request.url))
}

export const config = {
  matcher: ['/projects/:path*', '/experience/:path*', '/about/:path*', '/blog/:path*'],
}

/* 📚 config.matcher

- Middleware only runs for paths matched by config.matcher. 
- Unfortunately, Next uses it before runtime to decide which requests should invoke the proxy.
- This means that values need to be unavoidably hardcoded!
*/
