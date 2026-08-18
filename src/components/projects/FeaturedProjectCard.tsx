'use client'

import type { Project } from '@/sanity/types'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { ArrowUpRight } from 'lucide-react'

import { genImageBuilder } from '@/sanity/lib/image'
import { StopPropagationAnchor } from '@/components/links/StopPropagationAnchor'
import { Badge } from '@/components/ui/Badge'
import { ROUTES } from '@/config/routes'

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
      <CardImage />
      <CardContent />
    </article>
  )

  function CardImage() {
    return (
      <div
        className={clsx(
          'relative aspect-16/10 overflow-hidden md:aspect-auto md:min-h-80',
          isAlternated && 'md:order-2',
        )}
      >
        {coverImage ? (
          <Thumbnail image={coverImage} alt={title} />
        ) : (
          <div className="bg-warm flex h-full w-full items-center justify-center">
            <span className="text-muted text-[0.65rem] tracking-widest uppercase">
              No image
            </span>
          </div>
        )}
      </div>
    )
  }

  function CardContent() {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 text-center md:p-12">
        <div className="flex flex-wrap items-center gap-4">
          {/* <Badge>
            <span className="bg-accent size-1.5 rounded-full" />
            Featured
          </Badge> */}

          <span className="text-accent-strong text-[0.65rem] tracking-[0.16em] uppercase">
            {category}
            {date && (
              <>
                {' '}
                <span className="text-muted">·</span> {date.slice(0, 4)}
              </>
            )}
          </span>
        </div>

        <Title title={title} slug={slug} />
        <Summary summary={summary} />
        {technologies.length > 0 && <TechnologyList technologies={technologies} />}
        {(urls.repo || urls.live) && <UrlList urls={urls} />}
      </div>
    )
  }
}

type TitleProps = {
  title: Project['title']
  slug: Project['slug']
}

const Title = ({ title, slug }: TitleProps) => {
  return (
    <h3 className="font-serif text-3xl leading-tight italic md:text-4xl">
      <Link
        href={`${ROUTES.projects}/${slug}`}
        className="group-hover:text-accent flex gap-1 transition-colors before:absolute before:inset-0 before:content-['']"
      >
        <span>{title}</span>
        <ArrowUpRight className="text-muted group-hover:text-accent inline-block size-5 self-start align-baseline transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </h3>
  )
}

type SummaryProps = {
  summary: Project['content']['summary']
}

const Summary = ({ summary }: SummaryProps) => {
  return (
    <p className="text-muted max-w-md text-sm leading-relaxed font-light">{summary}</p>
  )
}

type ThumbnailProps = {
  image: Project['media']['coverImage']
  alt: Project['title']
}

const Thumbnail = ({ image, alt }: ThumbnailProps) => {
  return (
    <Image
      src={genImageBuilder(image)
        .width(1120)
        .height(760)
        .fit('crop')
        .auto('format')
        .url()}
      alt={alt}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-cover"
    />
  )
}

type TechnologyListProps = {
  technologies: Project['content']['technologies']
}

const TechnologyList = ({ technologies }: TechnologyListProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {technologies.map(({ _id, name }) => (
        <span
          key={_id}
          className="border-faint text-accent-strong rounded-sm border px-3 py-1 text-[0.6rem] tracking-widest uppercase"
        >
          {name}
        </span>
      ))}
    </div>
  )
}

type UrlListProps = {
  urls: Project['urls']
}

const UrlList = ({ urls }: UrlListProps) => {
  return (
    <div className="relative z-10 flex flex-wrap gap-6">
      {urls.repo && (
        <StopPropagationAnchor
          href={urls.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent text-[0.65rem] tracking-widest uppercase transition-colors"
        >
          Repository ↗
        </StopPropagationAnchor>
      )}
      {urls.live && (
        <StopPropagationAnchor
          href={urls.live}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-accent text-[0.65rem] tracking-widest uppercase transition-colors"
        >
          Live site ↗
        </StopPropagationAnchor>
      )}
    </div>
  )
}
