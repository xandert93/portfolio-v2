import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // 1. Identity
    defineField({
      name: 'names',
      title: 'Names',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'first',
          title: 'First name',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'last',
          title: 'Last name',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'display',
          title: 'Display name',
          type: 'string',
          description:
            'Public-facing alias used for branding (e.g. header, footer, author attribution). If not provided, the system will fall back to your first and surname.',
        }),
      ],
    }),

    // 2. Hero content
    defineField({
      name: 'hero',
      title: 'Hero',
      description: 'Hero section content displayed at the top of the page.',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          description: 'Main hero heading displayed prominently on the page.',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'tagline',
          title: 'Tagline',
          description:
            'Supporting hero text. Supports basic rich text formatting (italic, bold).',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              marks: {
                decorators: [
                  { title: 'Italic', value: 'em' },
                  { title: 'Strong', value: 'strong' },
                ],
              },
            },
          ],
        }),
      ],
    }),

    // 3. Branding / meta
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Square image, ideally 512x512px, PNG or SVG',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      description: 'Search engine optimisation metadata for this page.',
      type: 'object',
      validation: (r) => r.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          description: 'The SEO title shown in search engine results and browser tabs.',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          description:
            'A short summary used by search engines. Aim for around 150–160 characters.',
          type: 'text',
          rows: 3,
          validation: (r) =>
            r
              .required()
              .max(160)
              .warning('Longer descriptions get truncated in search results'),
        }),
      ],
    }),

    // 4. Contact (grouped: email, phone, whatsapp depends on phone)
    defineField({ name: 'email', title: 'Email', type: 'string' }),

    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Use international format e.g. +447700900123.',
    }),

    defineField({
      name: 'hasWhatsApp',
      type: 'boolean',
      title: 'Enable WhatsApp Contact',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const phone = context.document?.phone
          if (value && !phone) return 'Cannot enable WhatsApp without a phone number'
          return true
        }),
    }),

    defineField({
      name: 'socialUrls',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'twitter', title: 'Twitter / X', type: 'url' }),
        defineField({
          name: 'stackoverflow',
          title: 'Stack Overflow',
          type: 'url',
        }),
      ],
    }),

    // 5. Downloads
    defineField({
      name: 'cv',
      title: 'CV',
      type: 'file',
      description: 'Upload your CV as a PDF.',
      options: {
        accept: '.pdf',
      },
    }),
  ],

  preview: {
    select: {
      display: 'names.display',
      first: 'names.first',
      last: 'names.last',
      media: 'favicon',
    },
    prepare({ display, first, last, media }) {
      return {
        title: display || `${first} ${last}`,
        media,
      }
    },
  },
})
