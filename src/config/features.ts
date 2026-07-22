export const FEATURES = {
  projects: process.env.NEXT_PUBLIC_FEATURE_PROJECTS !== 'false',
  about: process.env.NEXT_PUBLIC_FEATURE_ABOUT !== 'false',
  experience: process.env.NEXT_PUBLIC_FEATURE_EXPERIENCE !== 'false',
  blog: process.env.NEXT_PUBLIC_FEATURE_BLOG !== 'false',
  contact: process.env.NEXT_PUBLIC_FEATURE_CONTACT !== 'false',
} as const
