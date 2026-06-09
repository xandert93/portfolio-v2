import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { fetchPost } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchPost(slug)

  if (!post) return 'Not Found'

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
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors mb-12"
      >
        ← All posts
      </Link>

      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {tags.map((tag) => (
            <span
              key={tag._id}
              className="text-2xs tracking-widest uppercase px-2.5 py-1 bg-accent-light border border-faint rounded-full text-accent"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <h1 className="font-serif text-5xl text-ink leading-tight mb-4">
        {title}
      </h1>

      {excerpt && (
        <p className="text-base text-muted leading-relaxed font-light mb-6">
          {excerpt}
        </p>
      )}

      {formattedDate && (
        <time
          dateTime={publishedAt ?? ''}
          className="text-xs text-muted block mb-10"
        >
          {formattedDate}
        </time>
      )}

      {coverImage && (
        <img
          src={urlFor(coverImage)
            .width(672)
            .height(378)
            .fit('crop')
            .auto('format')
            .url()}
          alt={title ?? ''}
          className="w-full rounded-xl border border-faint mb-10 block"
        />
      )}

      <hr className="border-none border-t border-faint mb-10" />

      {body && (
        <div className="text-sm leading-relaxed text-ink">
          <PortableText value={body} />
        </div>
      )}
    </main>
  )
}
