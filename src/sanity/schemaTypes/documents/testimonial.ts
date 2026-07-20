import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  description: 'Customer testimonials and endorsements used throughout the website.',
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      description: 'Information about the person who provided the testimonial.',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          description: 'The full name of the person giving the testimonial.',
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'avatar',
          title: 'Avatar',
          type: 'image',
          description: 'Profile image of the testimonial author.',
          options: {
            hotspot: true,
          },
        }),

        defineField({
          name: 'role',
          title: 'Role',
          type: 'string',
          description:
            'The author’s job title or position (for example, CEO or Marketing Director).',
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'company',
          title: 'Company',
          type: 'string',
          description: 'The organisation or company the author represents.',
          validation: (r) => r.required(),
        }),
      ],
    }),

    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      description: 'The testimonial text provided by the customer or user.',
      rows: 5,
      validation: (r) =>
        r.required().min(20).error('A testimonial should contain at least 20 characters'),
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description:
        'Display this testimonial in featured sections such as the homepage or highlighted testimonial blocks.',
      initialValue: false,
    }),
  ],
})
