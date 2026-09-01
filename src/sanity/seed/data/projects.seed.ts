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

// Helper to build a Key Feature entry (title + description).
function toFeature(title: string, description: string) {
  return {
    _type: 'object' as const,
    _key: key(),
    title,
    description,
  }
}

// Helper to build a Challenge & Solution entry (problem + rich-text solution).
function toChallenge(problem: string, solutionParagraphs: string[]) {
  return {
    _type: 'object' as const,
    _key: key(),
    problem,
    solution: toBlocks(solutionParagraphs),
  }
}

// Helper to build an Outcome Metric entry (label + value).
function toMetric(label: string, value: string) {
  return {
    _type: 'object' as const,
    _key: key(),
    label,
    value,
  }
}

type SeedProject = Omit<
  Project,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt' | 'media'
> & {
  media: { coverImageFilename: string }
}

export const PROJECTS: SeedProject[] = [
  {
    title: 'DevFlow',
    slug: {
      _type: 'slug',
      current: 'devflow-platform',
    },
    category: 'Full Stack',
    content: {
      summary:
        'A full-stack collaboration platform that helps software teams manage projects, share knowledge and track development workflows.',
      problem: toBlocks([
        'Small engineering teams often rely on scattered tools for tasks, documentation and communication. Context gets lost between a task tracker, a wiki and a chat app and nobody has a single view of what the team is actually working on.',
        'DevFlow set out to bring essential workflows into one unified platform, so a team could plan, document and ship without constantly switching context.',
      ]),
      solution: toBlocks([
        'DevFlow is a modern project management application built for developers. It combines task tracking, team collaboration and technical documentation into a single workspace, with a Kanban-style board at its core and Markdown docs living right alongside the tasks they describe.',
        'Every workspace gets its own set of projects, roles and permissions, so teams can onboard new members without exposing unrelated work.',
      ]),
      role: toBlocks([
        'Designed and built the application end-to-end as the sole engineer, from the initial database schema through the deployed production app, including auth, real-time updates and CI/CD.',
      ]),
      features: [
        toFeature(
          'Real-time project boards',
          'Kanban-style boards that sync instantly across every connected client using WebSockets, so status changes are visible to the whole team the moment they happen.',
        ),
        toFeature(
          'Team workspaces and permissions',
          'Role-based access control lets admins scope who can view, edit, or manage each project without exposing unrelated workspaces.',
        ),
        toFeature(
          'Markdown-based documentation',
          'A lightweight docs editor with live preview keeps technical documentation versioned and searchable alongside the tasks it describes.',
        ),
        toFeature(
          'Developer activity dashboard',
          'A per-team dashboard surfaces recent commits, task throughput and workload distribution to help leads spot bottlenecks early.',
        ),
      ],
      technicalDecisions: toBlocks([
        'Chose Postgres with a normalised schema for projects, users, roles and activity events, favoring relational integrity over a document store given how interconnected the data was.',
        'Used WebSockets for board updates instead of polling, which cut perceived latency significantly and kept the API load predictable as workspaces grew.',
      ]),
      challenges: [
        toChallenge(
          'Designing a scalable data model for projects, users, roles and activity tracking',
          [
            'Started with a flexible, normalised schema that separated workspace membership from project-level permissions, which made it straightforward to add new roles later without migrating existing data.',
          ],
        ),
        toChallenge(
          'Keeping real-time board updates consistent across many simultaneous clients',
          [
            'Introduced optimistic UI updates on the client paired with a server-side event log, so conflicting edits could be reconciled deterministically instead of relying on last-write-wins.',
          ],
        ),
        toChallenge(
          'Handling complex permission checks without making the application logic difficult to maintain',
          [
            'Centralised authorisation rules into reusable permission checks instead of scattering role conditions throughout the UI and API routes, making access control easier to audit and extend as new workspace and project roles were introduced.',
          ],
        ),
        toChallenge(
          'Keeping documentation, tasks and activity data fast to search as workspaces grew',
          [
            'Added targeted database indexes and full-text search for frequently queried fields, while keeping heavier activity queries scoped to the relevant workspace and time range so dashboards remained responsive without over-fetching data.',
          ],
        ),
      ],
      outcome: {
        summary: toBlocks([
          'DevFlow is used daily by a small team to plan and ship its own releases, replacing three separate tools with one workspace and giving the team a single source of truth for both tasks and documentation.',
        ]),
        metrics: [
          toMetric('Tools replaced', '3 → 1'),
          toMetric('Board update latency', '<200ms'),
          toMetric('Team adoption', 'Daily, in production'),
        ],
        learnings: toBlocks([
          'Centralising permission checks early paid off more than expected — every new role added later slotted into the same authorisation layer instead of requiring changes across the UI and API.',
          'Reconciling real-time edits with an event log rather than last-write-wins was more work upfront, but it removed an entire class of "why did my change disappear" bugs that would have been painful to debug in production.',
        ]),
      },
      technologies: ['next', 'typescript', 'node', 'postgresql'].map(genSkill),
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
        'An AI-powered resume builder that helps users generate, customise and export professional resumes.',
      problem: toBlocks([
        'Many job seekers struggle to create resumes tailored to specific roles. Staring at a blank page and rewording the same bullet points for every application is slow and it is easy to undersell relevant experience.',
      ]),
      solution: toBlocks([
        'The AI Resume Builder provides an intuitive interface for creating resumes with smart suggestions, templates and export options. Users paste in a job description and their existing experience and the app suggests tailored bullet points they can accept, edit, or discard.',
      ]),
      role: toBlocks([
        'Built the frontend and the AI-suggestion integration, including the prompt design used to generate resume content and the live-preview editor.',
      ]),
      features: [
        toFeature(
          'AI-powered content suggestions',
          'Generates tailored bullet points and summaries based on the target job description and the user’s existing experience.',
        ),
        toFeature(
          'Multiple resume templates',
          'A gallery of print-ready templates that keep formatting consistent while content is edited.',
        ),
        toFeature('PDF export', 'One-click export to a polished, ATS-friendly PDF.'),
        toFeature(
          'Live resume preview',
          'Edits in the form update the rendered resume instantly, so users always see the final layout as they write.',
        ),
      ],
      technicalDecisions: toBlocks([
        'Built a flexible editor system capable of handling multiple resume layouts by separating resume content from presentation, so a template swap never touches the underlying data.',
        'Used the OpenAI API for content suggestions with a constrained prompt format, which kept generated text on-brand and easy to validate before insertion.',
      ]),
      challenges: [
        toChallenge(
          'Handling multiple resume layouts without duplicating content logic',
          [
            'Modeled resume content as structured data independent of any single template and rendered each template as a pure function of that data, which made adding new templates a purely visual exercise.',
          ],
        ),
        toChallenge('Keeping AI suggestions relevant instead of generic', [
          'Refined the prompt to require the job description and existing bullet points as context, then post-processed suggestions to strip filler language before showing them to the user.',
        ]),
      ],
      outcome: {
        summary: toBlocks([
          'The tool has helped users tailor resumes to specific postings in minutes instead of hours, with the live preview and template system praised for making the final document feel polished without design skills.',
        ]),
        metrics: [
          toMetric('Resume draft time', 'Hours → Minutes'),
          toMetric('Templates shipped', '6'),
          toMetric('AI suggestion acceptance rate', '~70%'),
        ],
        learnings: toBlocks([
          'Constraining the prompt with explicit context — the job description and the user’s existing bullet points — did more for output quality than any amount of prompt "cleverness" on its own.',
          'Separating content from presentation early meant new templates became a design task, not an engineering one, which turned out to matter a lot once the template gallery started growing.',
        ]),
      },
      technologies: ['react', 'typescript', 'tailwindcss', 'openai'].map(genSkill),
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
        'A scalable backend API powering e-commerce applications with authentication, inventory and payment workflows.',
      problem: toBlocks([
        'Growing online stores need reliable APIs that can handle products, orders, users and transactions efficiently, without the team having to rebuild core commerce logic for every new storefront.',
      ]),
      solution: toBlocks([
        'Commerce Engine API provides a robust backend foundation for modern online stores with secure authentication and a scalable, service-oriented architecture. A single API can power multiple frontends, from a web storefront to a mobile app, without duplicating business logic.',
      ]),
      role: toBlocks([
        'Designed the API architecture and data model and implemented authentication, inventory and order-processing services.',
      ]),
      features: [
        toFeature(
          'JWT authentication',
          'Stateless, token-based authentication with refresh tokens, suitable for both web and mobile clients.',
        ),
        toFeature(
          'Product and inventory management',
          'Endpoints for managing large product catalogs, variants and stock levels with optimistic locking to prevent overselling.',
        ),
        toFeature(
          'Order processing',
          'A transactional order pipeline that validates inventory, applies pricing rules and records payment state.',
        ),
        toFeature(
          'RESTful API architecture',
          'A consistent, versioned REST interface with predictable resource naming and pagination.',
        ),
      ],
      technicalDecisions: toBlocks([
        'Containerised the API with Docker to keep local, staging and production environments consistent and to simplify horizontal scaling behind a load balancer.',
        'Implemented database optimization strategies, including targeted indexes and denormalised read models, for handling large product catalogs without slow query times.',
      ]),
      challenges: [
        toChallenge('Preventing overselling under concurrent order requests', [
          'Added optimistic locking on inventory rows and wrapped order creation in a database transaction, so two simultaneous purchases could never both succeed against the same last unit of stock.',
        ]),
        toChallenge('Keeping catalog queries fast as the product count grew', [
          'Introduced targeted indexes and a read-optimised denormalised view for catalog browsing, separate from the normalised write model used for inventory updates.',
        ]),
      ],
      outcome: {
        summary: toBlocks([
          'The API now serves as the shared backend for several small storefronts, with inventory and order logic centralised so new frontends can be built without reimplementing core commerce behavior.',
        ]),
        metrics: [
          toMetric('Storefronts powered', '3'),
          toMetric('Overselling incidents', '0 since launch'),
          toMetric('API endpoints', '40+'),
        ],
        learnings: toBlocks([
          'Wrapping order creation in a single transaction with optimistic locking removed an entire category of race-condition bugs that would otherwise have surfaced only under real concurrent load.',
          'Separating the read-optimised catalog view from the normalised write model made a bigger difference to perceived performance than any individual query optimisation.',
        ]),
      },
      technologies: ['node', 'express', 'postgresql', 'docker'].map(genSkill),
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
        'A clean portfolio website system with a custom CMS for managing projects, articles and personal branding.',
      problem: toBlocks([
        'Developers and designers need flexible portfolio systems without manually updating static content every time they ship something new. Hand-editing HTML for every new project entry does not scale and most off-the-shelf site builders trade away performance and design control.',
      ]),
      solution: toBlocks([
        'A visually focused portfolio platform designed around performance, accessibility and content management. A lightweight custom CMS lets the owner add projects and articles through a structured editor, while the frontend stays fast and fully under the owner’s design control.',
      ]),
      role: toBlocks([
        'Designed the visual system and component library and built the CMS schema used to manage projects and articles.',
      ]),
      features: [
        toFeature(
          'Dynamic project management',
          'Projects, articles and personal details are all managed through a structured content model instead of hard-coded markup.',
        ),
        toFeature(
          'Responsive design system',
          'A small set of reusable components covers every page, keeping spacing, type and color consistent across the site.',
        ),
        toFeature(
          'SEO optimization',
          'Server-rendered pages with structured metadata and sitemaps, tuned for strong search visibility.',
        ),
        toFeature(
          'CMS-powered content',
          'Non-technical edits, from a new project entry to a bio update, can be made without touching code.',
        ),
      ],
      technicalDecisions: toBlocks([
        'Created reusable design components while maintaining strong performance scores, favoring server rendering and minimal client-side JavaScript over a heavier single-page app approach.',
      ]),
      challenges: [
        toChallenge(
          'Keeping Lighthouse performance scores high while adding a full CMS',
          [
            'Moved content fetching to build- and request-time server rendering rather than client-side fetching and kept the component library intentionally small to avoid unnecessary JavaScript.',
          ],
        ),
      ],
      outcome: {
        summary: toBlocks([
          'The resulting site loads quickly, scores well on accessibility and SEO audits and lets its owner publish new work in minutes instead of editing markup by hand.',
        ]),
        metrics: [
          toMetric('Lighthouse performance score', '98/100'),
          toMetric('Time to publish a new project', 'Minutes, no code'),
          toMetric('Client-side JS shipped', 'Minimal'),
        ],
        learnings: toBlocks([
          'Defaulting to server rendering and only reaching for client-side JavaScript when genuinely needed kept performance scores high without requiring constant manual tuning.',
          'Keeping the component library intentionally small made the design system easier to keep consistent, even as new content types were added to the CMS.',
        ]),
      },
      technologies: ['next', 'sanity', 'tailwindcss'].map(genSkill),
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
      problem: toBlocks([
        'Teams frequently need simple custom forms, but existing solutions are expensive, locked behind subscriptions, or too restrictive to adapt to unusual field requirements.',
      ]),
      solution: toBlocks([
        'A community-driven form builder that enables users to visually create, publish and manage forms. Forms are assembled from a drag-and-drop editor and stored as a portable JSON schema that can be exported, versioned, or embedded anywhere.',
      ]),
      role: toBlocks([
        'Created and maintain the project as an open-source maintainer, reviewing community contributions and designing the plugin API.',
      ]),
      features: [
        toFeature(
          'Drag-and-drop editor',
          'A visual canvas for arranging fields, sections and logic without writing any code.',
        ),
        toFeature(
          'Custom field types',
          'A plugin system lets contributors add new field types beyond the built-in set.',
        ),
        toFeature(
          'JSON schema export',
          'Every form compiles to a portable JSON schema that can be versioned, diffed, or embedded in other applications.',
        ),
        toFeature(
          'Community plugins',
          'An open registry of community-built plugins extends the builder with new fields and validation rules.',
        ),
      ],
      technicalDecisions: toBlocks([
        'Developed a flexible component architecture supporting unlimited form configurations by treating every field, including built-in ones, as a plugin implementing the same interface.',
        'Used Zustand for state management to keep the editor’s store small and easy for outside contributors to reason about.',
      ]),
      challenges: [
        toChallenge(
          'Supporting arbitrary custom field types from community contributors',
          [
            'Defined a minimal plugin interface that every field type, built-in or community-made, must implement, which let new field types be added without changes to the core editor.',
          ],
        ),
        toChallenge('Keeping the exported schema stable as the editor evolved', [
          'Versioned the JSON schema format explicitly and wrote a migration step for older exports, so existing embedded forms kept working across editor updates.',
        ]),
      ],
      outcome: {
        summary: toBlocks([
          'The project has grown an active contributor base building custom field plugins and its portable JSON schema is now used to embed forms in several unrelated applications.',
        ]),
        metrics: [
          toMetric('Community plugins', '12+'),
          toMetric('GitHub stars', '450+'),
          toMetric('Schema versions shipped', '3, all backward compatible'),
        ],
        learnings: toBlocks([
          'Treating built-in fields as plugins rather than special-casing them turned out to be the single decision that made the project genuinely extensible by outside contributors.',
          'Explicit schema versioning felt like overhead early on, but it meant no embedded form ever broke silently after an editor update — a small upfront cost that avoided a much bigger one later.',
        ]),
      },
      technologies: ['react', 'typescript', 'zustand'].map(genSkill),
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
      problem: toBlocks([
        'Clinics needed a simpler way to manage appointments and reduce manual scheduling overhead. Phone-based booking led to double-bookings, missed calls and staff time spent on scheduling instead of patient care.',
      ]),
      solution: toBlocks([
        'A production-ready booking platform focused on usability, reliability and secure patient workflows. Patients can search for available providers, book a time slot in real time and receive automated confirmations and reminders by email.',
      ]),
      role: toBlocks([
        'Delivered the project as a contractor for the client, handling scheduling logic, authentication and email notifications end-to-end.',
      ]),
      features: [
        toFeature(
          'Appointment scheduling',
          'Real-time availability search across providers, with automatic slot locking to prevent double-booking.',
        ),
        toFeature(
          'User authentication',
          'Secure patient accounts with session management to protect personal health information.',
        ),
        toFeature(
          'Provider management',
          'A staff-facing dashboard for providers to set availability, block time off and view upcoming appointments.',
        ),
        toFeature(
          'Email notifications',
          'Automated booking confirmations and reminder emails, reducing missed appointments.',
        ),
      ],
      technicalDecisions: toBlocks([
        'Built reliable scheduling logic to prevent booking conflicts by locking a time slot for a short window during checkout, releasing it automatically if the booking was not completed.',
        'Used Resend for transactional email so confirmations and reminders were delivered reliably without maintaining custom SMTP infrastructure.',
      ]),
      challenges: [
        toChallenge('Preventing double-bookings during concurrent scheduling requests', [
          'Introduced a short-lived slot hold at the start of checkout, backed by a database constraint, so two patients could never confirm the same appointment time.',
        ]),
        toChallenge(
          'Keeping patient data secure while remaining easy for staff to use daily',
          [
            'Separated patient-facing and staff-facing authentication scopes and limited the provider dashboard to only the data needed for scheduling.',
          ],
        ),
      ],
      outcome: {
        summary: toBlocks([
          'The clinic reported a meaningful drop in scheduling errors and phone-based bookings after launch, with automated reminders cutting down on missed appointments.',
        ]),
        metrics: [
          toMetric('Scheduling errors', 'Reduced significantly'),
          toMetric('Missed appointments', 'Down, via automated reminders'),
          toMetric('Phone-based bookings', 'Largely replaced by self-service'),
        ],
        learnings: toBlocks([
          'A short-lived slot hold backed by a database constraint was a small piece of logic that eliminated the client’s single biggest source of scheduling complaints.',
          'Keeping patient- and staff-facing authentication scopes strictly separate from the start made it much easier to reason about what data the provider dashboard actually needed to expose.',
        ]),
      },
      technologies: ['next', 'typescript', 'postgresql', 'resend'].map(genSkill),
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
