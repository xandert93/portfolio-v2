'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { genImageBuilder } from '@/sanity/lib/image'
import { StopPropagationAnchor } from '../links/StopPropagationAnchor'
import { ROUTES } from '@/config/routes'
import { fadeUp, fadeUpReduced } from '@/lib/motion'
import type { Project } from '@/sanity/types'

const MAX_TAGS = 4

type Props = {
  project: Project
  /** 1-based position, rendered as the card's index numeral. */
  index?: number
}

export default function ProjectCard({ project, index }: Props) {
  const shouldReduceMotion = useReducedMotion()

  const {
    slug,
    title,
    category,
    date,
    media: { coverImage },
    content: { summary, technologies },
    urls,
  } = project

  const visibleTech = technologies.slice(0, MAX_TAGS)
  const hiddenCount = technologies.length - visibleTech.length

  return (
    <motion.article
      variants={shouldReduceMotion ? fadeUpReduced : fadeUp}
      className="card group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        {coverImage ? (
          <Image
            src={genImageBuilder(coverImage)
              .width(880)
              .height(550)
              .fit('crop')
              .auto('format')
              .url()}
            alt={title ?? ''}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="bg-warm flex h-full w-full items-center justify-center">
            <span className="text-muted text-[0.65rem] tracking-widest uppercase">
              No image
            </span>
          </div>
        )}

        {typeof index === 'number' && (
          <span className="bg-paper/70 text-ink absolute top-3 left-3 rounded-sm px-2.5 py-1 font-serif text-[0.7rem] italic backdrop-blur">
            {String(index).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <div className="text-muted flex items-center gap-3 text-[0.65rem] tracking-[0.16em] uppercase">
          {date && <span>{date.slice(0, 4)}</span>}
          <span className="bg-faint h-px w-6" />
          <span className="text-accent">{category}</span>
        </div>

        <div className="flex items-start gap-2">
          <h3 className="font-serif text-2xl leading-snug italic">
            {/* Stretched link — makes the whole card clickable without nesting anchors */}
            <Link
              href={`${ROUTES.projects}/${slug}`}
              className="group-hover:text-accent transition-colors before:absolute before:inset-0 before:content-['']"
            >
              {title}
            </Link>
          </h3>
          <ArrowUpRight className="text-muted group-hover:text-accent mt-1.5 size-4 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <p className="text-muted line-clamp-3 text-sm leading-relaxed font-light">
          {summary}
        </p>

        {visibleTech.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {visibleTech.map(({ _id, name }) => (
              <span
                key={_id}
                className="border-faint text-accent-strong rounded-sm border px-2.5 py-1 text-[0.6rem] tracking-widest uppercase"
              >
                {name}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-muted px-1 py-1 text-[0.6rem] tracking-widest uppercase">
                +{hiddenCount} more
              </span>
            )}
          </div>
        )}

        {(urls.repo || urls.live) && (
          <div className="border-faint relative z-10 flex gap-5 border-t pt-4">
            {urls.repo && <CardLink href={urls.repo}>Repository ↗</CardLink>}
            {urls.live && <CardLink href={urls.live}>Live site ↗</CardLink>}
          </div>
        )}
      </div>
    </motion.article>
  )
}

type CardLinkProps = { href: string; children: React.ReactNode }

function CardLink(props: CardLinkProps) {
  return (
    <StopPropagationAnchor
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted hover:text-accent text-[0.65rem] tracking-widest uppercase transition-colors"
      {...props}
    />
  )
}
