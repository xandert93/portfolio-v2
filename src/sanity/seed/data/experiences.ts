import { genSkill } from '../utils'

export const EXPERIENCES = [
  {
    company: {
      name: 'Ravenware',
      website: 'https://web.ravenware.co.uk/',
      logoFilename: 'ravenware.jpg',
    },

    employment: {
      startDate: '2024-02-01',
      isCurrent: true,
      location: 'Southend-on-Sea, UK • Hybrid',
    },

    role: {
      title: 'Junior Software Developer',
      summary:
        'Junior full-stack developer contributing to web application features and API development in a fast-moving agile team.',
      highlights: [
        'Built and maintained features using Vue.js and ASP.NET Core',
        'Developed REST APIs and supported backend services',
        'Fixed bugs, improved performance, and maintained code quality',
        'Participated in code reviews and agile ceremonies',
        'Collaborated with designers and QA to deliver production features',
        'Worked with PostgreSQL and basic AWS services',
      ],
      impact:
        'Improved API performance by approximately 25% while delivering multiple production features and steadily increasing automated test coverage.',
    },

    skills: [genSkill('aspnetcore'), genSkill('mssql'), genSkill('vuejs')],

    slug: {
      _type: 'slug',
      current: 'software-developer-ravenware',
    },
  },

  {
    _type: 'experience',
    company: {
      name: 'Superprof',
      website: 'https://www.superprof.co.uk',
      logoFilename: 'placeholder.png',
    },
    employment: {
      startDate: '2022-02-01',
      isCurrent: true,
      location: 'London & Remote',
    },
    role: {
      title: 'Web Development Tutor',
      summary:
        'Deliver one-to-one web development tuition, creating tailored lesson plans and mentoring students through modern frontend and full-stack technologies. Adapt teaching styles to suit learners of varying abilities while helping them build practical, real-world development skills.',
      highlights: [
        'Created personalised JavaScript and React learning plans.',
        'Mentored students in Redux, Next.js, Tailwind CSS, SASS and Material UI.',
        'Supported students in completing full-stack development projects.',
        'Simplified complex technical concepts for learners of all experience levels.',
      ],
      impact:
        'Helped students build confidence with modern web technologies and develop practical skills that supported academic success, portfolio development and career progression.',
    },
    skills: [],
    slug: {
      current: 'web-development-tutor-superprof',
    },
  },

  {
    _type: 'experience',
    company: {
      name: 'Upwork',
      website: 'https://www.upwork.com',
      logoFilename: 'placeholder.png',
    },
    employment: {
      startDate: '2023-05-01',
      isCurrent: true,
      location: 'Remote',
    },
    role: {
      title: 'Freelance Developer',
      summary:
        'Worked directly with clients to design, build and improve web applications, translating business requirements into functional features while maintaining clear communication and delivering projects on schedule.',
      highlights: [
        'Collaborated with clients to gather and refine feature requirements.',
        'Delivered revisions quickly while consistently meeting project deadlines.',
        'Built responsive interfaces using HTML, CSS and JavaScript.',
        'Improved user experience through feature enhancements and UI improvements.',
      ],
      impact:
        'Delivered reliable frontend solutions that improved client satisfaction through responsive communication, high-quality implementations and timely project delivery.',
    },
    skills: [],
    slug: {
      current: 'freelance-developer-upwork',
    },
  },

  {
    _type: 'experience',
    company: {
      name: 'Ravenware',
      logoFilename: 'placeholder.png',
    },
    employment: {
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      isCurrent: false,
      location: 'Essex',
    },
    role: {
      title: 'Junior Developer',
      summary:
        'Contributed to the development of modern CRM systems, migrating legacy applications and improving backend performance while working closely with cross-functional teams using Vue, Nuxt and .NET technologies.',
      highlights: [
        'Developed two CRM systems using Vue 3 and PrimeVue.',
        'Migrated a legacy Vue 2 application to Nuxt.',
        'Implemented .NET REST APIs and optimised SQL Server stored procedures.',
        'Collaborated across frontend and backend teams to improve application performance.',
      ],
      impact:
        'Improved user efficiency by 30%, reduced data entry errors by 25%, increased page load performance by 40%, reduced backend latency by 15% and supported a 20% increase in concurrent users.',
    },
    skills: [],
    slug: {
      current: 'junior-developer-ravenware',
    },
  },

  {
    _type: 'experience',
    company: {
      name: 'Northcoders',
      website: 'https://northcoders.com',
      logoFilename: 'placeholder.png',
    },
    employment: {
      startDate: '2023-08-01',
      endDate: '2023-12-01',
      isCurrent: false,
      location: 'Manchester',
    },
    role: {
      title: 'Trainee Software Developer',
      summary:
        'Completed an intensive software engineering bootcamp covering modern full-stack development, agile methodologies and collaborative engineering practices while building production-ready applications individually and in teams.',
      highlights: [
        'Completed an intensive 13-week full-stack software development programme.',
        'Applied Test-Driven Development and pair programming daily.',
        'Built applications using JavaScript, React, Node.js and PostgreSQL.',
        'Worked within Agile teams using Git-based workflows.',
      ],
      impact:
        'Developed a strong foundation in modern software engineering practices, enabling a smooth transition into professional software development and subsequent commercial roles.',
    },
    skills: [],
    slug: {
      current: 'trainee-software-developer-northcoders',
    },
  },
] as const
