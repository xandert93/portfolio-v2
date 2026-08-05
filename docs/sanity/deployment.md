# Sanity Studio Deployment

Sanity Studio is the content management interface for this project. It provides a dedicated environment for managing structured content (such as pages, posts, images, and other data types) separately from the frontend application.

The frontend consumes content through the Sanity API, while Studio provides the interface used by developers, editors, and clients to create and update that content.

```text
Sanity Studio → Sanity Content API → Frontend Application
```

## Why deploy Sanity Studio?

While Studio can be run locally during development, a deployed instance provides a stable environment for ongoing content management.

Benefits of deploying Studio:

- Provides clients and editors with a permanent URL for content updates
- Keeps content management separate from the development environment
- Allows frontend development and content editing to happen independently
- Provides a controlled production environment with appropriate access permissions

The deployed Studio acts as the CMS interface, while the frontend application remains responsible for presenting the content.

## Development vs Production

During development, Studio is typically run locally for schema development and testing:

```bash
npm run dev
```

For production use, Studio is built and deployed as a standalone application:

```bash
npm run build
npm run deploy
```

This creates a stable CMS environment that can be used independently of the developer's local setup.

## Studio URL

Once deployed, Sanity Studio is accessible via its own URL. By default, Sanity hosts the Studio at a `sanity.studio` domain, for example:

```text
https://your-project-name.sanity.studio
```

For client projects, it is generally preferable to expose Studio under the client's own domain using a dedicated subdomain such as:

```text
https://cms.clientwebsite.com
```

or

```text
https://studio.clientwebsite.com
```

This gives clients a professional, branded URL for content management while keeping the CMS separate from the public website.

The public-facing website and the CMS are intentionally different applications:

```text
https://clientwebsite.com        ← Public website
https://cms.clientwebsite.com    ← Sanity Studio (CMS)
```

Subdomains do not incur additional domain registration costs. Once the primary domain has been purchased, subdomains (such as `cms`, `studio`, `admin`, or `api`) can typically be created through the domain's DNS provider at no extra cost.

## Architecture

A typical setup looks like:

```text
                +-------------------------+
                |  Sanity Studio          |
                |  cms.clientwebsite.com  |
                +------------+------------+
                             |
                             |
                     +-------v--------+
                     | Sanity API     |
                     | (Content data) |
                     +-------+--------+
                             |
                             |
                     +-------v--------+
                     | Frontend App   |
                     | clientwebsite.com |
                     +-----------------+
```

Deploying Sanity Studio ensures that content management remains available independently of the development workflow and provides a clear separation between content, infrastructure, and presentation. Editors interact only with the Studio, while visitors interact only with the frontend application.
