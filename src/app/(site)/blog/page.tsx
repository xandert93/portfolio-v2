import Link from 'next/link'
import { fetchPaginatedPosts, fetchPosts } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
import Pagination from '@/components/ui/Pagination'
import { ROUTES } from '@/config/routes'

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const { posts, totalPages } = await fetchPaginatedPosts(currentPage)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs text-muted mb-4 tracking-widest uppercase">Blog</p>
        <h1 className="text-ink mb-4 font-serif text-5xl">Writing</h1>
        <p className="text-muted text-sm leading-relaxed font-light">
          Thoughts on development, process and things I've figured out the hard way.
        </p>
      </div>

      <div id="posts" className="divide-faint divide-y">
        {posts.map((post) => {
          const formattedDate = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : null

          return (
            <article
              key={post._id}
              className="group grid grid-cols-[200px_1fr] items-start gap-6 py-10"
            >
              {post.coverImage ? (
                <img
                  src={genImageBuilder(post.coverImage)
                    .width(400)
                    .height(250)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={post.title ?? ''}
                  className="border-faint block w-full rounded-md border"
                  style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="border-faint bg-warm flex w-full items-center justify-center rounded-md border"
                  style={{ aspectRatio: '16/10' }}
                >
                  <span className="text-2xs text-muted tracking-widest uppercase">
                    No image
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="text-2xs bg-accent-light border-faint text-accent rounded-full border px-2.5 py-1 tracking-widest uppercase"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <Link href={`${ROUTES.blog}/${post.slug}`}>
                  <h2 className="text-ink group-hover:text-accent font-serif text-2xl transition-colors">
                    {post.title}
                  </h2>
                </Link>

                {post.excerpt && (
                  <p className="text-muted text-sm leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                )}

                {formattedDate && (
                  <time dateTime={post.publishedAt ?? ''} className="text-2xs text-muted">
                    {formattedDate}
                  </time>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={ROUTES.blog}
        hash="posts"
      />
    </main>
  )
}
