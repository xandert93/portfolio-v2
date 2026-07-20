'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { FeaturedProjects } from '@/sanity/types'
import { genImageBuilder } from '@/sanity/lib/image'
import Section, { fadeUp } from '@/components/ui/Section'
import ArrowLink from '@/components/links/ArrowLink'

type Props = {
  projects: FeaturedProjects
}

export default function FeaturedProjectsSection({ projects }: Props) {
  return (
    <Section
      id="work"
      index="01"
      glyphSide="left"
      glowSide="right"
      glowVertical="top"
      eyebrow="Selected work"
      aside={<ArrowLink href="/projects" children="All Work" />}
      heading="Featured projects"
      lead="A few recent builds where design, performance and clean architecture had to work together."
    >
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <motion.div key={project._id} variants={fadeUp}>
            <ProjectCardLink project={project} />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function ProjectCardLink({ project }: { project: FeaturedProjects[number] }) {
  const {
    slug,
    title,
    category,
    media: { coverImage },
    content: { summary, technologies },
    date,
  } = project

  return (
    <Link
      href={`/projects/${slug}`}
      className="card group grid grid-cols-1 items-center gap-6 overflow-hidden p-4 md:grid-cols-[minmax(0,1fr)_1.1fr] md:gap-10 md:p-5"
    >
      {/* Thumbnail */}
      <div className="border-faint relative aspect-[16/10] overflow-hidden rounded-sm border">
        <Image
          src={genImageBuilder(coverImage).url() || '/placeholder.svg'}
          alt={title}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Copy */}
      <div className="flex flex-col items-center gap-4 text-center text-sm sm:gap-6 md:pr-6">
        <div className="text-muted flex items-center gap-3 tracking-[0.14em] uppercase">
          <span>{date.slice(0, 4)}</span>
          <span className="bg-faint h-px w-6" />
          <span className="text-accent">{category}</span>
        </div>

        <div className="relative flex items-start gap-2">
          <h3 className="text-ink font-serif text-2xl italic md:text-3xl">{title}</h3>
          <ArrowUpRight className="text-muted group-hover:text-accent absolute -right-6 h-5 w-5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <p className="text-muted max-w-md leading-relaxed font-light">{summary}</p>

        <div className="flex flex-wrap justify-center gap-2">
          {technologies.map(({ _id, name }) => (
            <span
              key={_id}
              className="border-faint text-accent-strong rounded-sm border px-3 py-1 text-xs tracking-widest uppercase"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
