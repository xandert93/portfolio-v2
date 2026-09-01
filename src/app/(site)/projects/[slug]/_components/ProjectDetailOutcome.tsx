'use client'

import { PortableText } from '@portabletext/react'
import { motion, useReducedMotion } from 'framer-motion'
import { Key } from 'lucide-react'

import Callout from '@/components/ui/Callout'
import { fadeUpStagger, fadeUpStaggerReduced } from '@/lib/motion'
import { Project } from '@/sanity/types'
import { compactComponents } from './portable-text'

type Outcome = NonNullable<Project['content']['outcome']>

type ProjectDetailOutcomeProps = {
  outcome: Outcome
}

const GRID_COLUMNS = 3

export default function ProjectDetailOutcome({ outcome }: ProjectDetailOutcomeProps) {
  const { summary, metrics, learnings } = outcome
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="space-y-10">
      {/* Result — the headline read of how the project landed. */}
      <div className="text-[0.9375rem] leading-[1.7]">
        <PortableText value={summary} components={compactComponents} />
      </div>

      {/* Metrics — quantifiable proof points, scanned before they're read. */}
      {metrics && metrics.length > 0 && (
        <dl className="border-faint grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 sm:grid-cols-3">
          {metrics.map((metric, i) => {
            const delay = (i % GRID_COLUMNS) * 0.08
            const variants = shouldReduceMotion
              ? fadeUpStaggerReduced(delay)
              : fadeUpStagger(delay)

            return (
              <motion.div
                key={metric._key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.7 }}
                variants={variants}
              >
                <dd className="text-accent font-serif text-2xl leading-none italic md:text-3xl">
                  {metric.value}
                </dd>
                <dt className="text-muted text-2xs mt-2.5 tracking-[0.15em] uppercase">
                  {metric.label}
                </dt>
              </motion.div>
            )
          })}
        </dl>
      )}

      {/* Learnings — reflection, set apart as a callout rather than more body copy. */}
      {learnings && learnings.length > 0 && (
        <Callout>
          <h4 className="text-muted mb-3 inline-flex items-center gap-2 font-sans text-xs font-medium tracking-[0.2em] uppercase">
            <Key className="size-4" />
            What I learned
          </h4>

          <PortableText value={learnings} components={compactComponents} />
        </Callout>
      )}
    </div>
  )
}
