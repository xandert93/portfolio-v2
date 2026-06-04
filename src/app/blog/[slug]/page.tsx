import { fetchPost } from '@/sanity/lib/fetch'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchPost(slug)

  if (!post) return 'Post not found!'

  const { title, excerpt, body, coverImage, publishedAt } = post

  const tags = post.tags ?? []

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <main
      style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1.5rem' }}
    >
      {/* Tags */}
      {tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag.name}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid #e2e8f0',
                color: '#64748b',
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: '1rem',
          color: '#0f172a',
        }}
      >
        {title}
      </h1>

      {/* Excerpt */}
      {excerpt && (
        <p
          style={{
            fontSize: '1.2rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          {excerpt}
        </p>
      )}

      {/* Date */}
      {formattedDate && (
        <time
          dateTime={publishedAt ?? ''}
          style={{ fontSize: '0.875rem', color: '#94a3b8' }}
        >
          {formattedDate}
        </time>
      )}

      {/* Cover Image */}
      {coverImage && (
        <div style={{ margin: '2rem 0' }}>
          <img
            src={urlFor(coverImage)
              .width(680)
              .height(400)
              .fit('crop')
              .auto('format')
              .url()}
            alt={post.title ?? ''}
            style={{ width: '100%', borderRadius: '0.5rem', display: 'block' }}
          />
        </div>
      )}

      {/* Divider */}
      <hr
        style={{
          margin: '2rem 0',
          border: 'none',
          borderTop: '1px solid #e2e8f0',
        }}
      />

      {/* Body */}
      {body && (
        <div
          style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: '#1e293b' }}
        >
          <PortableText value={body} />
        </div>
      )}
    </main>
  )
}
