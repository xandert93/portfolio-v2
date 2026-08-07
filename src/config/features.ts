/* 📚 In development, feature availability is controlled through .env.local,
where each feature can be explicitly enabled or disabled. By default,
.env.local currently enables all features so they can be developed and
tested locally.

In Vercel, these values can be configured independently through the
project's Environment Variables. This allows us to selectively expose
features based on their deployment readiness. For example, if the
projects feature is ready for production but about is not, we can set
NEXT_PUBLIC_FEATURE_PROJECTS=true and
NEXT_PUBLIC_FEATURE_ABOUT=false.

When a request reaches the Next.js middleware, the middleware uses these
flags to determine whether the requested route is currently enabled.
If a feature is disabled, access to its route is blocked and the
request is redirected to a 404 page. Otherwise, the requested page is
allowed to proceed.

A feature is enabled by default unless its corresponding environment
variable is explicitly set to "false".
*/

export const FEATURES = {
  projects: process.env.NEXT_PUBLIC_FEATURE_PROJECTS === 'true',
  about: process.env.NEXT_PUBLIC_FEATURE_ABOUT === 'true',
  experience: process.env.NEXT_PUBLIC_FEATURE_EXPERIENCE === 'true',
  blog: process.env.NEXT_PUBLIC_FEATURE_BLOG === 'true',
  contact: process.env.NEXT_PUBLIC_FEATURE_CONTACT === 'true',
} as const
