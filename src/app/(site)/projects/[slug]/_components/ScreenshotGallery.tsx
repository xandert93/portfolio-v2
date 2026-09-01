'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUpStagger, fadeUpStaggerReduced } from '@/lib/motion'
import { useScreenshotLightbox, type Shot } from './ScreenshotLightbox'

export type { Shot }

type Props = {
  shots: Shot[]
  title: string
  /** Optional lead-in line shown above the grid. */
  intro?: string
}

const GRID_COLUMNS = 2

export default function ScreenshotGallery({ shots, title, intro }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const { open } = useScreenshotLightbox()

  return (
    <>
      {intro && <p className="text-muted mb-7 text-sm leading-relaxed">{intro}</p>}

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6">
        {shots.map((shot, i) => {
          const delay = (i % GRID_COLUMNS) * 0.08
          const variants = shouldReduceMotion
            ? fadeUpStaggerReduced(delay)
            : fadeUpStagger(delay)

          return (
            <motion.div
              key={shot.key}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              variants={variants}
            >
              <button
                onClick={() => open(shot.key)}
                className="card no-hover-transform group relative block aspect-16/10 w-full overflow-hidden"
                aria-label={`View screenshot ${i + 1} of ${title}`}
              >
                <Image
                  src={shot.url}
                  alt={`${title} — screenshot ${i + 1}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="bg-paper/70 text-ink absolute bottom-3 left-3 rounded-sm px-2.5 py-1 font-serif text-[0.7rem] italic opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </button>

              <div className="mt-3 text-center">
                <p className="text-ink text-sm font-medium">{shot.title}</p>
                <p className="text-muted mt-1 text-xs leading-relaxed">
                  {shot.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
