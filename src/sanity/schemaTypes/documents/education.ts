import { defineField, defineType } from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({ name: 'institution', title: 'Institution', type: 'string', validation: r => r.required() }),
    defineField({ name: 'degree', title: 'Degree', type: 'string' }),
    defineField({ name: 'startYear', title: 'Start Year', type: 'number' }),
    defineField({ name: 'endYear', title: 'End Year', type: 'number' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'logo', title: 'Institution Logo', type: 'image', options: { hotspot: true } }),
  ],
})
