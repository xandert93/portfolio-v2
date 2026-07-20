import { Project } from '@/sanity/generated-types'
import { genSkill } from '../utils'
import { randomUUID } from 'crypto'

// Small helper so every Portable Text block/span gets a valid Sanity _key.
const key = () => randomUUID().slice(0, 12)

// Helper to build a valid Portable Text array from plain paragraphs.
function toBlocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block' as const,
    _key: key(),
    style: 'normal' as const,
    markDefs: [],
    children: [
      {
        _type: 'span' as const,
        _key: key(),
        text,
        marks: [],
      },
    ],
  }))
}

export const PROJECTS: Project[] = [
  {
    title: 'DevFlow',
    slug: {
      _type: 'slug',
      current: 'devflow-platform',
    },
    category: 'Full Stack',
    content: {
      summary:
        'A full-stack collaboration platform that helps software teams manage projects, share knowledge, and track development workflows.',
      problem:
        'Small engineering teams often rely on scattered tools for tasks, documentation, and communication. DevFlow brings essential workflows into one unified platform.',
      description: toBlocks([
        'DevFlow is a modern project management application built for developers. It combines task tracking, team collaboration, and technical documentation into a single workspace.',
      ]),
      technologies: ['nextjs', 'typescript', 'nodejs', 'postgresql'].map(genSkill),
      features: [
        'Real-time project boards',
        'Team workspaces and permissions',
        'Markdown-based documentation',
        'Developer activity dashboard',
      ],
      challenges: toBlocks([
        'Designed a scalable database structure for projects, users, roles, and activity tracking.',
      ]),
    },

    media: {
      coverImageFilename: 'placeholder.png',
    },

    urls: {
      repo: 'https://github.com/example/devflow',
      live: 'https://devflow.example.com',
    },

    isFeatured: true,
    date: '2026-01-15',
  },

  {
    title: 'AI Resume Builder',
    slug: {
      _type: 'slug',
      current: 'ai-resume-builder',
    },
    category: 'Frontend',
    content: {
      summary:
        'An AI-powered resume builder that helps users generate, customize, and export professional resumes.',
      problem:
        'Many job seekers struggle to create resumes tailored to specific roles. This application simplifies the process using AI assistance.',
      description: toBlocks([
        'The AI Resume Builder provides an intuitive interface for creating resumes with smart suggestions, templates, and export options.',
      ]),
      technologies: ['react', 'typescript', 'tailwindcss', 'openai'].map(genSkill),
      features: [
        'AI-powered content suggestions',
        'Multiple resume templates',
        'PDF export',
        'Live resume preview',
      ],
      challenges: toBlocks([
        'Built a flexible editor system capable of handling multiple resume layouts.',
      ]),
    },

    media: {
      coverImageFilename: 'placeholder.png',
    },

    urls: {
      repo: 'https://github.com/example/ai-resume-builder',
      live: 'https://resume-ai.example.com',
    },
    isFeatured: true,
    date: '2025-11-20',
  },

  {
    title: 'Commerce Engine API',
    slug: {
      _type: 'slug',
      current: 'commerce-engine-api',
    },
    category: 'Backend',
    content: {
      summary:
        'A scalable backend API powering e-commerce applications with authentication, inventory, and payment workflows.',
      problem:
        'Growing online stores need reliable APIs that can handle products, orders, users, and transactions efficiently.',
      description: toBlocks([
        'Commerce Engine API provides a robust backend foundation for modern online stores with secure authentication and scalable architecture.',
      ]),
      technologies: ['nodejs', 'express', 'postgresql', 'docker'].map(genSkill),
      features: [
        'JWT authentication',
        'Product and inventory management',
        'Order processing',
        'RESTful API architecture',
      ],
      challenges: toBlocks([
        'Implemented database optimization strategies for handling large product catalogs.',
      ]),
    },

    media: {
      coverImageFilename: 'placeholder.png',
    },

    urls: {
      repo: 'https://github.com/example/commerce-api',
    },
    isFeatured: false,
    date: '2025-09-10',
  },

  {
    title: 'Minimal Portfolio CMS',
    slug: {
      _type: 'slug',
      current: 'minimal-portfolio-cms',
    },
    category: 'UI/UX',
    content: {
      summary:
        'A clean portfolio website system with a custom CMS for managing projects, articles, and personal branding.',
      problem:
        'Developers and designers need flexible portfolio systems without manually updating static content.',
      description: toBlocks([
        'A visually focused portfolio platform designed around performance, accessibility, and content management.',
      ]),
      technologies: ['nextjs', 'sanity', 'tailwindcss'].map(genSkill),
      features: [
        'Dynamic project management',
        'Responsive design system',
        'SEO optimization',
        'CMS-powered content',
      ],
      challenges: toBlocks([
        'Created reusable design components while maintaining strong performance scores.',
      ]),
    },

    media: {
      coverImageFilename: 'placeholder.png',
    },

    urls: {
      repo: 'https://github.com/example/portfolio-cms',
      live: 'https://portfolio.example.com',
    },
    isFeatured: true,
    date: '2025-07-25',
  },

  {
    title: 'Open Source Form Builder',
    slug: {
      _type: 'slug',
      current: 'open-source-form-builder',
    },
    category: 'Open Source',
    content: {
      summary:
        'An open-source drag-and-drop form builder for creating custom forms without writing code.',
      problem:
        'Teams frequently need simple custom forms but existing solutions are expensive or restrictive.',
      description: toBlocks([
        'A community-driven form builder that enables users to visually create, publish, and manage forms.',
      ]),
      technologies: ['react', 'typescript', 'zustand'].map(genSkill),
      features: [
        'Drag-and-drop editor',
        'Custom field types',
        'JSON schema export',
        'Community plugins',
      ],
      challenges: toBlocks([
        'Developed a flexible component architecture supporting unlimited form configurations.',
      ]),
    },

    media: {
      coverImageFilename: 'placeholder.png',
    },

    urls: {
      repo: 'https://github.com/example/form-builder',
      live: 'https://forms.example.com',
    },
    isFeatured: false,
    date: '2025-05-12',
  },

  {
    title: 'Healthcare Appointment Platform',
    slug: {
      _type: 'slug',
      current: 'healthcare-appointment-platform',
    },
    category: 'Client Work',
    content: {
      summary:
        'A patient appointment platform that connects users with healthcare providers through an easy booking workflow.',
      problem:
        'Clinics needed a simpler way to manage appointments and reduce manual scheduling overhead.',
      description: toBlocks([
        'A production-ready booking platform focused on usability, reliability, and secure patient workflows.',
      ]),
      technologies: ['nextjs', 'typescript', 'postgresql', 'redis'].map(genSkill),
      features: [
        'Appointment scheduling',
        'User authentication',
        'Provider management',
        'Email notifications',
      ],
      challenges: toBlocks([
        'Built reliable scheduling logic to prevent booking conflicts and improve user experience.',
      ]),
    },

    media: {
      coverImageFilename: 'placeholder.png',
    },

    urls: {
      live: 'https://healthcare-platform.example.com',
    },
    isFeatured: true,
    date: '2025-03-18',
  },
]
