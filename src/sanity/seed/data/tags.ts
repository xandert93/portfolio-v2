const TAG_NAMES = [
  'HTML',
  'CSS',
  'Tailwind CSS',
  'JavaScript',
  'TypeScript',
  'Frontend',
  'React',
  'Redux',
  'Zustand',
  'State Management',
  'Next.js',

  'Backend',
  'Node.js',
  'Express',
  'API',
  'Auth',
  'NoSQL',
  'MongoDB',
  'SQL',
  'PostgreSQL',
  'Microservices',
  'Supabase',

  'Full Stack',
  'Architecture',
] as const

const toTagId = (name: string) => {
  return 'tag-' + name.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '') // e.g. 'Node.js' => 'tag-nodejs'
}

export const tags = TAG_NAMES.map((name) => ({
  _type: 'tag',
  _id: toTagId(name),
  name,
}))
