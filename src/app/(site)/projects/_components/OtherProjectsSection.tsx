'use client'

import { Projects } from '@/sanity/types'

import { motion } from 'framer-motion'

import OtherProjectCard from '@/components/projects/OtherProjectCard'
import { Section } from '@/components/ui/Section'
import { fadeUp } from '@/lib/motion'
import Pagination from '@/components/ui/Pagination'
import { ROUTES } from '@/config/routes'

type Props = {
  projects: Projects
}

export default function OtherProjectsSection({ projects }: Props) {
  return (
    <Section
      id="all-projects"
      glow={{ side: 'right', vertical: 'bottom' }}
      glyph={{ number: 2, side: 'left' }}
      header={{
        eyebrow: 'The archive',
        heading: 'Everything else',
        lead: 'Smaller builds, experiments and client work — each with its own write-up.',
      }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {projects.map((project, i) => (
          <motion.div key={project._id} variants={fadeUp}>
            <OtherProjectCard project={project} index={i + 1} />
          </motion.div>
        ))}
      </div>

      {/* {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={ROUTES.projects}
          hash="all-projects"
        />
      )} */}
    </Section>
  )
}
