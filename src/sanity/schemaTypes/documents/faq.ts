import { defineField, defineType } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The heading displayed above the FAQ section.',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
    }),

    defineField({
      name: 'introduction',
      title: 'Introduction',
      description: 'Optional introductory text displayed beneath the heading.',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'items',
      title: 'Questions',
      description:
        'Add, remove, and reorder frequently asked questions. They will appear in the order shown here.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              description: 'The question visitors commonly ask.',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'answer',
              title: 'Answer',
              description: 'The answer displayed when the question is expanded.',
              type: 'text',
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'isFeatured',
              title: 'Featured',
              description:
                'Mark this question as featured if you want to highlight it elsewhere on the site.',
              type: 'boolean',
              initialValue: false,
            }),
          ],

          preview: {
            select: {
              title: 'question',
            },
          },
        },
      ],
    }),
  ],
})
