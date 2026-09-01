import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      validation: (r) => r.required(),
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'code' },
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'updatedAt', // The date the content went live editorially. Can be back-dated (importing an old post) or set in the future (scheduled publish)
      title: 'Updated At',
      type: 'datetime',
      description:
        'Only set this when you make a meaningful revision after the post has gone live. Leave blank for the initial publish — the UI treats "updated" as a distinct signal from "published", not a duplicate timestamp.',
      validation: (r) =>
        r.custom((prev, ctx) => {
          const doc = ctx.document as any

          if (!prev) return true // Sanity Studio permits the update
          if (doc?.publishedAt && new Date(prev) < new Date(doc.publishedAt))
            return 'Updated date must be after the published date' // Sanity Studio displays returned string as a red error message under the field.
          else return true
        }),
    }),
  ],
  orderings: [
    {
      title: 'Published, newest',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})

/*
📚 Re `updatedAt` - Meaningful vs non-meaningful revisions:

Meaningful (touch `updatedAt`):
- Correcting factually wrong information (a wrong API signature, an outdated statistic, a broken instruction)
- Adding a new section that changes the reader's understanding (e.g., "Update: this library now supports X")
- Rewriting a chunk of the argument or restructuring content in a way that changes what the reader takes away
- Updating code samples to match a new library version, where the old ones would now fail

Non-meaningful (leave `updatedAt` alone):
- Fixing a typo, a broken link, or grammar
- Adjusting spacing, formatting, or image sizing
- Adding a tag or changing the excerpt for SEO
- Swapping the cover image
- Republishing to fix a build issue with no content change
*/
