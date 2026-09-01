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
          description: 'Short project summary used on project cards and previews.',
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'problem',
          title: 'The Problem',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Explain the problem, context and goal of the project.',
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'solution',
          title: 'The Solution',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Explain what you built and how it addresses the problem.',
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'role',
          title: 'My Role',
          type: 'array',
          of: [{ type: 'block' }],
          description:
            'Describe your responsibilities and specific contribution to the project.',
        }),

        defineField({
          name: 'features',
          title: 'Key Features',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Feature',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                }),
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  description:
                    'Optional. A small supporting screenshot shown alongside this feature — helps break up the text-only features grid. Not every feature needs one.',
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'description',
                  media: 'image',
                },
              },
            },
          ],
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'technicalDecisions',
          title: 'Technical Decisions',
          type: 'array',
          of: [{ type: 'block' }, { type: 'code' }],
          description:
            'Explain important architectural, database, API, performance or tooling decisions.',
        }),

        defineField({
          name: 'challenges',
          title: 'Challenges & Solutions',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'problem',
                  title: 'Problem',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'solution',
                  title: 'Solution',
                  type: 'array',
                  of: [{ type: 'block' }],
                  validation: (r) => r.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'problem',
                  subtitle: 'solution',
                },
              },
            },
          ],
        }),

        defineField({
          name: 'outcome',
          title: 'Outcome',
          type: 'object',
          validation: (r) => r.required(),
          fields: [
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Overall result and impact of the project.',
            }),
            defineField({
              name: 'metrics',
              title: 'Key Metrics',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'value', title: 'Value', type: 'string' }),
                  ],
                  preview: {
                    select: { title: 'value', subtitle: 'label' },
                  },
                },
              ],
              description: 'Optional quantifiable results e.g. "50% → Faster load time"',
            }),
            defineField({
              name: 'learnings',
              title: 'What I Learned',
              type: 'array',
              of: [{ type: 'block' }],
            }),
          ],
        }),

        defineField({
          name: 'technologies',
          title: 'Tech Stack',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'skill' }] }],
          validation: (r) => r.required(),
        }),
      ],
    }),

    defineField({
      name: 'urls',
      title: 'Links',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'repo',
          title: 'Repository URL',
          type: 'url',
        }),
        defineField({
          name: 'live',
          title: 'Live URL',
          type: 'url',
        }),
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
              type: 'object',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2,
                  validation: (r) => r.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  media: 'image',
                  subtitle: 'description',
                },
              },
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
