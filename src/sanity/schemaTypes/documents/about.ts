import { defineArrayMember, defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description:
            'Describe the image to be read aloud by screen readers for users with visual impairments.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      description:
        'Upload up to 3 images for a polaroid gallery. The first image is the featured photo displayed on top, the second appears behind it on the right, and the third appears behind it on the left. Each image includes a handwritten-style caption shown beneath it.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Describe the contents of the image for screen readers.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description:
                'Short handwritten-style caption displayed beneath the polaroid.',
              validation: (Rule) => Rule.required().max(40),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isOpenToWork',
      title: 'Available for Work',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'headline',
      location: 'location',
      isOpenToWork: 'isOpenToWork',
      media: 'avatar',
    },
    prepare({ title, location, isOpenToWork, media }) {
      return {
        title,
        subtitle: `${location || 'No location'}${isOpenToWork ? ' • Available for Work' : ''}`,
        media,
      }
    },
  },
})

/*
📚 { type: 'image' } fields in Sanity do not store image URLs. They store a reference to an asset via an asset ID and generates URLs when needed. about.avatar will look roughly like this:

{
  _type: "image",
  asset: {
    _type: "reference",
    _ref: "image-abc123-1200x1200-png"
  
}

This approach has several benefits over storing URls:

- resize images on demand
- gives browsers the format they support best e.g. Chrome → avatar.avif (~120 KB), Firefox → avatar.webp (~180 KB), Old IE → avatar.png (900 KB)
- crop using hotspots
- update CDN behavior

To consume it in our FE and convert it into a URL the FE underestands, we need to install @sanity/image-url:

npm i @sanity/image-url

Then create a helper named `urlFor` (see docs...)

As a result, instead of storing multiple versions of an image e.g.:

avatar-small.jpg
avatar-medium.jpg
avatar-large.jpg

You have one original image and then request exactly what you need:

urlFor(about.avatar).width(64).url()
urlFor(about.avatar).width(300).url()
urlFor(about.avatar).width(1200).url()

Sanity generates and caches each version automatically.

You can also do:

urlFor(about.avatar)
  .width(300)
  .height(300)
  .fit("crop") // If width & height are both set, crop to exactly those dimensions (uses the image hotspot if configured)
  .auto("format") // Serve the most efficient format the browser supports (e.g. AVIF/WebP, otherwise JPEG/PNG)
  .url(); // Generate the final CDN URL string
*/
