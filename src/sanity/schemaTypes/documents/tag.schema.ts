import { defineField, defineType } from 'sanity'

export const tag = defineType({
  name: 'tag',
  title: 'Tags',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
})
