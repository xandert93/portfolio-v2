const toSkillId = (name: string) => {
  return (
    "skill-" + name.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "")
  ); // e.g. 'Node.js' => 'skill-nodejs'
};

export const SKILLS = [
  // Languages
  { name: "HTML5", category: "Language", proficiency: "Advanced" },
  { name: "CSS3", category: "Language", proficiency: "Advanced" },
  { name: "JavaScript", category: "Language", proficiency: "Expert" },
  { name: "TypeScript", category: "Language", proficiency: "Advanced" },
  { name: "C#", category: "Language", proficiency: "Intermediate" },
  { name: "SQL", category: "Language", proficiency: "Intermediate" },

  // Frameworks
  { name: "React", category: "Framework", proficiency: "Expert" },
  { name: "Next.js", category: "Framework", proficiency: "Advanced" },
  { name: "Express", category: "Framework", proficiency: "Advanced" },
  { name: "Vue.js", category: "Framework", proficiency: "Intermediate" },
  { name: "ASP.NET Core", category: "Framework", proficiency: "Intermediate" },

  // Platforms (incl. databases, for consistency)
  { name: "Node.js", category: "Platform", proficiency: "Advanced" },
  { name: "Supabase", category: "Platform", proficiency: "Intermediate" },
  { name: "MongoDB", category: "Platform", proficiency: "Intermediate" },
  { name: "MSSQL", category: "Platform", proficiency: "Intermediate" },
  { name: "PostgreSQL", category: "Platform", proficiency: "Intermediate" },
  { name: "Redis", category: "Platform", proficiency: "Intermediate" },
  { name: "Sanity", category: "Platform", proficiency: "Intermediate" },
  { name: "Docker", category: "Platform", proficiency: "Intermediate" },
  { name: "OpenAI", category: "Platform", proficiency: "Intermediate" },

  // Tools
  { name: "Redux", category: "Tool", proficiency: "Advanced" },
  { name: "TanStack Query", category: "Tool", proficiency: "Advanced" },
  { name: "React Router", category: "Tool", proficiency: "Advanced" },
  { name: "Tailwind CSS", category: "Tool", proficiency: "Advanced" },
  { name: "Sass", category: "Tool", proficiency: "Intermediate" },
  { name: "Vite", category: "Tool", proficiency: "Intermediate" },
  { name: "Zustand", category: "Tool", proficiency: "Intermediate" },
  { name: "Material UI", category: "Tool", proficiency: "Intermediate" },
  { name: "Prisma", category: "Tool", proficiency: "Intermediate" },
  { name: "Swagger & OpenAPI", category: "Tool", proficiency: "Intermediate" },
  { name: "Socket.io", category: "Tool", proficiency: "Intermediate" },
  { name: "Jest", category: "Tool", proficiency: "Intermediate" },
  { name: "Vitest", category: "Tool", proficiency: "Intermediate" },
  {
    name: "React Testing Library",
    category: "Tool",
    proficiency: "Intermediate",
  },
  { name: "Playwright", category: "Tool", proficiency: "Beginner" },

  // Other / Architecture
  { name: "REST APIs", category: "Other", proficiency: "Advanced" },
  { name: "Authentication", category: "Other", proficiency: "Advanced" },
  {
    name: "System Architecture",
    category: "Other",
    proficiency: "Intermediate",
  },
  { name: "Microservices", category: "Other", proficiency: "Intermediate" },
].map((skill) => ({
  _type: "skill",
  _id: toSkillId(skill.name),
  ...skill,
}));
