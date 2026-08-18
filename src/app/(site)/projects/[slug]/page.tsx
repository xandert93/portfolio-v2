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
  // they appear — a real reading sequence, not decoration.
  const railItems: RailItem[] = [
    problem && { id: 'problem', label: 'The problem' },
    description && description.length > 0 && { id: 'build', label: 'The build' },
    features && features.length > 0 && { id: 'features', label: 'Key features' },
    challenges &&
      challenges.length > 0 && { id: 'challenges', label: 'Technical challenges' },
    shots.length > 0 && { id: 'screens', label: 'Screens' },
  ].filter(Boolean) as RailItem[]

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
            <div className="from-paper via-paper/40 absolute inset-0 bg-gradient-to-t to-transparent" />
          </div>
        )}

        <div className="container">
          <AnimatedCard
            className={clsx(
              'relative z-10 flex flex-col gap-6',
              coverUrl ? 'pt-8 md:-mt-20 md:pt-0' : 'pt-16 md:pt-24',
            )}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={ROUTES.projects}
                className="text-muted hover:text-accent inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase transition-colors"
              >
                <ArrowLeft className="size-3" />
                All projects
              </Link>
              <span className="text-accent-strong text-[0.65rem] tracking-[0.16em] uppercase">
                {category}
              </span>
              {formattedDate && (
                <span className="text-muted text-[0.65rem] tracking-[0.16em] uppercase">
                  {formattedDate}
                </span>
              )}
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

            <h1 className="max-w-3xl font-serif text-4xl leading-[1.05] italic md:text-6xl">
              {title}
            </h1>

            {summary && (
              <p className="text-muted max-w-xl text-base leading-relaxed font-light md:text-lg">
                {summary}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {urls.repo && (
                <a
                  href={urls.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-[0.65rem] tracking-widest uppercase"
                >
                  <GitBranch className="size-3.5" />
                  Code
                </a>
              )}
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
            </div>
          </AnimatedCard>
        </div>
      </header>

      {/* ── Body: sticky contents + flowing sections ──────────── */}
      <div className="border-faint container border-t">
        <div
          className={clsx(
            'grid grid-cols-1 gap-x-12 gap-y-16 py-16 md:py-24',
            railItems.length > 0 && 'lg:grid-cols-[180px_1fr]',
          )}
        >
          {railItems.length > 0 && <ProjectContentsRail items={railItems} />}

          <div className="flex flex-col gap-20 md:gap-28">
            {problem && (
              <div id="problem" className="scroll-mt-32">
                <AnimatedCard>
                  <p className="text-ink max-w-2xl font-serif text-2xl leading-snug italic md:text-[1.85rem]">
                    “{problem}”
                  </p>
                </AnimatedCard>
              </div>
            )}

            {description && description.length > 0 && (
              <div id="build" className="scroll-mt-32">
                <AnimatedCard className="max-w-2xl">
                  <div
                    className={clsx(
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
                </AnimatedCard>
              </div>
            )}

            {features && features.length > 0 && (
              <div id="features" className="scroll-mt-32">
                <AnimatedCard>
                  <ul className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                    {features.map((feature, i) => (
                      <li
                        key={`${feature}-${i}`}
                        className="border-faint text-ink/80 flex gap-3 border-b pb-4 text-[0.9375rem] leading-[1.7]"
                      >
                        <span className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedCard>
              </div>
            )}

            {challenges && challenges.length > 0 && (
              <div id="challenges" className="scroll-mt-32">
                <AnimatedCard>
                  <div className="card no-hover-transform max-w-2xl p-6 md:p-10">
                    <PortableText value={challenges} components={compactComponents} />
                  </div>
                </AnimatedCard>
              </div>
            )}

            {shots.length > 0 && (
              <div id="screens" className="scroll-mt-32">
                <p className="text-muted mb-6 text-sm">
                  Click any screen to view it full size.
                </p>
                <ScreenshotGallery shots={shots} title={title ?? ''} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stack + next ───────────────────────────────────────── */}
      <div className="bg-warm border-faint border-t">
        <div className="container py-16 md:py-24">
          <AnimatedCard className="flex flex-col gap-10">
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map(({ _id, name }) => (
                  <span
                    key={_id}
                    className="border-faint text-accent-strong rounded-sm border px-3 py-1.5 text-[0.65rem] tracking-widest uppercase"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}

            <div className="border-faint flex flex-wrap items-center justify-between gap-6 border-t pt-8">
              <p className="text-muted max-w-sm font-serif text-xl italic">
                Like what you see? There&apos;s more where this came from.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={ROUTES.projects} className="btn btn-ghost">
                  All projects
                </Link>
                <Link href={ROUTES.contact} className="btn btn-primary">
                  Start a conversation <span aria-hidden>↗</span>
                </Link>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </>
  )
}
