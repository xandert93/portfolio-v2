import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Current client for frontend read ops
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NEXT_PUBLIC_SANITY_DATASET === 'production',
})

/*
📚 Where's the API key?

Sanity datasets are public-read by default, so reading published content needs no API key. You only need an API key for writes (which you have) or if you want the dataset to private.
*/

/*
📚 useCdn?

Sanity offers two API endpoints: api.sanity.io (live, always fresh) and apicdn.sanity.io (cached at edge locations globally, faster, cheaper in terms of Sanity usage limits).

useCdn: true → reads go through the cached CDN. Fast, but data can be up to ~60 seconds stale after an edit.

useCdn: false → always hits the live API i.e. dataset origin. Returned data always fresh, slightly slower.

Rule of thumb: useCdn: true in production (speed matters, slight staleness is fine), useCdn: false in dev/preview or anywhere you're actively editing content and need to see changes instantly.
*/

/*
📚 In Sanity, the API contract flow is typically:

1. Manually define schemas for your content entities

2. Run `sanity typegen` to generate TS entity types from the schemas e.g. Post, User etc.. 

This produces schema-level types for each content entity i.e. describing what will exist in the Sanity DB. Types are output to `src/sanity.types.ts` (often hundreds of lines).

3. Manually write GROQ queries in `queries.ts`. TypeGen uses the schema types from the previous step to understand the data shape returned by each query.
It generates "query result" types that match the exact data your frontend consumes.

   Example:

   ```ts
   FETCH_POST_QUERY_RESULT = {
     _id: string
     title: string
     authorName: string
   }
   ```

These query result types are also added to `src/sanity.types.ts`, so the file can grow significantly as more queries are added.

4. Fetch data in Next.js and type components using the generated query result types.

Components should generally consume query result types rather than the raw schema entity types.

   Example:

   ```ts
   type Props = {
     post: FETCH_POST_QUERY_RESULT
   }

   function PostPage({ post }: Props) {
     return <h1>{post.title}</h1>
   }
   ```
*/
