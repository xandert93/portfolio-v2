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

import { nanoid } from 'nanoid'

interface TagReference {
  _key: string
  _type: 'reference'
  _ref: string
}

const genTag = (id: string): TagReference => ({
  _key: id,
  _type: 'reference',
  _ref: id,
})

interface Span {
  _key: string
  _type: 'span'
  text: string
  marks?: string[]
}

const genSpan = (text: string): Span => ({
  _key: nanoid(),
  _type: 'span',
  text,
})

type Mark = 'code' | 'strong' | 'em'

const genMarkSpan = (text: string, mark: Mark): Span => ({
  _key: nanoid(),
  _type: 'span',
  text,
  marks: [mark],
})

type BlockStyle = 'normal' | 'h2'
type ListItem = 'bullet'

interface Block {
  _key: string
  _type: 'block'
  style: BlockStyle
  markDefs: unknown[]
  listItem?: ListItem
  children: Span[]
}

interface GenBlockOptions {
  style?: BlockStyle
  text?: string
  children?: Span[]
  listItem?: ListItem
}

const genBlock = ({
  style = 'normal',
  text,
  children,
  listItem,
}: GenBlockOptions = {}): Block => ({
  _key: nanoid(),
  _type: 'block',
  style,
  markDefs: [],
  ...(listItem ? { listItem } : {}),
  children: children ?? [genSpan(text ?? '')],
})

interface CodeBlock {
  _key: string
  _type: 'code'
  code: string
  language: string
}

const genCode = (code: string, language = 'bash'): CodeBlock => ({
  _key: nanoid(),
  _type: 'code',
  code,
  language,
})

// A fragment passed to pWithFormatting is either a plain text string,
// or an object marking a piece of text that should render with a
// specific inline mark: code, bold (strong), or italic (em).
type TextFragment =
  | string
  | { code: string }
  | { bold: string }
  | { italic: string }

const genFragments = (fragments: TextFragment[]): Span[] =>
  fragments.map((fragment) => {
    if (typeof fragment === 'string') return genSpan(fragment)
    if ('code' in fragment) return genMarkSpan(fragment.code, 'code')
    if ('bold' in fragment) return genMarkSpan(fragment.bold, 'strong')
    return genMarkSpan(fragment.italic, 'em')
  })

const pt = {
  h2: (text: string): Block => {
    return genBlock({
      style: 'h2',
      children: [genSpan(text)],
    })
  },

  p: (text: string): Block => genBlock({ text }),

  pWithFormatting: (fragments: TextFragment[]): Block => ({
    _key: nanoid(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: genFragments(fragments),
  }),

  bullet: (text: string): Block => {
    return genBlock({
      listItem: 'bullet',
      text,
    })
  },

  bulletWithFormatting: (fragments: TextFragment[]): Block => ({
    _key: nanoid(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    listItem: 'bullet',
    children: genFragments(fragments),
  }),

  bullets: (items: string[]): Block[] => items.map((item) => pt.bullet(item)),

  code: genCode,
}

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
      pt.h2('Introduction'),
      pt.p(
        'REST APIs are the backbone of most modern web applications — they are how your frontend talks to your database, how mobile apps fetch data, and how services talk to each other. In this guide, we will build a fully working REST API from scratch using Node.js and Express, covering routing, middleware, validation, error handling, and a complete set of CRUD endpoints. By the end, you will have a solid foundation you can extend into a real project.',
      ),

      pt.h2('What You\u2019ll Need'),
      ...pt.bullets([
        'Node.js installed (v18 or later recommended)',
        'A code editor (VS Code works great)',
        'A terminal',
      ]),
      pt.bulletWithFormatting([
        'Basic familiarity with JavaScript and HTTP concepts (',
        { code: 'GET' },
        ', ',
        { code: 'POST' },
        ', ',
        { code: 'PUT' },
        ', ',
        { code: 'DELETE' },
        ')',
      ]),

      pt.h2('Project Setup'),
      pt.p(
        'Let\u2019s start by creating a new project directory and initialising it with npm.',
      ),
      pt.code(
        'mkdir express-rest-api\ncd express-rest-api\nnpm init -y\nnpm install express\nnpm install --save-dev nodemon',
        'bash',
      ),
      pt.pWithFormatting([
        { code: 'express' },
        ' is our web framework. ',
        { code: 'nodemon' },
        ' will automatically restart our server whenever we save a file, which makes development much faster.',
      ]),
      pt.pWithFormatting([
        'Open ',
        { code: 'package.json' },
        ' and add a new dev script:',
      ]),
      pt.code(
        '{\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js"\n  }\n}',
        'json',
      ),

      pt.h2('Setting Up the Server'),
      pt.pWithFormatting([
        'Create a file called ',
        { code: 'server.js' },
        ' in your project root:',
      ]),
      pt.code(
        `const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 3000;
   
  // Middleware to parse JSON request bodies
  app.use(express.json());
   
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the REST API' });
  });
   
  app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });`,
        'js',
      ),
      pt.p('Run it with:'),
      pt.code('npm run dev', 'bash'),
      pt.pWithFormatting([
        'Visit ',
        { code: 'http://localhost:3000' },
        ' in your browser or test it with ',
        { code: 'curl http://localhost:3000' },
        ', and you should see the welcome message. We now have a working server — let\u2019s give it something real to do.',
      ]),

      pt.h2('Designing Our Resource'),
      pt.pWithFormatting([
        'We will build an API around a simple resource: tasks. Each task will have an ',
        { code: 'id' },
        ', ',
        { code: 'title' },
        ', ',
        { code: 'completed status' },
        ', and ',
        { code: 'createdAt' },
        ' timestamp. This is a common pattern you will reuse for almost any resource — users, posts, products, you name it!',
      ]),
      pt.p(
        'For this tutorial we will store tasks in memory (a simple JavaScript array) instead of a database, so we can focus purely on the API layer. At the end, we will point toward swapping this for a real database.',
      ),
      pt.code(
        `// In-memory data store
  let tasks = [
    { id: 1, title: 'Learn Express', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Build a REST API', completed: false, createdAt: new Date().toISOString() },
  ];
  let nextId = 3;`,
        'js',
      ),
      pt.pWithFormatting([
        'Add this near the top of ',
        { code: 'server.js' },
        ', right after you create the app.',
      ]),

      pt.h2('organising Routes Properly'),
      pt.pWithFormatting([
        'As your API grows, keeping everything in one file gets messy fast. Express gives us Router to organise routes into separate modules. Create a new folder called ',
        { code: 'routes' },
        ' and a file inside it called ',
        { code: 'tasks.js' },
      ]),
      pt.code(
        `// routes/tasks.js
  const express = require('express');
  const router = express.Router();
   
  let tasks = [
    { id: 1, title: 'Learn Express', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Build a REST API', completed: false, createdAt: new Date().toISOString() },
  ];
  let nextId = 3;
   
  // GET /api/tasks - list all tasks
  router.get('/', (req, res) => {
    res.json(tasks);
  });
   
  // GET /api/tasks/:id - get a single task
  router.get('/:id', (req, res) => {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });
   
  // POST /api/tasks - create a new task
  router.post('/', (req, res) => {
    const { title } = req.body;
   
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
   
    const newTask = {
      id: nextId++,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
   
    tasks.push(newTask);
    res.status(201).json(newTask);
  });
   
  // PUT /api/tasks/:id - update an existing task
  router.put('/:id', (req, res) => {
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
   
    const { title, completed } = req.body;
   
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      task.title = title.trim();
    }
   
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean' });
      }
      task.completed = completed;
    }
   
    res.json(task);
  });
   
  // DELETE /api/tasks/:id - remove a task
  router.delete('/:id', (req, res) => {
    const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
   
    tasks.splice(index, 1);
    res.status(204).send();
  });
   
  module.exports = router;`,
        'js',
      ),
      pt.pWithFormatting([
        'Notice the pattern here: each route checks for the resource, validates input where needed, and returns an appropriate HTTP status code. This is ',
        { bold: 'the core rhythm of REST APIs' },
        ' — find it, validate it, act on it, respond with the right status.',
      ]),

      pt.h2('Wiring the Router Into the App'),
      pt.pWithFormatting([
        'Now update ',
        { code: 'server.js' },
        ' to remove the in-memory data (it lives in the router now) and mount the router:',
      ]),
      pt.code(
        `const express = require('express');
  const tasksRouter = require('./routes/tasks');
   
  const app = express();
  const PORT = process.env.PORT || 3000;
   
  app.use(express.json());
   
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the REST API' });
  });
   
  app.use('/api/tasks', tasksRouter);
   
  app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });`,
        'js',
      ),
      pt.pWithFormatting([
        'Every route inside ',
        { code: 'tasksRouter' },
        ' is now prefixed with ',
        { code: '/api/tasks' },
        '. So ',
        { code: "router.get('/:id')" },
        ' actually becomes ',
        { code: 'GET /api/tasks/:id' },
        '. This separation keeps ',
        { code: 'server.js' },
        ' clean and lets you add more resource routers (',
        { code: '/api/users' },
        ', ',
        { code: '/api/projects' },
        ', etc.) without things turning into spaghetti.',
      ]),

      pt.h2('Testing the Endpoints'),
      pt.p(
        'Let\u2019s test every endpoint with curl. Restart your server (or let nodemon do it for you) and run these one at a time.',
      ),
      pt.p('Get all tasks:'),
      pt.code('curl http://localhost:3000/api/tasks', 'bash'),
      pt.p('Create a new task:'),
      pt.code(
        `curl -X POST http://localhost:3000/api/tasks \\
    -H "Content-Type: application/json" \\
    -d '{"title": "Write blog post about Express"}'`,
        'bash',
      ),
      pt.p('Update a task:'),
      pt.code(
        `curl -X PUT http://localhost:3000/api/tasks/1 \\
    -H "Content-Type: application/json" \\
    -d '{"completed": true}'`,
        'bash',
      ),
      pt.p('Delete a task:'),
      pt.code('curl -X DELETE http://localhost:3000/api/tasks/1', 'bash'),
      pt.p('Try an invalid request to test validation:'),
      pt.code(
        `curl -X POST http://localhost:3000/api/tasks \\
    -H "Content-Type: application/json" \\
    -d '{"title": ""}'`,
        'bash',
      ),
      pt.pWithFormatting([
        'You should get back a ',
        { code: '400' },
        ' status with a clear error message — that is our validation logic doing its job.',
      ]),

      pt.h2('Adding Centralized Error Handling'),
      pt.pWithFormatting([
        'Right now, errors are handled inline in every route. As your API grows, it is better to centralize this with Express\u2019s built-in error-handling ',
        { italic: 'middleware' },
        '. This also ',
        { bold: 'catches unexpected errors' },
        ' (like a bug that throws an exception) instead of crashing the whole server.',
      ]),
      pt.pWithFormatting([
        'Add this to the bottom of ',
        { code: 'server.js' },
        ', after your routes but before ',
        { code: 'app.listen' },
        ':',
      ]),
      pt.code(
        `// 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
   
  // Centralized error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });`,
        'js',
      ),
      pt.pWithFormatting([
        'To actually use this error handler from inside your routes, you would call ',
        { code: 'next(err)' },
        ' instead of handling the error inline. For example:',
      ]),
      pt.code(
        `router.get('/:id', (req, res, next) => {
    try {
      const task = tasks.find((t) => t.id === parseInt(req.params.id));
      if (!task) {
        const error = new Error('Task not found');
        error.status = 404;
        throw error;
      }
      res.json(task);
    } catch (err) {
      next(err);
    }
  });`,
        'js',
      ),
      pt.p(
        'This pattern keeps your route logic focused on business rules while error formatting and logging live in one place.',
      ),

      pt.h2('Adding Basic Security and Logging Middleware'),
      pt.p(
        'Two small additions go a long way toward making this production-ready: request logging and basic security headers. Install two popular packages:',
      ),
      pt.code('npm install helmet morgan', 'bash'),
      pt.pWithFormatting([
        'Then update the top of ',
        { code: 'server.js' },
        ':',
      ]),
      pt.code(
        `const express = require('express');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const tasksRouter = require('./routes/tasks');
   
  const app = express();
  const PORT = process.env.PORT || 3000;
   
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());`,
        'js',
      ),
      pt.pWithFormatting([
        { code: 'helmet' },
        ' sets a collection of secure HTTP headers automatically. ',
        { code: 'morgan' },
        ' logs every incoming request to your console in development, which is incredibly useful for debugging.',
      ]),

      pt.h2('Where to Go From Here'),
      pt.p(
        'This API works, but it is still missing a few things you would want in a real-world project:',
      ),
      ...pt.bullets([
        'Persisting data to a real database (MongoDB, PostgreSQL, or SQLite are good starting points)',
        'Authentication and authorisation (JWT-based auth is a common next step)',
        'Pagination for the GET /api/tasks endpoint when the list grows large',
        'Automated tests using a tool like Jest or Vitest with Supertest',
        'Environment-based configuration using a .env file and the dotenv package',
        'Deploying the API to a host like Render, Railway, or Fly.io',
      ]),
      pt.p(
        'Each of those is a natural follow-up project. If you build this exact API and swap the in-memory array for a real database, you will have touched almost everything a backend developer does day to day.',
      ),

      pt.h2('Conclusion'),
      pt.p(
        'We went from an empty folder to a fully functional REST API with routing, validation, structured error handling, and basic security middleware. The biggest takeaway here is not the code itself — it is the pattern: organise routes by resource, validate input early, return consistent status codes, and centralize error handling. That pattern scales from a tiny side project all the way up to production systems handling real traffic.',
      ),
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
      pt.pWithFormatting([
        'Most React apps do not need Redux or complex state libraries. Start with local state and scale ',
        { italic: 'only when needed' },
        '.',
      ]),

      pt.h2('Patterns to Use'),
      pt.pWithFormatting([{ code: 'useState' }, ' for local UI state']),
      pt.pWithFormatting([{ code: 'useReducer' }, ' for complex transitions']),
      pt.p('Context for shared app state'),
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
      pt.pWithFormatting([
        'Using ',
        { bold: 'inconsistent naming conventions' },
        ' leads to confusion and poor maintainability.',
      ]),

      pt.h2('Better Approach'),
      pt.pWithFormatting([
        'Use plural nouns for resources (',
        { code: '/users' },
        ', ',
        { code: '/posts' },
        ')',
      ]),
      pt.bullet('Keep URL structure predictable'),
    ],

    tags: [genTag('tag-api'), genTag('tag-backend')],
  },

  {
    title: 'How I Structure a Full-Stack Project for Scalability',
    slug: { current: 'fullstack-project-structure-scalability' },
    coverImageFilename: 'fullstack-project-structure.jpg',
    excerpt:
      'A look into how I organise full-stack applications for maintainability and long-term scalability.',
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
      ...pt.bullets([
        'Fast development iteration',
        'Huge package ecosystem',
        'Strong API server fit',
      ]),
    ],

    tags: [genTag('tag-nodejs'), genTag('tag-backend')],
  },
]
