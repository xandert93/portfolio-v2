import { defineArrayMember, defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experiences',
  type: 'document',

  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (r) => r.required().max(80),
        }),

        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),

        defineField({
          name: 'website',
          title: 'Website',
          type: 'url',
        }),
      ],
    }),

    defineField({
      name: 'employment',
      title: 'Employment',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'startDate',
          title: 'Start date',
          type: 'date',
          options: {
            dateFormat: 'MMM YYYY',
          },
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'isCurrent',
          title: 'Current role',
          type: 'boolean',
          initialValue: false,
        }),

        defineField({
          name: 'endDate',
          title: 'End date',
          type: 'date',
          hidden: ({ parent }) => Boolean(parent?.isCurrent),
          validation: (r) =>
            r.custom((value, context) => {
              const parent = context.parent as any

              if (!parent?.isCurrent && !value) {
                return 'End date is required unless this is your current role.'
              }

              return true
            }),
        }),

        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
          description: 'e.g. London, UK • Remote • Hybrid',
          validation: (r) => r.required().max(80),
        }),
      ],
    }),

    defineField({
      name: 'role',
      title: 'Role',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Your job title exactly as it appeared during your employment.',
          validation: (r) =>
            r.required().min(2).max(80).warning('Keep role titles concise.'),
        }),

        defineField({
          name: 'summary',
          title: 'Summary',
          type: 'text',
          rows: 4,
          description:
            'A concise overview of the role (1–3 sentences, around 30–80 words).',
          validation: (r) =>
            r.required().min(40).max(500).warning('Aim for fewer than 80 words.'),
        }),

        defineField({
          name: 'highlights',
          title: 'Highlights',
          type: 'array',
          initialValue: [],
          of: [
            defineArrayMember({
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
          ],
          description: 'Key achievements or responsibilities.',
          validation: (r) => r.required().min(2).max(6),
        }),

        defineField({
          name: 'impact',
          title: 'Overall impact',
          type: 'text',
          rows: 3,
          description:
            'Summarise the measurable outcome or business impact of your work.',
          validation: (r) =>
            r.required().max(300).warning('Keep this to around 50 words.'),
        }),
      ],
    }),

    defineField({
      name: 'skills',
      title: 'Skills Used',
      type: 'array',
      description: 'Languages, frameworks and tools used in this role.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'skill' }] })],
      validation: (r) => r.required().max(5),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Useful if each experience has its own page.',
      options: {
        source: (doc: any) => {
          const roleTitle = doc.role?.title?.trim()
          const companyName = doc.company?.name?.trim()
          // Avoid generating a slug like "-" before the nested fields are filled in
          if (!roleTitle || !companyName) return ''
          return `${roleTitle}-${companyName}`
        },
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
  ],

  preview: {
    select: {
      title: 'role.title',
      subtitle: 'company.name',
      media: 'company.logo',
    },

    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
