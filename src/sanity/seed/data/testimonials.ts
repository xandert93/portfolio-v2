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
      name: 'Richard Hepburn',
      role: 'Founder',
      company: 'Rainflow',
      avatarFilename: 'richard-hepburn.jpg',
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
      name: 'James Prendergast',
      role: 'Lead Developer',
      company: 'Ravenware',
      avatarFilename: 'james-prendergast.jpg',
    },
    quote:
      "The day Xander joined my team, I went home and told my wife that he's going to completely change the way I code.",
    isFeatured: true,
  },
  {
    author: {
      name: 'Moysser Aziz',
      role: 'Junior Frontend Developer',
      company: 'Mindbridge',
      avatarFilename: 'moysser-aziz.jpg',
    },
    quote:
      'Xander taught me much of what I know about web development. I wouldn’t be where I am today without his guidance.',
    isFeatured: false,
  },
] satisfies SeedTestimonial[]
