import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { ArrowLeft, ArrowUpRight, GitBranch } from 'lucide-react'
import clsx from 'clsx'

import { fetchProject } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
import AnimatedCard from '@/components/ui/AnimatedCard'
import Badge from '@/components/ui/Badge'
import { ROUTES } from '@/config/routes'
import { articleComponents, compactComponents } from './_components/portable-text'
import ScreenshotGallery, { type Shot } from './_components/ScreenshotGallery'
import ProjectContentsRail, { type RailItem } from './_components/ProjectContentsRail'
import ProjectSection from './_components/ProjectSection'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) return { title: 'Project not found' }

  const description = project.content.summary ?? undefined

  const ogImage = project.media.coverImage
    ? genImageBuilder(project.media.coverImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .auto('format')
        .url()
    : undefined

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title ?? undefined,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    alternates: { canonical: `${ROUTES.projects}/${slug}` },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) notFound()

  const {
    title,
    category,
    content: { summary, problem, description, technologies, features, challenges },
    urls,
    media: { coverImage, screenshots },
    date,
  } = project

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null
  const year = date ? new Date(date).getFullYear() : null

  const coverUrl = coverImage
    ? genImageBuilder(coverImage)
        .width(2000)
        .height(1000)
        .fit('crop')
        .auto('format')
        .url()
    : null

  const shots: Shot[] = screenshots.map((shot) => ({
    key: shot._key,
    url: genImageBuilder(shot).width(1200).height(750).fit('crop').auto('format').url(),
    full: genImageBuilder(shot).width(2000).auto('format').url(),
  }))

  // The rail only lists blocks this project actually has, in the order
  // they appear — a real reading sequence, not decoration. Section indices
  // are derived from this list so the headers and the rail stay in sync.
  const railItems: RailItem[] = [
    problem && { id: 'problem', label: 'The problem' },
    description && description.length > 0 && { id: 'build', label: 'The build' },
    features && features.length > 0 && { id: 'features', label: 'Key features' },
    challenges &&
      challenges.length > 0 && { id: 'challenges', label: 'Technical challenges' },
    shots.length > 0 && { id: 'screens', label: 'Screens' },
  ].filter(Boolean) as RailItem[]

  const indexOf = (id: string) => railItems.findIndex((item) => item.id === id) + 1

  // Editorial spec strip — real, load-bearing facts, not decoration.
  const specs = [
    { label: 'Category', value: category },
    year && { label: 'Year', value: String(year) },
    technologies.length > 0 && {
      label: 'Stack',
      value: `${technologies.length} ${technologies.length === 1 ? 'tool' : 'tools'}`,
    },
    { label: 'Status', value: urls.live ? 'Live' : 'Case study' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────── */}
      <header className="relative">
        {coverUrl && (
          <div className="relative aspect-21/9 w-full overflow-hidden md:aspect-32/9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={title ?? ''}
              className="h-full w-full object-cover"
            />
            <div className="from-paper via-paper/50 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="from-paper/60 absolute inset-0 bg-gradient-to-r to-transparent" />
          </div>
        )}

        <div className="container">
          <AnimatedCard
            className={clsx(
              'relative z-10 flex flex-col gap-7',
              coverUrl ? 'pt-8 md:-mt-28 md:pt-0' : 'pt-16 md:pt-28',
            )}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={ROUTES.projects}
                className="text-muted hover:text-accent group inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.2em] uppercase transition-colors"
              >
                <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
                All projects
              </Link>
              {urls.live && (
                <Badge>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
                    <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
                  </span>
                  Live
                </Badge>
              )}
            </div>

            <h1 className="max-w-4xl font-serif text-4xl leading-[1.03] italic md:text-6xl lg:text-7xl">
              {title}
            </h1>

            {summary && (
              <p className="text-muted max-w-2xl text-lg leading-relaxed font-light text-pretty md:text-xl">
                {summary}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              {urls.live && (
                <a
                  href={urls.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-[0.65rem] tracking-widest uppercase"
                >
                  Visit site <ArrowUpRight className="size-3.5" />
                </a>
              )}
              {urls.repo && (
                <a
                  href={urls.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-[0.65rem] tracking-widest uppercase"
                >
                  <GitBranch className="size-3.5" />
                  View code
                </a>
              )}
            </div>

            {/* Spec strip */}
            <dl className="border-faint mt-3 flex flex-wrap gap-x-12 gap-y-6 border-t pt-7">
              {specs.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <dt className="text-muted text-[0.6rem] tracking-[0.18em] uppercase">
                    {label}
                  </dt>
                  <dd className="text-ink font-serif text-lg italic">{value}</dd>
                </div>
              ))}
            </dl>
          </AnimatedCard>
        </div>
      </header>

      {/* ── Body: sticky contents + flowing sections ──────────── */}
      <div className="border-faint container mt-16 border-t md:mt-24">
        <div
          className={clsx(
            'grid grid-cols-1 gap-x-14 gap-y-16 py-16 md:py-24',
            railItems.length > 0 && 'lg:grid-cols-[190px_1fr]',
          )}
        >
          {railItems.length > 0 && <ProjectContentsRail items={railItems} />}

          <div className="flex min-w-0 flex-col gap-24 md:gap-32">
            {problem && (
              <ProjectSection id="problem" index={indexOf('problem')} eyebrow="The problem">
                <figure className="max-w-3xl">
                  <span
                    aria-hidden
                    className="text-accent/25 block font-serif text-6xl leading-none italic md:text-7xl"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="text-ink -mt-4 font-serif text-2xl leading-snug italic md:text-[2rem]">
                    {problem}
                  </blockquote>
                </figure>
              </ProjectSection>
            )}

            {description && description.length > 0 && (
              <ProjectSection id="build" index={indexOf('build')} eyebrow="The build">
                <div
                  className={clsx(
                    'max-w-2xl',
                    '[&>*:first-child]:first-letter:text-accent',
                    '[&>*:first-child]:first-letter:mr-2',
                    '[&>*:first-child]:first-letter:float-left',
                    '[&>*:first-child]:first-letter:font-serif',
                    '[&>*:first-child]:first-letter:text-6xl',
                    '[&>*:first-child]:first-letter:leading-[0.8]',
                    '[&>*:first-child]:first-letter:italic',
                  )}
                >
                  <PortableText value={description} components={articleComponents} />
                </div>
              </ProjectSection>
            )}

            {features && features.length > 0 && (
              <ProjectSection
                id="features"
                index={indexOf('features')}
                eyebrow="Key features"
              >
                <ol className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                  {features.map((feature, i) => (
                    <li
                      key={`${feature}-${i}`}
                      className="border-faint text-ink/80 flex gap-4 border-b py-4 text-[0.9375rem] leading-[1.7]"
                    >
                      <span className="text-accent shrink-0 pt-0.5 font-serif text-sm leading-none italic">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ol>
              </ProjectSection>
            )}

            {challenges && challenges.length > 0 && (
              <ProjectSection
                id="challenges"
                index={indexOf('challenges')}
                eyebrow="Technical challenges"
              >
                <div className="card no-hover-transform max-w-2xl p-6 md:p-10">
                  <PortableText value={challenges} components={compactComponents} />
                </div>
              </ProjectSection>
            )}

            {shots.length > 0 && (
              <ProjectSection id="screens" index={indexOf('screens')} eyebrow="Screens">
                <p className="text-muted mb-7 max-w-md text-sm leading-relaxed">
                  A closer look at the interface. Click any screen to view it full size.
                </p>
                <ScreenshotGallery shots={shots} title={title ?? ''} />
              </ProjectSection>
            )}
          </div>
        </div>
      </div>

      {/* ── Stack + next ───────────────────────────────────────── */}
      <div className="bg-warm border-faint border-t">
        <div className="container py-16 md:py-24">
          <AnimatedCard className="flex flex-col gap-10">
            {technologies.length > 0 && (
              <div className="flex flex-col gap-5">
                <span className="text-muted text-[0.65rem] font-medium tracking-[0.2em] uppercase">
                  Built with
                </span>
                <div className="flex flex-wrap gap-2">
                  {technologies.map(({ _id, name }) => (
                    <span
                      key={_id}
                      className="border-faint text-accent-strong hover:border-accent/50 rounded-sm border px-3 py-1.5 text-[0.65rem] tracking-widest uppercase transition-colors"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-faint flex flex-wrap items-center justify-between gap-6 border-t pt-10">
              <p className="text-ink max-w-md font-serif text-2xl leading-snug italic text-balance">
                Like what you see? There&apos;s more where this came from.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={ROUTES.projects} className="btn btn-ghost">
                  All projects
                </Link>
                <Link href={ROUTES.contact} className="btn btn-primary">
                  Start a conversation <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </>
  )
}
