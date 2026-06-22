import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'Your first name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'surname',
      title: 'Your surname',
      type: 'string',
      validation: (r) => r.required(),
    }),

    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 3,
    }),

    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'githubUrl', title: 'GitHub URL', type: 'url' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'twitterUrl', title: 'Twitter / X URL', type: 'url' }),

    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Use international format, e.g. +447700900123',
    }),
    defineField({
      name: 'hasWhatsApp',
      type: 'boolean',
      title: 'Enable WhatsApp Contact',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const phone = context.document?.phone
          if (value && !phone)
            return 'Cannot enable WhatsApp without a phone number'
          return true
        }),
    }),
  ],
})
