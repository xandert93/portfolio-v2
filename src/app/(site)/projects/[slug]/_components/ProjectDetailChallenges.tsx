'use client'

import { Project } from '@/sanity/types'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { Brain, StarCheck } from 'lucide-react'
import { PortableText } from '@portabletext/react'

import { fadeUp, fadeUpReduced } from '@/lib/motion'
import { compactComponents } from './portable-text'

type Props = {
  challenges: Project['content']['challenges']
}

type ChallengeItem = Project['content']['challenges'][number]

export default function ProjectDetailChallenges({ challenges }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const variants = shouldReduceMotion ? fadeUpReduced : fadeUp

  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-2xl text-base">
        The interesting part wasn&apos;t just building the features. It was figuring out
        how to make them work reliably, efficiently, and at a scale that wouldn&apos;t
        compromise the experience.
      </p>

      <div>
        {challenges.map(({ _key, problem, solution }, index) => (
          <motion.article
            key={_key}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            variants={variants}
            className={clsx(
              'grid gap-8 lg:grid-cols-2 lg:gap-12',
              'py-8',
              'border-b first:border-t last:border-b-0',
            )}
          >
            <Challenge problem={problem} num={index + 1} />
            <Solution solution={solution} />
          </motion.article>
        ))}
      </div>
    </div>
  )

  function Challenge({
    problem,
    num,
  }: {
    problem: ChallengeItem['problem']
    num: number
  }) {
    return (
      <div>
        <div className="text-muted mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase">
          <Brain className="size-4" />
          Challenge #{num}
        </div>

        <p className="font-serif text-xl font-medium tracking-tight">{problem}</p>
      </div>
    )
  }

  function Solution({ solution }: { solution: ChallengeItem['solution'] }) {
    return (
      <div className="relative">
        <div className="text-muted mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase">
          <StarCheck className="size-4" />
          Solution
        </div>

        <div className="leading-7">
          <PortableText value={solution} components={compactComponents} />
        </div>
      </div>
    )
  }
}
