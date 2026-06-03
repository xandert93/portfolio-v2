import { fetchPost } from '@/sanity/lib/fetch'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchPost(slug)

  if (!post) return 'Post not found!'

  return (
    <main>
      <h1>{post.title}</h1>
      <p>Slug: {post.slug?.current}</p>
      <p>{post.excerpt}</p>
      <pre>{JSON.stringify(post.body, null, 2)}</pre>
      <pre>{JSON.stringify(post.coverImage, null, 2)}</pre>
      {post.publishedAt && (
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
      )}
      {post.tags && post.tags.length > 0 && (
        <ul>
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
