import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (r) =>
        r.custom((role, context) => {
          const company = (context.document as any)?.company
          if (!role && !company) return 'Provide at least a role or a company'
          return true
        }),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (r) =>
        r.custom((company, context) => {
          const role = (context.document as any)?.role
          if (!role && !company) return 'Provide at least a role or a company'
          return true
        }),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description:
        'Mark this testimonial as featured for homepage or highlight sections',
    }),
  ],
})
