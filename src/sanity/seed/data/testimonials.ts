import { Testimonial } from '@/sanity/types'

type SeedTestimonial = Omit<
  Testimonial,
  '_id' | '_type' | '_rev' | '_createdAt' | '_updatedAt' | 'author'
> & {
  author: Omit<Testimonial['author'], 'avatar'> & {
    avatarFilename: string
  }
}

export const TESTIMONIALS: SeedTestimonial[] = [
  {
    author: {
      name: 'Priya Shah',
      role: 'Product Manager',
      company: 'Stripe',
      avatarFilename: 'priya-shah.jpg',
    },
    quote:
      'A reliable developer who quickly understood requirements and shipped high-quality features.',
    isFeatured: false,
  },
  {
    author: {
      name: 'Amit Singh',
      role: 'Tech Lead',
      company: 'Netlify',
      avatarFilename: 'amit-singh.jpg',
    },
    quote: 'Strong grasp of React and API design. Very easy to collaborate with.',
    isFeatured: false,
  },
  {
    author: {
      name: 'Sofia Patel',
      role: 'Founder',
      company: 'Indie Startup',
      avatarFilename: 'sofia-patel.jpg',
    },
    quote: 'Helped us go from idea to MVP quickly with excellent attention to detail.',
    isFeatured: false,
  },
  {
    author: {
      name: 'James Liu',
      role: 'Software Engineer',
      company: 'Atlassian',
      avatarFilename: 'james-liu.jpg',
    },
    quote: 'Consistently produces maintainable code and thinks carefully about UX.',
    isFeatured: false,
  },
  {
    author: {
      name: 'Richard Robinson',
      role: 'Senior Frontend Engineer',
      company: 'Vercel',
      avatarFilename: 'richard-robinson.jpg',
    },
    quote:
      'Xander delivered a clean, scalable implementation and communicated clearly throughout the project.',
    isFeatured: true,
  },
  {
    author: {
      name: 'Vanessa Vieira',
      role: 'Software Engineer',
      company: 'Shopify',
      avatarFilename: 'vanessa-vieira.jpg',
    },
    quote:
      'Xander quickly adapted to our codebase and delivered robust, maintainable features with minimal guidance.',
    isFeatured: false,
  },
] satisfies SeedTestimonial[]
