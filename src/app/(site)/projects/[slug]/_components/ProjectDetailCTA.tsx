'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import type { SiteSettings } from '@/sanity/types'
import { ROUTES } from '@/config/routes'

import Button from '@/components/ui/Button'
import Eyebrow from '@/components/typography/Eyebrow'
import OpenToWorkBadge from '@/components/site/OpenToWorkBadge'
import SocialLinks from '@/components/site/SocialLinks'
import { containerVariants, fadeUp, fadeUpReduced } from '@/lib/motion'

type Props = {
  isOpenToWork: boolean
  socialUrls?: NonNullable<SiteSettings>['socialUrls']
}

export default function ProjectDetailCTA({ isOpenToWork, socialUrls }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const itemVariants = shouldReduceMotion ? fadeUpReduced : fadeUp

  return (
    <div className="bg-warm border-faint relative overflow-hidden border-t">
      <div
        aria-hidden
        className="section-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="relative z-10 container py-20 md:py-32"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <motion.div variants={itemVariants}>
            <OpenToWorkBadge isOpenToWork={isOpenToWork} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Eyebrow className="justify-center">What&apos;s next</Eyebrow>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-ink font-serif text-3xl leading-tight text-balance italic md:text-5xl"
          >
            Like what you see? There&apos;s{' '}
            <span className="text-accent">more</span> where that came from.
          </motion.p>

          <motion.blockquote
            variants={itemVariants}
            className="border-accent/40 text-muted max-w-md border-l pl-5 text-left font-serif text-sm leading-relaxed italic sm:text-base"
          >
            Every build starts as a rough idea and a two-line email — send yours over and
            let&apos;s see where it goes.
          </motion.blockquote>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="ghost" as={Link} href={ROUTES.projects}>
              All projects
            </Button>
            <Button variant="primary" as={Link} href={ROUTES.contact}>
              Start a conversation <ArrowRight className="size-3.5" />
            </Button>
          </motion.div>

          {socialUrls && (
            <motion.div
              variants={itemVariants}
              className="border-faint mt-2 flex flex-wrap items-center justify-center gap-8 border-t pt-8"
            >
              <Eyebrow className="basis-full justify-center">Elsewhere</Eyebrow>
              <SocialLinks urls={socialUrls} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
