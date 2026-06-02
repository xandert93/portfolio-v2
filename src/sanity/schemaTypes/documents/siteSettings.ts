import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'name', title: 'Your Name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'githubUrl', title: 'GitHub URL', type: 'url' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'twitterUrl', title: 'Twitter / X URL', type: 'url' }),
    defineField({ name: 'seoTitle', title: 'Default SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'Default SEO Description', type: 'text', rows: 3 }),
  ],
})
