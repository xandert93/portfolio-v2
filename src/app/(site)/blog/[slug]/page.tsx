import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { fetchPost } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { codeToHtml } from 'shiki'

type PageProps = {
  params: Promise<{ slug: string }>
}

const estimateReadingTime = (body: any): number => {
  const text = body
    ?.map((block: any) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map((c: any) => c.text).join(' ')
    })
    .join(' ')

  const words = text?.trim().split(/\s+/).length ?? 0
  return Math.max(1, Math.ceil(words / 200))
}

// Shiki's highlighter is async, but PortableText's `components` render
// synchronously. So we walk the body once up front, highlight every
// `code` block to HTML, and stash it as `_highlighted` on the block
// itself — the actual `code` component below just renders that HTML.
const highlightCodeBlocks = async (body: any[]): Promise<any[]> => {
  if (!Array.isArray(body)) return body

  return Promise.all(
    body.map(async (block) => {
      if (block._type !== 'code' || !block.code) return block

      try {
        const html = await codeToHtml(block.code, {
          lang: block.language || 'text',
          theme: 'github-dark-default',
        })
        return { ...block, _highlighted: html }
      } catch {
        // Unsupported language string, etc. — fall back to plain text.
        return block
      }
    }),
  )
}

// ---- Portable Text component overrides --------------------------------
// Everything here borrows the page's existing tokens (text-ink, text-muted,
// border-faint, accent, font-serif) so the body reads as part of the same
// system. The one deliberate departure is the code block: a dark inset
// "terminal window" that gives code its own material on an otherwise quiet,
// editorial page.

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl sm:text-3xl text-ink mt-8 sm:mt-10 mb-4 sm:mb-5 leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl sm:text-2xl text-ink mt-6 sm:mt-8 mb-3 sm:mb-4 leading-snug">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-base sm:text-[1.05rem] leading-[1.75] sm:leading-[1.85] text-ink/90 mb-5 sm:mb-6 font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent/40 pl-5 sm:pl-6 my-7 sm:my-8 text-muted italic font-light text-base sm:text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-6 space-y-2.5 pl-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 space-y-2.5 pl-1 list-decimal list-inside marker:text-accent marker:font-medium">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-base sm:text-[1.05rem] leading-[1.7] sm:leading-[1.75] text-ink/90 font-light">
        <span className="text-accent mt-[0.6em] block w-1 h-1 rounded-full bg-accent shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-base sm:text-[1.05rem] leading-[1.7] sm:leading-[1.75] text-ink/90 font-light pl-1">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-[0.85em] bg-accent-light text-accent px-1.5 py-0.5 rounded-md border border-faint">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={
          value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined
        }
        className="text-accent underline underline-offset-[3px] decoration-accent/30 hover:decoration-accent transition-colors"
      >
        {children}
      </a>
    ),
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8 sm:my-10">
          <img
            src={urlFor(value).width(1400).fit('max').auto('format').url()}
            alt={value.alt ?? ''}
            className="w-full rounded-xl border border-faint"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-xs text-muted tracking-wide">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    code: ({ value }) => {
      const lang = value?.language || 'text'

      return (
        <div className="my-6 sm:my-8 -mx-5 sm:mx-0 rounded-none sm:rounded-xl overflow-hidden border-y sm:border border-black/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]">
          {/* window chrome */}
          <div className="flex items-center justify-between bg-[#161b22] px-4 sm:px-4 py-2.5 border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-2xs tracking-widest uppercase text-white/35 font-mono">
              {lang}
            </span>
          </div>

          {/* code — Shiki-highlighted HTML if available, plain fallback otherwise */}
          {value?._highlighted ? (
            <div
              className="shiki-block [&>pre]:bg-[#0d1117] [&>pre]:px-4 sm:[&>pre]:px-5 [&>pre]:py-4 sm:[&>pre]:py-5 [&>pre]:overflow-x-auto [&>pre]:m-0 [&_code]:font-mono [&_code]:text-[0.8rem] sm:[&_code]:text-[0.85rem] [&_code]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: value._highlighted }}
            />
          ) : (
            <pre className="bg-[#0d1117] px-4 sm:px-5 py-4 sm:py-5 overflow-x-auto">
              <code className="font-mono text-[0.8rem] sm:text-[0.85rem] leading-relaxed text-[#e4e4e4] whitespace-pre">
                {value?.code}
              </code>
            </pre>
          )}
        </div>
      )
    },
  },
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params

  const post = await fetchPost(slug)
  if (!post) {
    return (
      <main className="max-w-4xl mx-auto px-5 sm:px-6 py-20 sm:py-32 text-center">
        <p className="text-2xs tracking-widest uppercase text-muted mb-4">
          404
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-6">
          We couldn&apos;t find that post
        </h1>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-accent hover:text-ink transition-colors"
        >
          ← Back to all posts
        </Link>
      </main>
    )
  }

  const { title, excerpt, body, coverImage, publishedAt } = post
  const tags = post.tags ?? []

  const readingTime = estimateReadingTime(body)
  const highlightedBody = await highlightCodeBlocks(body)

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
      {/* back nav */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors mb-8 sm:mb-12"
      >
        ← All posts
      </Link>

      {/* tags */}
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

      {/* title block */}
      <header className="mt-4 sm:mt-6 mb-8 sm:mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight text-ink">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
          {formattedDate && (
            <time dateTime={publishedAt ?? ''}>{formattedDate}</time>
          )}
          {formattedDate && <span className="w-1 h-1 rounded-full bg-faint" />}
          <span>{readingTime} min read</span>
        </div>

        {excerpt && (
          <p className="mt-6 text-base text-muted leading-relaxed font-light">
            {excerpt}
          </p>
        )}
      </header>

      {/* cover */}
      {coverImage && (
        <figure className="mb-8 sm:mb-12">
          <img
            src={urlFor(coverImage)
              .width(1200)
              .height(675)
              .fit('crop')
              .auto('format')
              .url()}
            alt={title ?? ''}
            className="w-full aspect-[16/9] object-cover rounded-xl border border-faint"
          />
        </figure>
      )}

      {/* body */}
      <article className="max-w-none">
        <PortableText
          value={highlightedBody}
          components={portableTextComponents}
        />
      </article>

      {/* footer nav */}
      <footer className="mt-16 sm:mt-20 pt-8 border-t border-faint">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
        >
          ← All posts
        </Link>
      </footer>
    </main>
  )
}
