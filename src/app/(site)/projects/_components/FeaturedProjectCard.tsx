'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { genImageBuilder } from '@/sanity/lib/image'
import { StopPropagationAnchor } from '@/components/links/StopPropagationAnchor'
import { ROUTES } from '@/config/routes'
import { fadeUp, fadeUpReduced } from '@/lib/motion'
import type { Project } from '@/sanity/types'

type Props = {
  project: Project
  /** Alternates the image side so stacked features read as an editorial spread. */
  flipped?: boolean
}

export default function FeaturedProjectCard({ project, flipped = false }: Props) {
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

  return (
    <motion.article
      variants={shouldReduceMotion ? fadeUpReduced : fadeUp}
      className="card group relative grid grid-cols-1 items-stretch overflow-hidden md:grid-cols-2"
    >
      <div
        className={`relative aspect-16/10 overflow-hidden md:aspect-auto md:min-h-[320px] ${
          flipped ? 'md:order-2' : ''
        }`}
      >
        {coverImage ? (
          <Image
            src={genImageBuilder(coverImage)
              .width(1120)
              .height(760)
              .fit('crop')
              .auto('format')
              .url()}
            alt={title ?? ''}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="bg-warm flex h-full w-full items-center justify-center">
            <span className="text-muted text-[0.65rem] tracking-widest uppercase">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-4">
          <span className="badge-open">
            <span className="bg-accent size-1.5 rounded-full" />
            Featured
          </span>
          <span className="text-muted text-[0.65rem] tracking-[0.16em] uppercase">
            {category}
            {date && ` · ${date.slice(0, 4)}`}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <h3 className="font-serif text-3xl leading-tight italic md:text-4xl">
            <Link
              href={`${ROUTES.projects}/${slug}`}
              className="group-hover:text-accent transition-colors before:absolute before:inset-0 before:content-['']"
            >
              {title}
            </Link>
          </h3>
          <ArrowUpRight className="text-muted group-hover:text-accent mt-2 size-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <p className="text-muted max-w-md text-sm leading-relaxed font-light">
          {summary}
        </p>

        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map(({ _id, name }) => (
              <span
                key={_id}
                className="border-faint text-accent-strong rounded-sm border px-3 py-1 text-[0.6rem] tracking-widest uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {(urls.repo || urls.live) && (
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
        )}
      </div>
    </motion.article>
  )
}
