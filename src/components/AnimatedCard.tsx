'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp, fadeUpReduced } from '@/lib/motion'

type Props = {
  children: ReactNode
  className?: string
}

/**
 * A single whileInView fade-up reveal, using the same shared variants as
 * every other scroll-triggered element on the site (see docs/motion.md).
 * Used to give a standalone block (e.g. the contact form's card) the same
 * entrance treatment as its siblings, without inventing a one-off variant.
 */
export default function AnimatedCard({ children, className }: Props) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={shouldReduceMotion ? fadeUpReduced : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
