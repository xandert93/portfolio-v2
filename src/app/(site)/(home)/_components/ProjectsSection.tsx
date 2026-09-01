import type { Projects } from '@/sanity/types'

import { Section } from '@/components/ui/Section'

import FeaturedProjectList from '@/components/projects/FeaturedProjectList'

type Props = {
  projects: Projects
}

export default function ProjectsSection({ projects }: Props) {
  return (
    <Section
      id="work"

      glyph={{
        number: 1,
        side: 'left',
      }}
      glow={{
        side: 'right',
        vertical: 'top',
      }}
      header={{
        eyebrow: 'Selected work',
        heading: 'Featured projects',
        lead: 'A few recent builds where design, performance and clean architecture had to work together.',
        // aside: <ArrowLink href={ROUTES.projects} children="All Work" />,
      }}
    >
      <FeaturedProjectList projects={projects} />
    </Section>
  )
}
