import type { Project } from '@/sanity/types'

import clsx from 'clsx'

import ProjectCardMeta from './ProjectCardMeta'
import ProjectCardTechBadges from './ProjectCardTechBadges'
import ProjectCardThumbnail from './ProjectCardThumbnail'
import ProjectCardTitle from './ProjectCardTitle'
import ProjectCardUrls from './ProjectCardUrls'
import ProjectCardSummary from './ProjectCardSummary'
import Divider from '../ui/Divider'

type Props = {
  project: Project
  /** Alternates the image side so stacked features read as an editorial spread. */
  isAlternated?: boolean
}

export default function FeaturedProjectCard({ project, isAlternated = false }: Props) {
  const {
    slug,
    title,
    category,
    date,
    media: { coverImage },
    content: { summary, technologies },
    urls,
  } = project

  return (
    <article className="card group relative grid grid-cols-1 overflow-hidden md:grid-cols-2">
      <div
        className={clsx(
          'relative aspect-16/10 overflow-hidden md:aspect-auto md:min-h-80',
          isAlternated && 'md:order-2',
        )}
      >
        <ProjectCardThumbnail
          image={coverImage}
          alt={title}
          width={1120}
          height={760}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 md:gap-6 md:p-12">
        <ProjectCardMeta category={category} date={date} />
        <ProjectCardTitle title={title} slug={slug} size="lg" />
        <ProjectCardSummary summary={summary} />
        <ProjectCardTechBadges technologies={technologies} />
        <Divider className="my-1.5" />
        <ProjectCardUrls urls={urls} />
      </div>
    </article>
  )
}
