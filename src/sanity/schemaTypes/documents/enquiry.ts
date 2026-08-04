import { defineField, defineType } from 'sanity'

export const enquiry = defineType({
  name: 'enquiry',
  title: 'Enquiries',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (r) =>
        r.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: 'email',
          invert: false,
        }),
    }),

    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Optional contact number provided by the enquirer.',
    }),

    defineField({
      name: 'organisation',
      title: 'Company',
      type: 'string',
      description: 'Optional organisation or company name.',
    }),

    defineField({
      name: 'website',
      title: 'Current Site',
      type: 'url',
      description: 'Optional existing website URL.',
    }),

    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      validation: (r) => r.required(),
      options: {
        list: [
          { title: 'New website', value: 'new-website' },
          { title: 'Existing site update', value: 'site-update' },
          { title: 'Freelance enquiry', value: 'freelance' },
          { title: 'Job opportunity', value: 'job' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),

    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      description: 'Expected project timeframe.',
      options: {
        list: [
          { title: 'As soon as possible', value: 'asap' },
          { title: 'In 1 – 3 months', value: '1-3-months' },
          { title: '3+ months out', value: '3-plus-months' },
          { title: 'Just exploring', value: 'exploring' },
        ],
      },
    }),

    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'string',
      description: 'Estimated project budget provided by the enquirer.',
      options: {
        list: [
          { title: 'Under £2k', value: 'under-2k' },
          { title: '£2k – £5k', value: '2k-5k' },
          { title: '£5k – £10k', value: '5k-10k' },
          { title: '£10k+', value: '10k-plus' },
          { title: 'Not sure yet', value: 'not-sure' },
        ],
      },
    }),

    defineField({
      name: 'referral',
      title: 'How They Found You',
      type: 'string',
      description: 'Source of the enquiry.',
      options: {
        list: [
          { title: 'Search engine', value: 'search' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'GitHub', value: 'github' },
          { title: 'A recommendation', value: 'referral' },
          { title: 'Somewhere else', value: 'other' },
        ],
      },
    }),

    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      description:
        'The enquiry details, project requirements, or additional information.',
      rows: 5,
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Internal status used to track the progress of this enquiry.',
      options: {
        list: ['New', 'Replied', 'Archived', 'Spam'],
        layout: 'radio',
      },
      initialValue: 'New',
    }),

    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      description: 'The date and time this enquiry was submitted.',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'submittedDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      status: 'status',
    },
    prepare: ({ title, subtitle, status }) => ({
      title,
      subtitle: status ? `${subtitle} · ${status}` : subtitle,
    }),
  },
})
