import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'bio', title: 'Bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'openToWork', title: 'Open to Work', type: 'boolean', initialValue: false }),
    defineField({ name: 'resumeUrl', title: 'Résumé URL', type: 'url' }),
  ],
})
