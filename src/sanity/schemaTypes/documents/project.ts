import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projects',
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
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { value: 'Full Stack', title: 'full-stack' },
          { value: 'Frontend', title: 'frontend' },
          { value: 'Backend', title: 'backend' },
          { value: 'UI/UX', title: 'ui-ux' },
          { value: 'Open Source', title: 'open-source' },
          { value: 'Client Work', title: 'client-work' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'summary',
          title: 'Summary',
          type: 'text',
          rows: 3,
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'problem',
          title: 'Problem / Goal',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'array',
          of: [{ type: 'block' }],
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'technologies',
          title: 'Tech Stack',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'skill' }] }],
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'features',
          title: 'Key Features',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'challenges',
          title: 'Technical Challenges',
          type: 'array',
          of: [{ type: 'block' }],
        }),
      ],
    }),
    defineField({
      name: 'urls',
      title: 'Links',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({ name: 'repo', title: 'Repository URL', type: 'url' }),
        defineField({ name: 'live', title: 'Live URL', type: 'url' }),
      ],
    }),

    defineField({
      name: 'media',
      title: 'Media',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'coverImage',
          title: 'Cover Image',
          type: 'image',
          options: { hotspot: true },
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'screenshots',
          title: 'Screenshots',
          type: 'array',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (r) => r.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'media.coverImage',
      category: 'category',
    },
    prepare({ title, media, category }) {
      return {
        title,
        subtitle: category,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Date, newest',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})

/*
📚 `preview` controls how a document appears in the Studio UI (lists, references, search results) e.g.

preview: {
  select: {
    title: 'title',
    media: 'media.coverImage',
  },
}

title → use the document's title field
media → use the image inside media.coverImage

📚 `prepare` transforms the selected data into the final preview format e.g.:

prepare({ title, media }) {
  return {
    title,
    media,
  }
}

The returned object tells Sanity exactly what to show. You can modify it:

prepare({ title, category, media }) {
  return {
    title: `${title}`,
    subtitle: category,
    media,
  }
}
*/
