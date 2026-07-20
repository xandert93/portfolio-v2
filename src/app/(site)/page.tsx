import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from 'next-sanity'

import {
  fetchSiteSettings,
  fetchFeaturedProjects,
  fetchAbout,
  fetchTestimonials,
  fetchTechSkills,
} from '@/sanity/lib/fetch'

import {
  HeroSection,
  FeaturedProjectsSection,
  TechSkillsSection,
  TestimonialsSection,
  AboutSection,
  ContactCtaSection,
} from './(home)/_components'

export default async function Home() {
  // Parallel fetch is best for a a page composed from one CMS payload + if same data is needed in several components e.g. about
  const [settings, about, projects, techSkills, testimonials] = await Promise.all([
    fetchSiteSettings(),
    fetchAbout(),
    fetchFeaturedProjects(),
    fetchTechSkills(),
    fetchTestimonials(),
  ])

  // Page needs settings & about. Fail fast if absent.
  if (!settings)
    throw new Error('Site Settings document is missing. Please add to Sanity Studio!')

  if (!about) throw new Error('About document is missing. Please add to Sanity Studio!')

  return (
    <>
      <HeroSection settings={settings} about={about} />
      <FeaturedProjectsSection projects={projects} />
      <TechSkillsSection skills={techSkills} />
      <TestimonialsSection testimonials={testimonials} />
      <AboutSection about={about} />
      <ContactCtaSection about={about} isOpenToWork={about.isOpenToWork} />
    </>
  )
}

/*📚 How does a server component handle a throw?

In a Next.js Server Component (whether it's async or not), throw new Error() does not crash your server process. Instead, Next.js catches the error and renders the nearest error boundary.

In the component above:

- In development, you'll see the Next.js error overlay with the stack trace.
- In production, the user sees Next.js's generic 500 error page. The specific error message isn't exposed to the client, but it's logged on the server.

If we have app/error.tsx, <Error error={error} reset={reset} /> is executed.

*/
