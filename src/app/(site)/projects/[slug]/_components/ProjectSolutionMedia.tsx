'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp, fadeUpReduced } from '@/lib/motion'
import { scrollToSection } from '@/lib/scrollToSection'
import { useScreenshotLightbox, type Shot } from './ScreenshotLightbox'

type Props = {
  shot: Shot
  title: string
}

/**
 * A single full-width screenshot dropped right after "The solution" prose.
 * Exists to break up the run of text-only sections at the top of the case
 * study — problem / solution / role — with something to actually look at,
 * before the reader reaches "Key features".
 *
 * Opens the shared lightbox (see ScreenshotLightbox) rather than owning its
 * own modal, so there's still only one place on the page that owns that
 * piece of state, and arrow-key navigation from here carries on into the
 * rest of the Screens gallery.
 *
 * Carries its own scroll trigger (rather than just fading in with the rest
 * of the Solution block) so it reveals as a distinct second beat once the
 * reader scrolls past the prose above it, instead of popping in already
 * visible alongside the text.
 */
export default function ProjectSolutionMedia({ shot, title }: Props) {
  const { open } = useScreenshotLightbox()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      variants={shouldReduceMotion ? fadeUpReduced : fadeUp}
      className="mt-2 md:mt-4"
    >
      <button
        type="button"
        onClick={() => open(shot.key)}
        className="card no-hover-transform group relative block aspect-16/9 w-full overflow-hidden"
        aria-label={`View screenshot of ${title}`}
      >
        <Image
          src={shot.url}
          alt={`${title} — interface preview`}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        <div className="from-paper/90 via-paper/10 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <p className="text-muted mt-3 text-xs leading-relaxed">
        A glimpse of the interface —{' '}
        <button
          type="button"
          onClick={() => scrollToSection('screens')}
          className="text-ink decoration-accent/50 hover:decoration-accent hover:text-accent underline underline-offset-2 transition-colors"
        >
          view all screens
        </button>
        .
      </p>
    </motion.div>
  )
}
