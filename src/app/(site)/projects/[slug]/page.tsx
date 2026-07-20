import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { fetchProject } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
// import ScreenshotGallery from './screenshot-gallery'

type PageProps = {
  params: Promise<{ slug: string }>
}

const CATEGORY_LABELS: Record<string, string> = {
  backend: 'Backend',
  'client-work': 'Client Work',
  frontend: 'Frontend',
  'full-stack': 'Full-Stack',
  'open-source': 'Open Source',
  'ui-ux': 'UI / UX',
}

/* ─── Portable Text styling ──────────────────────────────────────── */
/* Two variants: the main description reads as an article; challenges
   read one notch smaller, inside a card, since it's supporting detail. */

function makePortableTextComponents(
  variant: 'article' | 'compact',
): PortableTextComponents {
  const heading =
    variant === 'article'
      ? 'font-serif text-ink text-2xl md:text-3xl mt-12 mb-4 first:mt-0'
      : 'font-serif text-ink text-xl mt-8 mb-3 first:mt-0'

  const paragraph =
    variant === 'article'
      ? 'text-[0.9375rem] leading-[1.8] text-ink/80 mb-5 last:mb-0'
      : 'text-sm leading-[1.75] text-ink/75 mb-4 last:mb-0'

  return {
    block: {
      h1: ({ children }) => <h2 className={heading}>{children}</h2>,
      h2: ({ children }) => <h2 className={heading}>{children}</h2>,
      h3: ({ children }) => <h3 className={heading}>{children}</h3>,
      h4: ({ children }) => <h4 className={heading}>{children}</h4>,
      h5: ({ children }) => <h5 className={heading}>{children}</h5>,
      h6: ({ children }) => <h6 className={heading}>{children}</h6>,
      normal: ({ children }) => <p className={paragraph}>{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-accent/40 my-8 border-l-2 pl-6">
          <p className="text-ink font-serif text-xl leading-snug italic md:text-2xl">
            {children}
          </p>
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="mb-5 space-y-2.5">{children}</ul>,
      number: ({ children }) => (
        <ol className="marker:text-accent mb-5 list-inside list-decimal space-y-2.5">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-ink/80 flex gap-3 text-[0.9375rem] leading-[1.75]">
          <span className="bg-accent mt-[0.65em] size-1 shrink-0 rounded-full" />
          <span>{children}</span>
        </li>
      ),
      number: ({ children }) => (
        <li className="text-ink/80 pl-1 text-[0.9375rem] leading-[1.75]">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="text-ink font-medium">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="bg-warm border-faint text-accent rounded border px-1.5 py-0.5 font-mono text-[0.85em]">
          {children}
        </code>
      ),
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink decoration-accent/50 hover:decoration-accent hover:text-accent underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      ),
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) {
    return (
      <main className="container">
        <div className="section flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">404</p>
          <h1 className="section-heading">This project wandered off.</h1>
          <Link href="/projects" className="link-underline mt-4">
            ← Back to all projects
          </Link>
        </div>
      </main>
    )
  }

  const {
    title,
    category,
    content: { summary, problem, description, technologies, features, challenges },
    urls,
    media: { coverImage, screenshots },
    date,
  } = project

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })
    : null

  const coverUrl = coverImage
    ? genImageBuilder(coverImage).width(1440).height(810).fit('crop').auto('format').url()
    : null

  const screenshotItems = screenshots.map((shot) => ({
    key: shot._key,
    url: genImageBuilder(shot).width(1200).height(750).fit('crop').auto('format').url(),
  }))

  return (
    <main className="pb-24 md:pb-32">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="container">
        <div className="pt-10 md:pt-16">
          <Link
            href="/projects"
            className="text-2xs text-muted hover:text-ink animate-fade-up inline-flex items-center gap-2 tracking-widest uppercase transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>{' '}
            All projects
          </Link>

          <p className="eyebrow animate-fade-up mt-10" style={{ animationDelay: '80ms' }}>
            {CATEGORY_LABELS[category] ?? category}
          </p>

          <h1
            className="text-ink animate-fade-up mt-3 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
            style={{ animationDelay: '140ms' }}
          >
            {title}
          </h1>

          {summary && (
            <p
              className="text-muted animate-fade-up mt-6 max-w-xl text-base leading-relaxed font-light md:text-lg"
              style={{ animationDelay: '200ms' }}
            >
              {summary}
            </p>
          )}

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={{ animationDelay: '260ms' }}
          >
            {urls.live && (
              <span className="badge-open">
                <span className="bg-accent animate-pulse-dot size-1.5 rounded-full" />
                Live
              </span>
            )}
            {formattedDate && (
              <time dateTime={date ?? ''} className="text-muted text-xs tracking-wide">
                {formattedDate}
              </time>
            )}

            <div className="ml-auto flex gap-3 sm:ml-0">
              {urls.repo && (
                <a
                  href={urls.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-2xs inline-flex items-center gap-2 px-5! py-2.5! tracking-widest uppercase"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                  Code
                </a>
              )}
              {urls.live && (
                <a
                  href={urls.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-2xs inline-flex items-center gap-2 px-5! py-2.5! tracking-widest uppercase"
                >
                  Visit site
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Cover image ──────────────────────────────────────── */}
      {coverUrl && (
        <div className="container mt-12 md:mt-16">
          <div
            className="border-faint animate-fade-up relative overflow-hidden rounded-xl border"
            style={{ animationDelay: '320ms' }}
          >
            <img
              src={coverUrl}
              alt={title ?? ''}
              className="block aspect-video w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Problem ──────────────────────────────────────────── */}
      {problem && (
        <div className="container">
          <div className="section ruled">
            <div className="max-w-2xl md:pl-10">
              <p className="eyebrow">The problem</p>
              <p className="text-ink font-serif text-2xl leading-snug italic md:text-[1.75rem]">
                {problem}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Description ──────────────────────────────────────── */}
      {description && description.length > 0 && (
        <div className="container">
          <div className={problem ? 'ruled mb-4' : 'section ruled'}>
            <div className="max-w-2xl md:pl-10">
              {!problem && <p className="eyebrow">About this project</p>}
              <PortableText
                value={description}
                components={makePortableTextComponents('article')}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Features ─────────────────────────────────────────── */}
      {features && features.length > 0 && (
        <div className="container">
          <div className="section">
            <p className="eyebrow">What it does</p>
            <h2 className="section-heading mb-8">Features</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((feature, i) => (
                <div
                  key={feature}
                  className="card animate-fade-up flex items-start gap-3 px-5 py-4"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="stroke-accent mt-0.5 size-4 shrink-0 fill-none"
                    strokeWidth="1.75"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10.5 8 14.5 16 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-ink/85 text-sm leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tech stack ───────────────────────────────────────── */}
      {Boolean(technologies.length) && (
        <div className="container">
          <div className="section">
            <p className="eyebrow">Built with</p>
            <h2 className="section-heading mb-8">Tech Stack</h2>
            <div className="flex flex-wrap gap-2.5">
              {technologies.map((tech, i) => (
                <span
                  key={tech._id}
                  className="bg-warm border-faint text-ink hover:border-accent/30 hover:text-accent animate-fade-up rounded-md border px-3.5 py-2 text-xs font-medium transition-colors"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Challenges ───────────────────────────────────────── */}
      {challenges && challenges.length > 0 && (
        <div className="container">
          <div className="section">
            <p className="eyebrow">Notes from the build</p>
            <h2 className="section-heading mb-8">Challenges &amp; solutions</h2>
            <div className="card px-6 py-7 md:px-10 md:py-9">
              <PortableText
                value={challenges}
                components={makePortableTextComponents('compact')}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Screenshots ──────────────────────────────────────── */}
      {/* {screenshotItems.length > 0 && (
        <div className="container">
          <div className="section">
            <p className="eyebrow">In practice</p>
            <h2 className="section-heading mb-8">Screenshots</h2>
            <ScreenshotGallery screenshots={screenshotItems} />
          </div>
        </div>
      )} */}

      {/* ── Footer nav ───────────────────────────────────────── */}
      <div className="container">
        <div className="border-faint mt-4 flex justify-center border-t pt-16 md:pt-20">
          <Link href="/projects" className="link-underline">
            ← Back to all projects
          </Link>
        </div>
      </div>
    </main>
  )
}
