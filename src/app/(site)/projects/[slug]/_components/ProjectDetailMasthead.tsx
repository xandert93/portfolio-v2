'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, FolderGit2 } from 'lucide-react'
import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'

import AnimatedCard from '@/components/ui/AnimatedCard'
import Button from '@/components/ui/Button'
import ExternalLink from '@/components/links/ExternalLink'
import StatusDot from '@/components/ui/StatusDot'
import { fadeUpStagger, fadeUpStaggerReduced } from '@/lib/motion'
import { ROUTES } from '@/config/routes'
import { Project } from '@/sanity/types'

type ProjectDetailMastheadProps = {
  title: string
  category: string
  formattedDate: string
  summary?: string | null
  technologies: Project['content']['technologies']
  urls: Project['urls']
  coverUrl: string | null
}

/* 📚 "Hero" or "Masthead"?

- Hero for marketing/landing-page — visually bold, often full-bleed, meant to sell or excite.
- Masthead for editorial/content — still prominent, but more about identifying "what page/article/publication is this" (title, byline, category, date) than persuading you to do something.
*/

export default function ProjectDetailMasthead({
  title,
  category,
  formattedDate,
  summary,
  technologies,
  urls,
  coverUrl,
}: ProjectDetailMastheadProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <header className="relative">
      {coverUrl && (
        <div className="relative aspect-21/9 w-full overflow-hidden md:aspect-32/9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
          <div className="from-paper via-paper/50 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="from-paper/60 absolute inset-0 bg-linear-to-r to-transparent" />
        </div>
      )}

      <div className="relative overflow-x-clip">
        <div aria-hidden className="section-glow -left-40 top-0" />

        <div className="container">
          <AnimatedCard
            className={clsx(
              'relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 md:gap-8',
              coverUrl ? 'pt-8 md:-mt-28 md:pt-0' : 'pt-16 md:pt-28',
            )}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={ROUTES.projects}
                className="text-muted hover:text-accent group text-2xs inline-flex items-center gap-1.5 tracking-[0.2em] uppercase transition-colors"
              >
                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
                All projects
              </Link>
            </div>

            <h1 className="font-serif text-4xl leading-[1.03] italic md:text-6xl lg:text-7xl">
              {title}
            </h1>

            {/* Meta line — category, date and stack, all already fetched. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-accent text-2xs font-medium tracking-[0.2em] uppercase">
                {category}
              </span>

              <span aria-hidden className="bg-faint h-3 w-px" />

              <span className="text-muted text-2xs tracking-[0.2em] uppercase">
                {formattedDate}
              </span>
            </div>

            {summary && (
              <p className="text-muted max-w-2xl text-base leading-relaxed font-light text-pretty md:text-lg">
                {summary}
              </p>
            )}

            <div className="flex flex-wrap gap-2.5">
              {technologies.map((tech, i) => {
                const delay = i * 0.06
                const variants = shouldReduceMotion
                  ? fadeUpStaggerReduced(delay)
                  : fadeUpStagger(delay)

                return (
                  <motion.span
                    key={tech._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.7 }}
                    variants={variants}
                    className="border-faint bg-accent-light text-accent-strong text-2xs inline-block min-w-[12ch] rounded border px-3 py-2 text-center tracking-widest uppercase"
                  >
                    {tech.name}
                  </motion.span>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 sm:max-w-100 md:gap-4">
              {urls.repo && (
                <Button as={ExternalLink} variant="primary" href={urls.repo}>
                  <FolderGit2 className="size-3.5" />
                  View code
                </Button>
              )}

              {urls.live && (
                <Button as={ExternalLink} variant="ghost" href={urls.live}>
                  <StatusDot />
                  Visit site <ArrowUpRight className="size-3.5" />
                </Button>
              )}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </header>
  )
}
