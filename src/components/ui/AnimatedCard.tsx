'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp, fadeUpReduced } from '@/lib/motion'

type Props = {
  children: ReactNode
  className?: string
  /**
   * Fraction (or 'some'/'all') of the element that must be visible before
   * triggering — passed straight through to framer-motion's `viewport`.
   * Defaults to 0.2, same as always. Only override this for content whose
   * height varies a lot (e.g. long-form prose blocks) — see `viewportMargin`
   * for why a plain `amount` alone can misfire on very tall elements.
   */
  viewportAmount?: number | 'some' | 'all'
  /**
   * Shrinks/grows the viewport used for the intersection check (CSS
   * margin syntax, e.g. '0px 0px -25% 0px'). Combined with a low/'some'
   * `viewportAmount`, this is the safe way to delay a reveal — raising
   * `viewportAmount` alone can become mathematically unreachable for an
   * element taller than the viewport (the max possible intersection ratio
   * is capped by viewportHeight / elementHeight), leaving it stuck hidden.
   */
  viewportMargin?: string
}

/**
 * A single whileInView fade-up reveal, using the same shared variants as
 * every other scroll-triggered element on the site (see docs/motion.md).
 * Used to give a standalone block (e.g. the contact form's card) the same
 * entrance treatment as its siblings, without inventing a one-off variant.
 */
export default function AnimatedCard({
  children,
  className,
  viewportAmount = 0.2,
  viewportMargin,
}: Props) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? fadeUpReduced : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
