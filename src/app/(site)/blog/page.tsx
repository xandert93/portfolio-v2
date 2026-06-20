import Link from 'next/link'
import { fetchPaginatedPosts, fetchPosts } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import Pagination from '@/components/Pagination'

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const { posts, totalPages } = await fetchPaginatedPosts(currentPage)

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs tracking-widest uppercase text-muted mb-4">
          Blog
        </p>
        <h1 className="font-serif text-5xl text-ink mb-4">Writing</h1>
        <p className="text-sm text-muted font-light leading-relaxed">
          Thoughts on development, process, and things I've figured out the hard
          way.
        </p>
      </div>

      <div id="posts" className="divide-y divide-faint">
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
              className="py-10 group grid grid-cols-[200px_1fr] gap-6 items-start"
            >
              {post.coverImage ? (
                <img
                  src={urlFor(post.coverImage)
                    .width(400)
                    .height(250)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={post.title ?? ''}
                  className="w-full rounded-md block border border-faint"
                  style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="w-full rounded-md border border-faint bg-warm flex items-center justify-center"
                  style={{ aspectRatio: '16/10' }}
                >
                  <span className="text-2xs tracking-widest uppercase text-muted">
                    No image
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className="text-2xs tracking-widest uppercase px-2.5 py-1 bg-accent-light border border-faint rounded-full text-accent"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <Link href={`/blog/${post.slug?.current}`}>
                  <h2 className="font-serif text-2xl text-ink group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                </Link>

                {post.excerpt && (
                  <p className="text-sm text-muted leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                )}

                {formattedDate && (
                  <time
                    dateTime={post.publishedAt ?? ''}
                    className="text-2xs text-muted"
                  >
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
        basePath="/blog"
        hash="posts"
      />
    </main>
  )
}
