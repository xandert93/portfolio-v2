import { fetchProject } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) return '404'

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
    <main
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        fontFamily: 'sans-serif',
      }}
    >
      <Link
        href="/projects"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#64748b',
          textDecoration: 'none',
          marginBottom: '2.5rem',
        }}
      >
        ← All projects
      </Link>

      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 600,
          lineHeight: 1.15,
          color: '#0f172a',
          margin: '0 0 1rem',
        }}
      >
        {title}
      </h1>

      {summary && (
        <p
          style={{
            fontSize: '1.1rem',
            color: '#475569',
            lineHeight: 1.7,
            margin: '0 0 1.75rem',
            maxWidth: '640px',
          }}
        >
          {summary}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {formattedDate && (
          <time
            dateTime={date ?? ''}
            style={{ fontSize: '13px', color: '#94a3b8' }}
          >
            {formattedDate}
          </time>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                textDecoration: 'none',
              }}
            >
              Repository
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#fff',
                textDecoration: 'none',
                border: '1px solid transparent',
              }}
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>

      {coverImage && (
        <img
          src={urlFor(coverImage)
            .width(860)
            .height(484)
            .fit('crop')
            .auto('format')
            .url()}
          alt={title ?? ''}
          style={{
            width: '100%',
            borderRadius: '12px',
            display: 'block',
            marginBottom: '2.5rem',
            border: '1px solid #f1f5f9',
          }}
        />
      )}

      {description && (
        <div style={{ fontSize: '1rem', lineHeight: 1.85, color: '#1e293b' }}>
          <PortableText value={description} />
        </div>
      )}

      {techStack && techStack.length > 0 && (
        <>
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid #f1f5f9',
              margin: '2.5rem 0',
            }}
          />
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#94a3b8',
              marginBottom: '0.75rem',
            }}
          >
            Tech stack
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {techStack.map((tech) => (
              <span
                key={tech._id}
                style={{
                  fontSize: '13px',
                  padding: '5px 14px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  fontWeight: 500,
                }}
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
