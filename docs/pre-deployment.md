# Pre-Deployment Checks

Before deploying this Next.js + TypeScript application to Vercel, run the following checks locally to catch issues early.

## 1. TypeScript Check

Run:

```bash
npm run type-check
```

or:

```bash
npx tsc --noEmit
```

This checks the entire project for TypeScript errors without creating a production build.

It is useful because it shows **all TypeScript errors at once**, instead of fixing one error at a time through `npm run build`.

## 2. Production Build Check

Run:

```bash
npm run build
```

This verifies that the application can successfully compile in production mode.

The build step catches issues that may not appear during development, including:

- TypeScript errors
- Invalid imports
- Missing environment variables
- Next.js production-specific errors
- Build configuration problems

## 3. Test the Production Build Locally

After a successful build:

```bash
npm run start
```

This runs the production version of the app locally and more closely matches how Vercel will serve it.

## Recommended Workflow

Before pushing to Vercel:

```bash
npm run type-check
npm run build
npm run start
```

Fix any errors before deployment to avoid failed Vercel builds.
