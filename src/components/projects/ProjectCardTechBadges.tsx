import { ReactNode } from 'react'
import type { Project } from '@/sanity/types'

type Props = {
  technologies: Project['content']['technologies']
  /** When set, truncates the list and appends a "+N more" tag. */
  max?: number
}

export default function ProjectCardTechBadges({ technologies, max }: Props) {
  if (technologies.length === 0) return null

  const shownTechnologies = max ? technologies.slice(0, max) : technologies
  const hiddenCount = technologies.length - shownTechnologies.length

  return (
    <div className="flex flex-wrap gap-2">
      {shownTechnologies.map(({ _id, name }) => (
        <TechBadge key={_id} children={name} />
      ))}
      {hiddenCount > 0 && (
        <span className="text-muted px-1 py-1 text-[0.6rem] tracking-widest uppercase">
          +{hiddenCount} more
        </span>
      )}
    </div>
  )
}

const TechBadge = (props: { children: ReactNode }) => {
  return (
    <span
      className="border-faint text-accent-strong rounded border px-3 py-1 text-[0.6rem] tracking-widest uppercase"
      {...props}
    />
  )
}
