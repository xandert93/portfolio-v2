import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'

import { fetchProject } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
import { Section } from '@/components/ui/Section'
import AnimatedCard from '@/components/ui/AnimatedCard'
import { ROUTES } from '@/config/routes'
import { articleComponents, compactComponents } from './_components/portable-text'
import ScreenshotGallery, { type Shot } from './_components/ScreenshotGallery'

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
    ? genImageBuilder(coverImage).width(1600).height(900).fit('crop').auto('format').url()
    : null

  const shots: Shot[] = (screenshots ?? []).map((shot) => ({
    key: shot._key,
    url: genImageBuilder(shot).width(1200).height(750).fit('crop').auto('format').url(),
    full: genImageBuilder(shot).width(2000).auto('format').url(),
  }))

  /* Section index numerals are assigned in render order so the glyphs
     stay sequential no matter which optional blocks a project has. */
  let sectionIndex = 0
  const nextGlyph = () => ({ number: ++sectionIndex, side: 'right' as const })

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────── */}
      <Section
        glow={{ side: 'left', vertical: 'top' }}
        dot={false}
        header={{
          eyebrow: category,
          heading: title,
          lead: summary,
          aside: formattedDate ?? undefined,
        }}
      >
        <AnimatedCard className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={ROUTES.projects}
              className="text-muted hover:text-accent text-[0.65rem] tracking-widest uppercase transition-colors"
            >
              ← All projects
            </Link>

            {urls.live && (
              <span className="badge-open">
                <span className="bg-accent size-1.5 rounded-full" />
                Live
              </span>
            )}

            <div className="flex gap-3 sm:ml-auto">
              {urls.repo && (
                <a
                  href={urls.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-[0.65rem] tracking-widest uppercase"
                >
                  <svg viewBox="0 0 16 16" className="size-3.5 fill-current" aria-hidden>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
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
                  Visit site <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>

          {coverUrl && (
            <div className="border-faint relative overflow-hidden rounded-sm border">
              <img
                src={coverUrl}
                alt={title ?? ''}
                className="block aspect-video w-full object-cover"
              />
            </div>
          )}
        </AnimatedCard>
      </Section>

      {/* ── The problem ──────────────────────────────────────── */}
      {problem && (
        <Section
          glow={{ side: 'right', vertical: 'top' }}
          glyph={nextGlyph()}
          header={{ eyebrow: 'The problem', heading: 'What needed solving' }}
        >
          <AnimatedCard>
            <p className="text-ink max-w-2xl font-serif text-2xl leading-snug italic md:text-[1.75rem]">
              {problem}
            </p>
          </AnimatedCard>
        </Section>
      )}

      {/* ── Description ──────────────────────────────────────── */}
      {description && description.length > 0 && (
        <Section
          glow={{ side: 'left', vertical: 'bottom' }}
          glyph={nextGlyph()}
          header={{ eyebrow: 'About this project', heading: 'The build' }}
        >
          <AnimatedCard className="max-w-2xl">
            <PortableText value={description} components={articleComponents} />
          </AnimatedCard>
        </Section>
      )}

      {/* ── Key features ─────────────────────────────────────── */}
      {features && features.length > 0 && (
        <Section
          glow={{ side: 'right', vertical: 'top' }}
          glyph={nextGlyph()}
          header={{
            eyebrow: 'Key features',
            heading: 'What it does',
            aside: `${features.length} highlights`,
          }}
        >
          <AnimatedCard>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
              {features.map((feature, i) => (
                <li
                  key={`${feature}-${i}`}
                  className="border-faint text-ink/80 flex gap-4 border-b pb-4 text-[0.9375rem] leading-[1.7]"
                >
                  <span className="text-accent font-serif text-xs italic">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </AnimatedCard>
        </Section>
      )}

      {/* ── Technical challenges ─────────────────────────────── */}
      {challenges && challenges.length > 0 && (
        <Section
          glow={{ side: 'left', vertical: 'bottom' }}
          glyph={nextGlyph()}
          header={{
            eyebrow: 'Technical challenges',
            heading: 'The tricky parts',
          }}
        >
          <AnimatedCard className="card no-hover-transform max-w-2xl p-6 md:p-10">
            <PortableText value={challenges} components={compactComponents} />
          </AnimatedCard>
        </Section>
      )}

      {/* ── Screenshots ──────────────────────────────────────── */}
      {shots.length > 0 && (
        <Section
          glow={{ side: 'right', vertical: 'top' }}
          glyph={nextGlyph()}
          header={{
            eyebrow: 'Screens',
            heading: 'A look inside',
            lead: 'Click any screen to view it full size.',
          }}
        >
          <ScreenshotGallery shots={shots} title={title ?? ''} />
        </Section>
      )}

      {/* ── Stack + next ─────────────────────────────────────── */}
      <Section
        glow={{ side: 'center', vertical: 'bottom' }}
        glyph={nextGlyph()}
        header={{
          eyebrow: 'Built with',
          heading: 'The stack',
        }}
      >
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
      </Section>
    </>
  )
}
