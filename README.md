# Portfolio

A personal portfolio site built with Next.js and Sanity CMS — projects, blog, experience/education timeline, testimonials, and a contact form, all managed through a custom Sanity Studio embedded at `/studio`.

**Live site:** _add live URL_

---

## Screenshots

<!-- Replace these with real screenshots when ready -->

| Home          | Projects      | Blog          |
| ------------- | ------------- | ------------- |
| _placeholder_ | _placeholder_ | _placeholder_ |

| About         | Experience    | Contact       |
| ------------- | ------------- | ------------- |
| _placeholder_ | _placeholder_ | _placeholder_ |

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router) + React 19 + TypeScript
- **CMS:** [Sanity](https://www.sanity.io/) (embedded Studio, custom schemas, GROQ + generated types)
- **Styling:** Tailwind CSS 4
- **Content rendering:** Portable Text, Shiki (code syntax highlighting)
- **Email:** [Resend](https://resend.com/) (contact form)
- **Animation:** Framer Motion
- **Icons:** Lucide React (UI) + React Icons (brand/tech logos) — see [Conventions](#project-conventions) below

## Features

- Home, About, Projects, Blog, Experience, and Contact pages
- Dark mode with a theme toggle and responsive navigation (drawer on mobile)
- Paginated blog and projects listings
- Individual project and blog post detail pages with code highlighting
- Contact form wired to a Next.js API route + Resend
- Fully editable content via an embedded Sanity Studio (`/studio`) — no separate CMS deployment needed
- Seed script for populating a Sanity dataset with sample content

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Sanity](https://www.sanity.io/) project (free tier is fine)
- A [Resend](https://resend.com/) API key (for the contact form)

### 1. Clone and install

```bash
git clone https://github.com/xandert93/portfolio-v2.git
cd portfolio-v2
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| -------------------------------- | -------------------------------------------------------- | |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version (e.g. `2026-06-02`) |
| `SANITY_WRITE_TOKEN` | Sanity token with write access (used for seeding/writes) |
| `SITE_URL` | Base URL of the deployed site (used for metadata) |
| `RESEND_API_KEY` | API key from Resend, for sending contact form emails |
| `CONTACT_EMAIL` | Inbox address that receives contact form submissions |

### 3. (Optional) Seed sample content

```bash
npm run seed
```

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the site, and `http://localhost:3000/studio` for the CMS.

### Other scripts

| Script                  | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm run build`         | Production build                                  |
| `npm run start`         | Run the production build locally                  |
| `npm run lint`          | Lint the codebase                                 |
| `npm run typegen`       | Extract Sanity schema + generate TypeScript types |
| `npm run typegen:watch` | Same as above, watching for schema changes        |

---

## Deployment

This project is set up to deploy on [Vercel](https://vercel.com/). Environment variables must be added manually in the Vercel project settings (Vercel does not read `.env` files from the repo) — use the table above as your checklist.

---

## Project Conventions

### Code Style & Formatting

This project uses Prettier to keep formatting consistent. The configuration lives in `.prettierrc`.

Key formatting rules:

- `singleQuote: true` — uses `'foo'` instead of `"foo"` in JS/TS.
- `trailingComma: "all"` — adds trailing commas where valid; makes diffs cleaner.
- `printWidth: 90` — keeps lines readable without being too restrictive.
- `tabWidth: 2` — uses 2 spaces for indentation.
- `useTabs: false` — uses spaces instead of tabs.
- `bracketSpacing: true` — formats objects as `{ foo: bar }`.
- `bracketSameLine: false` — keeps JSX closing brackets on their own line.
- `arrowParens: "always"` — uses `(x) => x` instead of `x => x`.
- `endOfLine: "lf"` — uses Unix-style line endings for consistency across platforms.
- `proseWrap: "preserve"` — avoids aggressively reflowing Markdown text.
- `htmlWhitespaceSensitivity: "css"` — uses CSS-aware whitespace handling for HTML-like files.
- `embeddedLanguageFormatting: "auto"` — formats embedded languages where supported.

### Icon Strategy

This project intentionally uses **two icon libraries**, each with a specific responsibility.

#### Lucide React

Used for **UI and application icons**, including:

- Navigation (menu, close, back)
- Actions (search, settings, edit, delete)
- Buttons (download, arrow, external link)
- Contact icons (mail, phone)
- Theme controls (sun/moon)
- General interface elements

Lucide provides a clean, consistent icon style and is lightweight and tree-shakeable, making it well suited for UI components.

#### React Icons

Used **only for brand and technology logos**, such as:

- GitHub
- LinkedIn
- WhatsApp
- React
- Next.js
- TypeScript
- Docker
- AWS
- PostgreSQL
- Tailwind CSS
- Other company, framework, and technology logos

React Icons aggregates many popular icon packs and provides access to official brand icons that Lucide does not include.

When using React Icons, import individual icons rather than entire icon sets to keep bundle size optimized.

#### Why both?

Using both libraries provides the benefits of each approach:

- **Lucide React** keeps UI elements visually consistent.
- **React Icons** provides access to thousands of official brand and technology logos without needing to source and maintain individual SVG files.

#### Guiding Principle

- ✅ **Lucide React** → UI and application icons
- ✅ **React Icons** → Brand, company, and technology logos

This separation keeps the interface consistent while allowing official branding where appropriate.
