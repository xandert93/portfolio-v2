import type { Project } from '@/sanity/types'

import ProjectCardMeta from './ProjectCardMeta'
import ProjectCardTechBadges from './ProjectCardTechBadges'
import ProjectCardThumbnail from './ProjectCardThumbnail'
import ProjectCardTitle from './ProjectCardTitle'
import ProjectCardUrls from './ProjectCardUrls'

const MAX_TAGS = 3

type Props = {
  project: Project
  /** 1-based position, rendered as the card's index numeral. */
  index?: number
}

export default function OtherProjectCard({ project, index }: Props) {
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
    <article className="card group relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-16/10 overflow-hidden">
        <ProjectCardThumbnail
          image={coverImage}
          alt={title}
          width={880}
          height={550}
          sizes="(min-width: 768px) 45vw, 100vw"
        />

        {typeof index === 'number' && (
          <span className="bg-paper/70 text-ink absolute top-3 left-3 rounded-sm px-2.5 py-1 font-serif text-[0.7rem] italic backdrop-blur">
            {String(index).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <ProjectCardMeta category={category} date={date} />
        <ProjectCardTitle title={title} slug={slug} />
        <p className="text-muted line-clamp-3 text-sm leading-relaxed font-light">
          {summary}
        </p>

        <div className="mt-auto pt-2">
          <ProjectCardTechBadges technologies={technologies} max={MAX_TAGS} />
        </div>

        {(urls.repo || urls.live) && (
          <div className="border-faint border-t pt-4">
            <ProjectCardUrls urls={urls} />
          </div>
        )}
      </div>
    </article>
  )
}
