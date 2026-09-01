import { defineField, defineType } from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skills',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Display name of the technology.',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'Square SVG or PNG logo with a transparent background. SVG is preferred.',
      options: {
        hotspot: false,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Technology Type',
      type: 'string',
      description: 'What kind of technology this is.',
      options: {
        list: [
          { title: 'Language', value: 'Language' },
          { title: 'Framework', value: 'Framework' },
          { title: 'Library', value: 'Library' },
          { title: 'Database', value: 'Database' },
          { title: 'Tool', value: 'Tool' },
          { title: 'Platform', value: 'Platform' },
          { title: 'Runtime', value: 'Runtime' },
          { title: 'Service', value: 'Service' },
          { title: 'Other', value: 'Other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'group',
      title: 'Portfolio Group',
      type: 'string',
      description: 'Where the skill is used in your stack.',
      options: {
        list: [
          { title: 'Frontend', value: 'Frontend' },
          { title: 'Backend', value: 'Backend' },
          { title: 'Data', value: 'Data' },
          { title: 'Tooling', value: 'Tooling' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'proficiency',
      title: 'Proficiency',
      type: 'string',
      description:
        'A personal assessment. Useful for sorting or displaying experience levels later.',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
          { title: 'Expert', value: 'Expert' },
        ],
        layout: 'radio',
      },
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'logo',
    },
  },
})
