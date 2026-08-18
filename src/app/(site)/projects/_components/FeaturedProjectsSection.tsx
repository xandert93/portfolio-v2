import type { Projects } from '@/sanity/types'

import { Section } from '@/components/ui/Section'

import FeaturedProjectList from '@/components/projects/FeaturedProjectList'

type Props = {
  projects: Projects
}

export default function FeaturedProjectsSection({ projects }: Props) {
  return (
    <Section
      glow={{ side: 'left', vertical: 'top' }}
      glyph={{ number: 1, side: 'right' }}
      header={{
        eyebrow: 'Portfolio',
        heading: 'Selected work',
        lead: "Projects I've designed and built end to end — the problem, the architecture and the decisions that made each one get delivered.",
      }}
    >
      <FeaturedProjectList projects={projects} />
    </Section>
  )
}
