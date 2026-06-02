import { defineField, defineType } from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skills',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Language', 'Framework', 'Tool', 'Platform', 'Other'] },
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency',
      type: 'string',
      options: { list: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    }),
  ],
})
