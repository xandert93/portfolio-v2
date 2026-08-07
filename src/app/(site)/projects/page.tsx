import type { Metadata } from 'next'

import { fetchFeaturedProjects, fetchPaginatedProjects } from '@/sanity/lib/fetch'
import { Section } from '@/components/ui/Section'
import Pagination from '@/components/ui/Pagination'
import ProjectCard from '@/components/cards/ProjectCard'
import FeaturedProjectCard from './_components/FeaturedProjectCard'
import { ROUTES } from '@/config/routes'

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
        <Section
          glow={{ side: 'left', vertical: 'top' }}
          glyph={{ number: 1, side: 'right' }}
          header={{
            eyebrow: 'Portfolio',
            heading: 'Selected work',
            lead: "Projects I've designed and built end to end — the problem, the architecture and the decisions that made each one ship.",
            aside: `${featuredProjects.length} featured`,
          }}
        >
          <div className="flex flex-col gap-6 md:gap-8">
            {featuredProjects.map((project, i) => (
              <FeaturedProjectCard
                key={project._id}
                project={project}
                flipped={i % 2 === 1}
              />
            ))}
          </div>
        </Section>
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

      {otherProjects.length > 0 && (
        <Section
          id="all-projects"
          glow={{ side: 'right', vertical: 'bottom' }}
          glyph={{ number: 2, side: 'left' }}
          header={{
            eyebrow: 'The archive',
            heading: 'Everything else',
            lead: 'Smaller builds, experiments and client work — each with its own write-up.',
            aside: totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : undefined,
          }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {otherProjects.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i + 1} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={ROUTES.projects}
            hash="all-projects"
          />
        </Section>
      )}
    </>
  )
}
