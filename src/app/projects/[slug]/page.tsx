import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { fetchProject } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) return 'Not Found!'

  const {
    title,
    summary,
    description,
    techStack,
    repoUrl,
    liveUrl,
    coverImage,
    date,
  } = project

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors mb-12"
      >
        ← All projects
      </Link>

      <h1 className="font-serif text-5xl text-ink leading-tight mb-4">
        {title}
      </h1>

      {summary && (
        <p className="text-base text-muted leading-relaxed font-light mb-8 max-w-xl">
          {summary}
        </p>
      )}

      <div className="flex items-center gap-6 mb-10 flex-wrap">
        {formattedDate && (
          <time dateTime={date ?? ''} className="text-xs text-muted">
            {formattedDate}
          </time>
        )}
        <div className="flex gap-3">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xs tracking-widest uppercase px-5 py-2.5 border border-faint text-ink rounded hover:bg-warm transition-colors"
            >
              Repository
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xs tracking-widest uppercase px-5 py-2.5 bg-ink text-paper rounded hover:opacity-80 transition-opacity"
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>

      {coverImage && (
        <img
          src={urlFor(coverImage)
            .width(768)
            .height(432)
            .fit('crop')
            .auto('format')
            .url()}
          alt={title ?? ''}
          className="w-full rounded-xl border border-faint mb-12 block"
        />
      )}

      {description && (
        <div className="prose prose-sm max-w-none text-ink leading-relaxed">
          <PortableText value={description} />
        </div>
      )}

      {techStack && techStack.length > 0 && (
        <>
          <hr className="border-none border-t border-faint my-10" />
          <p className="text-2xs tracking-widest uppercase text-muted mb-4">
            Tech stack
          </p>
          <div className="flex gap-2 flex-wrap">
            {techStack.map((tech) => (
              <span
                key={tech._id}
                className="text-xs px-3 py-1.5 bg-warm border border-faint rounded-md text-ink font-medium"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
