import type { Metadata } from 'next'

import { motion } from 'framer-motion'

import { fetchFeaturedProjects, fetchPaginatedProjects } from '@/sanity/lib/fetch'
import { Section } from '@/components/ui/Section'
import Pagination from '@/components/ui/Pagination'
import OtherProjectCard from '@/components/projects/OtherProjectCard'

import { ROUTES } from '@/config/routes'
import FeaturedProjectsSection from './_components/FeaturedProjectsSection'
import { fadeUp } from '@/lib/motion'
import OtherProjectsSection from './_components/OtherProjectsSection'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected projects — from production systems to side experiments. Case studies covering the problem, the build and the technical decisions behind each one.',
  openGraph: {
    title: 'Work',
    description:
      'Selected projects — from production systems to side experiments, with the thinking behind each build.',
    type: 'website',
  },
  alternates: { canonical: ROUTES.projects },
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const [featuredProjects, { projects: otherProjects, totalPages }] = await Promise.all([
    fetchFeaturedProjects(),
    fetchPaginatedProjects(currentPage),
  ])

  const isEmpty = featuredProjects.length === 0 && otherProjects.length === 0

  return (
    <>
      {featuredProjects.length > 0 ? (
        <FeaturedProjectsSection projects={featuredProjects} />
      ) : (
        !isEmpty && (
          <Section
            glow={{ side: 'left', vertical: 'top' }}
            header={{
              eyebrow: 'Portfolio',
              heading: 'Selected work',
              lead: "Projects I've designed and built end to end — the problem, the architecture and the decisions that made each one ship.",
            }}
          >
            <span className="sr-only">Project archive below</span>
          </Section>
        )
      )}

      {isEmpty && (
        <Section
          glow={{ side: 'center', vertical: 'top' }}
          header={{
            eyebrow: 'Portfolio',
            heading: 'Nothing here yet',
            lead: 'New work is in progress — check back soon.',
          }}
        >
          <span className="sr-only">No projects published</span>
        </Section>
      )}

      {otherProjects.length > 0 && <OtherProjectsSection projects={otherProjects} />}
    </>
  )
}
