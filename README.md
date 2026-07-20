## Code Style & Formatting

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

## Project Conventions

### Icon Strategy

This project intentionally uses **two icon libraries**, each with a specific responsibility.

### Lucide React

Used for **UI and application icons**, including:

- Navigation (menu, close, back)
- Actions (search, settings, edit, delete)
- Buttons (download, arrow, external link)
- Contact icons (mail, phone)
- Theme controls (sun/moon)
- General interface elements

Lucide provides a clean, consistent icon style and is lightweight and tree-shakeable, making it well suited for UI components.

### React Icons

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

### Why both?

Using both libraries provides the benefits of each approach:

- **Lucide React** keeps UI elements visually consistent.
- **React Icons** provides access to thousands of official brand and technology logos without needing to source and maintain individual SVG files.

### Guiding Principle

- ✅ **Lucide React** → UI and application icons
- ✅ **React Icons** → Brand, company, and technology logos

This separation keeps the interface consistent while allowing official branding where appropriate.
