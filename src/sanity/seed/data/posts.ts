/*
In Sanity, an image field is not a URL or file path. Instead, it needs to hold an reference to an asset that's already stored on Sanity. It looks like:

image: {
  asset: {
    _ref: "image-abc123-2000x1200-jpg"
  }
}

So we must:
1. Upload file → Sanity asset
2. Get returned asset._id
3. Store that in our seeded document
*/

import { genTag, pt } from '../utils'

// To be added during hydration: { _type: post, coverImage: <asset._id> }

export const posts = [
  {
    title: 'Building a REST API with Node.js and Express from Scratch',
    slug: { current: 'building-rest-api-node-express' },
    coverImageFilename: 'api-node-express.jpg',
    excerpt:
      'A practical guide to structuring and building a clean REST API using Node.js, Express, and modern best practices.',
    publishedAt: '2026-06-10T10:00:00.000Z',

    body: [
      pt.h2('Project Setup'),
      pt.p(
        'Start by initialising a Node.js project and installing Express. Keep your structure modular from the beginning.',
      ),
      pt.code('npm init -y\nnpm install express', 'bash'),

      pt.h2('Core Architecture'),
      pt.p(
        'Separate routes, controllers, and services. This keeps your API scalable and testable.',
      ),
      pt.bullet('Routes handle HTTP layer'),
      pt.bullet('Controllers handle logic'),
      pt.bullet('Services handle data/business logic'),
    ],

    tags: [genTag('tag-nodejs'), genTag('tag-express'), genTag('tag-backend')],
  },

  {
    title: 'React State Management Without the Overhead',
    slug: { current: 'react-state-management-without-overhead' },
    coverImageFilename: 'react-state-management.jpg',
    excerpt:
      'Understanding practical state management patterns in React without immediately jumping to complex libraries.',
    publishedAt: '2026-06-08T09:30:00.000Z',

    body: [
      pt.h2('When Local State is Enough'),
      pt.p(
        'Most React apps do not need Redux or complex state libraries. Start with local state and scale only when needed.',
      ),

      pt.h2('Patterns to Use'),
      pt.bullet('useState for local UI state'),
      pt.bullet('useReducer for complex transitions'),
      pt.bullet('Context for shared app state'),
    ],

    tags: [genTag('tag-react'), genTag('tag-frontend')],
  },

  {
    title: 'JWT Authentication in Express: A Practical Implementation',
    slug: { current: 'jwt-authentication-express-practical' },
    coverImageFilename: 'jwt-auth-express.jpg',
    excerpt:
      'A step-by-step breakdown of implementing secure authentication using JSON Web Tokens in an Express API.',
    publishedAt: '2026-06-05T14:00:00.000Z',

    body: [
      pt.h2('Token Generation'),
      pt.code(
        `const jwt = require('jsonwebtoken');
         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '1h',
});`,
        'js',
      ),

      pt.h2('Protecting Routes'),
      pt.p(
        'Middleware checks for a valid token before allowing access to protected routes.',
      ),
    ],

    tags: [genTag('tag-auth'), genTag('tag-nodejs')],
  },

  {
    title: 'Common API Design Mistakes (and How to Fix Them)',
    slug: { current: 'common-api-design-mistakes-fixes' },
    coverImageFilename: 'api-design-mistakes.jpg',
    excerpt:
      'A breakdown of frequent REST API design mistakes and practical ways to improve structure, consistency, and scalability.',
    publishedAt: '2026-06-02T11:00:00.000Z',

    body: [
      pt.h2('Common Mistake: Inconsistent Routes'),
      pt.p(
        'Using inconsistent naming conventions leads to confusion and poor maintainability.',
      ),

      pt.h2('Better Approach'),
      pt.bullet('Use plural nouns for resources (/users, /posts)'),
      pt.bullet('Keep URL structure predictable'),
    ],

    tags: [genTag('tag-api'), genTag('tag-backend')],
  },

  {
    title: 'How I Structure a Full-Stack Project for Scalability',
    slug: { current: 'fullstack-project-structure-scalability' },
    coverImageFilename: 'fullstack-project-structure.jpg',
    excerpt:
      'A look into how I organize full-stack applications for maintainability and long-term scalability.',
    publishedAt: '2026-05-28T16:00:00.000Z',

    body: [
      pt.h2('Folder Structure'),
      pt.code(
        `client/
server/
  controllers/
  routes/
  services/
shared/`,
        'text',
      ),

      pt.h2('Why This Works'),
      pt.p(
        'Separating concerns across client and server reduces coupling and improves maintainability.',
      ),
    ],

    tags: [genTag('tag-fullstack'), genTag('tag-architecture')],
  },

  {
    title: 'Why I Prefer Node.js for Backend Development',
    slug: { current: 'why-i-prefer-nodejs-backend' },
    coverImageFilename: 'prefer-nodejs-backend.jpg',
    excerpt:
      'A personal breakdown of why Node.js remains my go-to backend technology for most projects.',
    publishedAt: '2026-05-20T12:00:00.000Z',

    body: [
      pt.h2('Performance and Ecosystem'),
      pt.p(
        'Node.js performs well for I/O-heavy workloads and has a massive ecosystem via npm.',
      ),

      pt.h2('Key Advantages'),
      pt.bullet('Fast development iteration'),
      pt.bullet('Huge package ecosystem'),
      pt.bullet('Strong API server fit'),
    ],

    tags: [genTag('tag-nodejs'), genTag('tag-backend')],
  },
]
