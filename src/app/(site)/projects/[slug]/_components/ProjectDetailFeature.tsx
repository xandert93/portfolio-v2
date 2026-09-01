'use client'

import Image from 'next/image'
import { Project } from '@/sanity/types'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { CircleArrowOutUpRight, ImageOff } from 'lucide-react'

import { fadeUpStagger, fadeUpStaggerReduced } from '@/lib/motion'

const GRID_COLUMNS = 2

type Props = {
  feature: Project['content']['features'][number]
  /**
   * Built from feature.image via genImageBuilder in the page — kept as a
   * plain URL here so this component doesn't need to know about Sanity's
   * image pipeline. Undefined when the feature has no image set in Studio.
   */
  imageUrl?: string
  /**
   * True when at least one feature in this section has a real image — in
   * that case a feature without its own image renders a placeholder graphic
   * (rather than nothing) so every item's title lines up in the grid. When
   * no feature in the section has an image at all, no placeholder is shown
   * for any of them since there's nothing to align against.
   */
  hasAnyFeatureImages: boolean
  /** Position within the features grid, used to stagger same-row items. */
  index: number
  className?: string
}

export default function ProjectDetailFeature({
  feature,
  imageUrl,
  hasAnyFeatureImages,
  index,
  className,
}: Props) {
  const { title, description } = feature
  const shouldReduceMotion = useReducedMotion()
  const delay = (index % GRID_COLUMNS) * 0.08
  const variants = shouldReduceMotion ? fadeUpStaggerReduced(delay) : fadeUpStagger(delay)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      variants={variants}
      className={clsx('', className)}
    >
      {imageUrl ? (
        <div className="border-faint relative mb-5 aspect-16/10 w-full overflow-hidden rounded-sm border">
          <Image
            src={imageUrl}
            alt={`${title} — screenshot`}
            fill
            sizes="(min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        hasAnyFeatureImages && (
          <div
            aria-hidden
            className="border-faint from-accent-dim to-warm mb-5 hidden aspect-16/10 w-full overflow-hidden rounded-sm border bg-linear-to-br sm:flex sm:items-center sm:justify-center"
          >
            <div className="border-faint/70 bg-paper/70 flex size-11 items-center justify-center rounded-full border backdrop-blur-sm">
              <ImageOff className="text-muted/60 size-5" strokeWidth={1.5} />
            </div>
          </div>
        )
      )}

      <div className="flex gap-6">
        <span aria-hidden className="text-muted pt-1.25 md:pt-1.5">
          <CircleArrowOutUpRight className="size-4" strokeWidth={1.5} />
        </span>

        <div className="flex flex-col gap-2 md:gap-4">
          <p className="text-ink font-medium tracking-tight md:text-lg">{title}</p>

          {description && <p className="text-ink/80 leading-relaxed">{description}</p>}
        </div>
      </div>
    </motion.div>
  )
}
