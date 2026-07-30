'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Projects, Project } from '@/sanity/types'
import { genImageBuilder } from '@/sanity/lib/image'
import { Section } from '@/components/ui/Section'
import { ArrowLink } from '@/components/links/ArrowLink'
import { ROUTES } from '@/config/routes'
import { fadeUp } from '@/lib/motion'

type Props = {
  projects: Projects
}

export default function FeaturedProjectsSection({ projects }: Props) {
  return (
    <Section
      id="work"

      glyph={{
        number: 1,
        side: 'left',
      }}
      glow={{
        side: 'right',
        vertical: 'top',
      }}
      header={{
        eyebrow: 'Selected work',
        heading: 'Featured projects',
        lead: 'A few recent builds where design, performance and clean architecture had to work together.',
        // aside: <ArrowLink href={ROUTES.projects} children="All Work" />,
      }}
    >
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
          >
            <ProjectCardLink project={project} />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

type ProjectCardLinkProps = {
  project: Projects[number]
}

const ProjectCardLink = ({ project }: ProjectCardLinkProps) => {
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
      href={`${ROUTES.projects}/${slug}`}
      className="card group grid grid-cols-1 items-center gap-6 overflow-hidden p-4 md:grid-cols-[minmax(0,1fr)_1.1fr] md:gap-10 md:p-5"
    >
      <Thumbnail image={coverImage} alt={title} />

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

        <TechnologiesList technologies={technologies} />
      </div>
    </Link>
  )
}

type ThumbnailProps = {
  image: Project['media']['coverImage']
  alt: Project['title']
}

const Thumbnail = ({ image, alt }: ThumbnailProps) => {
  return (
    <div className="group relative aspect-16/10 overflow-hidden">
      <Image
        src={genImageBuilder(image).url()}
        alt={alt}
        fill
        sizes="(min-width: 768px) 40vw, 100vw"
        className="scale-98 rounded-sm object-cover transition-transform duration-700 ease-out group-hover:scale-100"
      />
    </div>
  )
}

type TechnologiesListProps = {
  technologies: Project['content']['technologies']
}

const TechnologiesList = ({ technologies }: TechnologiesListProps) => {
  return (
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
  )
}
