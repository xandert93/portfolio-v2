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

// Middleware only runs for paths matched by config.matcher
export const config = {
  matcher: ['/projects/:path*', '/experience/:path*', '/about/:path*', '/blog/:path*'],
}
