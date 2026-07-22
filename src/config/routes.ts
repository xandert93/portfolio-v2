export const ROUTES = {
  home: '/',
  projects: '/projects',
  about: '/about',
  experience: '/experience',
  blog: '/blog',
  contact: '/contact',
} as const

export type Route = (typeof ROUTES)[keyof typeof ROUTES]
