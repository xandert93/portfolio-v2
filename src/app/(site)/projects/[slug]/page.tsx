import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import clsx from 'clsx'

import { fetchProject, fetchSiteSettings, fetchAbout } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
import { articleComponents, compactComponents } from './_components/portable-text'
import ScreenshotGallery from './_components/ScreenshotGallery'
import ScreenshotLightboxProvider, { type Shot } from './_components/ScreenshotLightbox'
import ProjectSolutionMedia from './_components/ProjectSolutionMedia'

import ProjectContentsRail from './_components/ProjectContentsRail'
import ProjectSection from './_components/ProjectSection'
import ProjectDetailFeature from './_components/ProjectDetailFeature'
import ProjectDetailChallenges from './_components/ProjectDetailChallenges'
import ProjectDetailMasthead from './_components/ProjectDetailMasthead'
import ProjectDetailOutcome from './_components/ProjectDetailOutcome'
import { hasOutcome } from './_components/hasOutcome'
import ProjectDetailCTA from './_components/ProjectDetailCTA'

import { buildRailItems } from './_components/buildRailItems'
import { ROUTES } from '@/config/routes'

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
      title: project.title,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    alternates: { canonical: `${ROUTES.projects}/${slug}` },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [project, settings, about] = await Promise.all([
    fetchProject(slug),
    fetchSiteSettings(),
    fetchAbout(),
  ])

  if (!project) notFound()

  const {
    title,
    category,
    content: {
      summary,
      problem,
      solution,
      role,
      features,
      technicalDecisions,
      challenges,
      outcome,
      technologies,
    },
    urls,
    media: { coverImage, screenshots },
    date,
  } = project

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

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
    url: genImageBuilder(shot.image)
      .width(1200)
      .height(750)
      .fit('crop')
      .auto('format')
      .url(),
    full: genImageBuilder(shot.image).width(2000).auto('format').url(),
    title: shot.title,
    description: shot.description,
  }))

  // The first shot also gets pulled up as a breather right after "The
  // solution", but still appears here too so the Screens section is a
  // complete set of every screenshot on the project.
  const galleryShots = shots

  // `feature.image` is optional and only appears in Studio content once
  // it's set — build a URL when present, undefined otherwise, so
  // ProjectDetailFeature can fall back to its icon-only layout.
  const featuresWithImages = features.map((feature) => {
    const featureImage = (feature as { image?: unknown }).image
    return {
      ...feature,
      imageUrl: featureImage
        ? genImageBuilder(featureImage as Parameters<typeof genImageBuilder>[0])
            .width(900)
            .height(560)
            .fit('crop')
            .auto('format')
            .url()
        : undefined,
    }
  })

  const hasAnyFeatureImages = featuresWithImages.some((feature) => feature.imageUrl)

  const showOutcome = hasOutcome(outcome)

  const railItems = buildRailItems({
    problem,
    solution,
    role,
    features,
    technicalDecisions,
    challenges,
    hasScreenshots: shots.length > 0,
    hasOutcome: showOutcome,
  })

  const indexOf = (id: string) => railItems.findIndex((item) => item.id === id) + 1

  return (
    <>
      <ProjectDetailMasthead
        title={title}
        category={category}
        formattedDate={formattedDate}
        summary={summary}
        technologies={technologies}
        urls={urls}
        coverUrl={coverUrl}
      />

      {/* ── Body: sticky contents + flowing sections ──────────── */}
      <div className="relative overflow-x-clip">
        <div aria-hidden className="section-glow top-0 -right-40" />
        <div aria-hidden className="section-glow bottom-0 -left-40" />

        <div className="container">
          <div className="border-faint text-ink/80 mx-auto mt-14 max-w-4xl border-t md:mt-20">
            <div
              className={clsx(
                'relative z-10 grid grid-cols-1 gap-x-12 gap-y-16 py-16 md:py-24',
                railItems.length > 0 && 'lg:grid-cols-[200px_1fr]',
              )}
            >
              {railItems.length > 0 && <ProjectContentsRail items={railItems} />}

              <ScreenshotLightboxProvider shots={shots} title={title}>
                <div className="flex min-w-0 flex-col gap-16 md:gap-20">
                  {problem && (
                    <ProjectSection
                      id="problem"
                      index={indexOf('problem')}
                      eyebrow="The problem"
                    >
                      <span
                        aria-hidden
                        className="text-accent/25 block font-serif text-6xl leading-none italic md:text-7xl"
                      >
                        &ldquo;
                      </span>
                      <blockquote className="text-ink border-accent/40 -mt-4 space-y-4 border-l-2 pl-6 font-serif text-lg leading-snug italic md:text-xl">
                        <PortableText value={problem} />
                      </blockquote>
                    </ProjectSection>
                  )}

                  {solution && (
                    <ProjectSection
                      id="solution"
                      index={indexOf('solution')}
                      eyebrow="The solution"
                    >
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
                        <PortableText value={solution} components={articleComponents} />
                      </div>

                      {shots.length > 0 && (
                        <ProjectSolutionMedia shot={shots[0]} title={title} />
                      )}
                    </ProjectSection>
                  )}

                  {role && (
                    <ProjectSection id="role" index={indexOf('role')} eyebrow="My role">
                      <div className="text-[0.9375rem] leading-[1.7]">
                        <PortableText value={role} components={compactComponents} />
                      </div>
                    </ProjectSection>
                  )}

                  {features.length > 0 && (
                    <div className="relative">
                      <div
                        aria-hidden
                        className="section-glow top-0 left-1/2 -translate-x-1/2"
                      />

                      <ProjectSection
                        id="features"
                        index={indexOf('features')}
                        eyebrow="Key features"
                      >
                        <div
                          className={clsx(
                            'grid grid-cols-1 sm:grid-cols-2',
                            'sm:*:odd:border-r sm:*:odd:pl-0 sm:*:even:pr-0',
                            '*:py-8 *:pl-0 sm:*:p-8',
                            'max-sm:*:first:pt-0 max-sm:*:last:pb-0',
                          )}
                        >
                          {featuresWithImages.map((feature, i) => {
                            const count = featuresWithImages.length

                            const isNotLast = i !== count - 1
                            // start index of the final row in a 2-col grid
                            const lastRowStart = count % 2 === 0 ? count - 2 : count - 1
                            const isOnLastRow = i >= lastRowStart

                            return (
                              <ProjectDetailFeature
                                key={feature._key + i}
                                feature={feature}
                                imageUrl={feature.imageUrl}
                                hasAnyFeatureImages={hasAnyFeatureImages}
                                index={i}
                                className={clsx(
                                  isOnLastRow && 'sm:border-b-0', // sm+: remove bottom divider on the last row
                                  isNotLast && 'border-b', // mobile: divider under every item but the last
                                )}
                              />
                            )
                          })}
                        </div>
                      </ProjectSection>
                    </div>
                  )}

                  {technicalDecisions && (
                    <ProjectSection
                      id="technical-decisions"
                      index={indexOf('technical-decisions')}
                      eyebrow="Technical decisions"
                    >
                      <PortableText
                        value={technicalDecisions}
                        components={articleComponents}
                      />
                    </ProjectSection>
                  )}

                  {challenges.length > 0 && (
                    <div className="relative">
                      <div aria-hidden className="section-glow top-0 -left-40" />

                      <ProjectSection
                        id="challenges"
                        index={indexOf('challenges')}
                        eyebrow="Challenges & solutions"
                      >
                        <ProjectDetailChallenges challenges={challenges} />
                      </ProjectSection>
                    </div>
                  )}

                  {shots.length > 0 && (
                    <div className="relative">
                      <div aria-hidden className="section-glow top-0 -right-40" />

                      <ProjectSection
                        id="screens"
                        index={indexOf('screens')}
                        eyebrow="Screens"
                      >
                        <ScreenshotGallery
                          shots={galleryShots}
                          title={title}
                          intro="A closer look at the interface. Click any screen to view it full size."
                        />
                      </ProjectSection>
                    </div>
                  )}

                  {showOutcome && (
                    <ProjectSection
                      id="outcome"
                      index={indexOf('outcome')}
                      eyebrow="Outcome"
                    >
                      <ProjectDetailOutcome outcome={outcome!} />
                    </ProjectSection>
                  )}
                </div>
              </ScreenshotLightboxProvider>
            </div>
          </div>
        </div>
      </div>

      <ProjectDetailCTA
        isOpenToWork={about?.isOpenToWork ?? false}
        socialUrls={settings?.socialUrls}
      />
    </>
  )
}
