import { fetchPosts } from '@/sanity/lib/fetch'

export default async function BlogPage() {
  const posts = await fetchPosts()

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h2>
              <a href={`/blog/${post.slug?.current}`}>{post.title}</a>
            </h2>
            <p>{post.excerpt}</p>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            )}
            {post.tags && post.tags.length > 0 && (
              <ul>
                {post.tags.map((tag) => (
                  <li key={tag._id}>{tag.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
