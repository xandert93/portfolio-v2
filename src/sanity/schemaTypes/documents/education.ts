import { defineField, defineType } from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Educations',
  type: 'document',
  fields: [
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'type',
          title: 'Level',
          type: 'string',
          validation: (r) => r.required(),
          options: {
            list: [
              { title: 'Secondary School', value: 'secondary' },
              { title: 'Sixth Form / College', value: 'sixthForm' },
              { title: 'University', value: 'university' },
              { title: 'Other / Certification', value: 'other' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({ name: 'location', title: 'Location', type: 'string' }),
        defineField({ name: 'url', title: 'Website', type: 'url' }),
      ],
    }),
    defineField({
      name: 'qualification',
      title: 'Qualification',
      description: 'e.g. "GCSEs", "A-Levels", "BA (Hons)", "PGCE"',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fieldOfStudy',
      title: 'Field of Study',
      description: 'e.g. "Graphic Design" — leave blank for GCSEs',
      type: 'string',
    }),
    defineField({ name: 'grade', title: 'Grade / Result', type: 'string' }),
    defineField({
      name: 'startYear',
      title: 'Start Year',
      type: 'number',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'isCurrent',
      title: 'Currently studying here',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'endYear',
      title: 'End Year',
      type: 'number',
      hidden: ({ parent }) => parent?.isCurrent,
      validation: (r) =>
        r.custom((endYear, context) => {
          const { startYear, isCurrent } = context.parent as {
            startYear?: number
            isCurrent?: boolean
          }
          if (isCurrent) return true
          if (endYear && startYear && endYear < startYear) {
            return 'End year cannot be before start year'
          }
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      description: 'Optional: standout modules, awards, thesis, etc.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  orderings: [
    {
      title: 'Start Year, New',
      name: 'startYearDesc',
      by: [{ field: 'startYear', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'institution.name',
      subtitle: 'qualification',
      media: 'institution.logo',
    },
  },
})
