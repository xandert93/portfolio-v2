const toSkillId = (name: string) => {
  return 'skill-' + name.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '') // e.g. 'Node.js' => 'skill-nodejs'
}

/* Why this file naming works?

📚 This convention is widely used across icon packs and GitHub repositories, so it's easy to work with and predictable. 

The only special cases are things like #, +, &, and . which are handled automatically, meaning you shouldn't need a lookup table for your current list:

*/
const toLogoFilename = (name: string) => {
  return (
    name
      .trim()
      .replace(/#/g, ' Sharp')
      .replace(/\+/g, ' Plus')
      .replace(/&/g, '')
      .replace(/\./g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase() + '.png'
  )
}

export const SKILLS = [
  // Languages
  { name: 'HTML5', category: 'Languages' },
  { name: 'CSS3', category: 'Languages' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'TypeScript', category: 'Languages' },
  // { name: 'C#', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },

  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Next', category: 'Frontend' },
  { name: 'Vue', category: 'Frontend' },
  { name: 'Nuxt', category: 'Frontend' },
  // { name: 'Astro', category: 'Frontend' },
  // { name: 'Remix', category: 'Frontend' },
  // { name: 'Solid', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  // { name: 'Post CSS', category: 'Frontend' },
  { name: 'Sass', category: 'Frontend' },
  { name: 'Styled Components', category: 'Frontend' },
  { name: 'Material UI', category: 'Frontend' },
  { name: 'Storybook', category: 'Frontend' },
  { name: 'Motion', category: 'Frontend' },
  { name: 'Redux', category: 'Frontend' },
  { name: 'Zustand', category: 'Frontend' },
  { name: 'TanStack Query', category: 'Frontend' },
  // { name: 'Apollo', category: 'Frontend' },
  { name: 'React Router', category: 'Frontend' },
  { name: 'Vite', category: 'Frontend' },

  // Backend
  { name: 'Node', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'NestJS', category: 'Backend' },
  // { name: 'ASP.NET Core', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },
  { name: 'JWT', category: 'Backend' },
  // { name: 'Passport', category: 'Backend' },
  // { name: 'Auth', category: 'Backend' },
  { name: 'Socket.io', category: 'Backend' },
  { name: 'Swagger', category: 'Backend' },

  // Databases & ORM
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  // { name: 'Mongoose', category: 'Databases' },
  // { name: 'MSSQL', category: 'Databases' },
  // { name: 'Redis', category: 'Databases' },
  { name: 'Prisma', category: 'Databases' },
  { name: 'Knex', category: 'Databases' },
  { name: 'Drizzle', category: 'Databases' },

  // DevOps & Cloud
  { name: 'Docker', category: 'DevOps' },
  { name: 'Git', category: 'DevOps' },

  // Testing
  { name: 'Jest', category: 'Testing' },
  { name: 'Vitest', category: 'Testing' },
  { name: 'React Testing Library', category: 'Testing' },
  { name: 'Cypress', category: 'Testing' },
  // { name: 'Playwright', category: 'Testing' },

  // CMS & SaaS
  { name: 'Sanity', category: 'CMS & SaaS' },
  // { name: 'Contentful', category: 'CMS & SaaS' },
  { name: 'Firebase', category: 'CMS & SaaS' },
  { name: 'Supabase', category: 'CMS & SaaS' },
  { name: 'Stripe', category: 'CMS & SaaS' },
  { name: 'Resend', category: 'CMS & SaaS' },
  // { name: 'Cloudinary', category: 'CMS & SaaS' },

  // AI
  { name: 'OpenAI', category: 'AI' },

  /*   

  // Other / Architecture
  { name: 'Authentication', category: 'Other'},
  {
    name: 'System Architecture',
    category: 'Other',
  },
  { name: 'Microservices', category: 'Other' }, */
].map((skill) => ({
  _id: toSkillId(skill.name),
  logoFilename: toLogoFilename(skill.name),
  ...skill,
}))
