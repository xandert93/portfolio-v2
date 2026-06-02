import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({ name: 'authorName', title: 'Author Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
  ],
})
