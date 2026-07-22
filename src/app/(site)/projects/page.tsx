import Link from 'next/link'
import { fetchFeaturedProjects, fetchPaginatedProjects } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
import Pagination from '@/components/Pagination'
import { ROUTES } from '@/config/routes'

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1

  const [featuredProjects, { projects: otherProjects, totalPages }] = await Promise.all([
    fetchFeaturedProjects(),
    fetchPaginatedProjects(currentPage),
  ])

  const isEmpty = featuredProjects.length === 0 && otherProjects.length === 0

  return (
    <main className="pb-24 md:pb-32">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="container">
        <div className="pt-10 pb-4 md:pt-16 md:pb-6">
          <p className="eyebrow animate-fade-up">Portfolio</p>
          <h1
            className="text-ink animate-fade-up mt-3 font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
            style={{ animationDelay: '80ms' }}
          >
            Work
          </h1>
          <p
            className="text-muted animate-fade-up mt-6 max-w-md text-base leading-relaxed font-light md:text-lg"
            style={{ animationDelay: '140ms' }}
          >
            A selection of projects I've designed and built — from side experiments to
            production systems.
          </p>
        </div>
      </div>

      {isEmpty && (
        <div className="container">
          <div className="section text-center">
            <p className="eyebrow justify-center">Nothing here yet</p>
            <p className="text-muted mt-2 text-sm">
              New work is in progress — check back soon.
            </p>
          </div>
        </div>
      )}

      {/* ── Featured ─────────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <div className="container">
          <section className="section">
            <p className="eyebrow">Featured work</p>

            <div className="bg-faint border-faint flex flex-col gap-px overflow-hidden rounded-xl border">
              {featuredProjects.map((project, i) => (
                <div
                  key={project._id}
                  className="bg-accent-light hover:bg-warm group animate-fade-up grid grid-cols-1 transition-colors md:grid-cols-2"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="order-1 overflow-hidden md:order-0">
                    {project.media.coverImage ? (
                      <img
                        src={genImageBuilder(project.media.coverImage)
                          .width(720)
                          .height(480)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={project.title ?? ''}
                        className="block aspect-4/3 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] md:aspect-auto"
                        style={{ minHeight: '260px' }}
                      />
                    ) : (
                      <div
                        className="bg-warm flex aspect-4/3 h-full w-full items-center justify-center md:aspect-auto"
                        style={{ minHeight: '260px' }}
                      >
                        <span className="text-2xs text-muted tracking-widest uppercase">
                          No image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <span className="badge-open mb-6 self-start">
                      <span className="bg-accent animate-pulse-dot size-1.5 rounded-full" />
                      Featured
                    </span>

                    <Link
                      href={`${ROUTES.projects}/${project.slug}`}
                      className="text-ink group-hover:text-accent mb-4 font-serif text-3xl leading-tight transition-colors md:text-4xl"
                    >
                      {project.title}
                    </Link>

                    <p className="text-muted mb-8 text-sm leading-relaxed font-light">
                      {project.content.summary}
                    </p>

                    {project.content.technologies &&
                      project.content.technologies.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                          {project.content.technologies.map((tech) => (
                            <span
                              key={tech._id}
                              className="text-2xs bg-paper border-faint text-muted rounded-full border px-2.5 py-1"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      )}

                    <div className="flex flex-wrap gap-6">
                      {project.urls.repo && (
                        <a
                          href={project.urls.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xs text-muted hover:text-accent tracking-widest uppercase transition-colors"
                        >
                          Repository ↗
                        </a>
                      )}
                      {project.urls.live && (
                        <a
                          href={project.urls.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xs text-muted hover:text-accent tracking-widest uppercase transition-colors"
                        >
                          Live site ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── All projects ─────────────────────────────────────── */}
      {otherProjects.length > 0 && (
        <div className="container">
          <section id="all-projects" className="section">
            <p className="eyebrow">All projects</p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {otherProjects.map((project, i) => (
                <div
                  key={project._id}
                  className="card group animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="relative overflow-hidden">
                    {project.media.coverImage ? (
                      <img
                        src={genImageBuilder(project.media.coverImage)
                          .width(720)
                          .height(405)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={project.title ?? ''}
                        className="block aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="bg-warm flex aspect-video w-full items-center justify-center">
                        <span className="text-2xs text-muted tracking-widest uppercase">
                          No image
                        </span>
                      </div>
                    )}
                    <span className="text-2xs text-ink bg-paper/70 absolute top-3 left-3 rounded px-2.5 py-1 tracking-widest uppercase backdrop-blur">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-6 md:p-8">
                    <Link
                      href={`${ROUTES.projects}/${project.slug}`}
                      className="text-ink group-hover:text-accent mb-3 block font-serif text-2xl leading-snug transition-colors"
                    >
                      {project.title}
                    </Link>

                    <p className="text-muted mb-5 text-sm leading-relaxed font-light">
                      {project.content.summary}
                    </p>

                    {project.content.technologies &&
                      project.content.technologies.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-2">
                          {project.content.technologies.map((tech) => (
                            <span
                              key={tech._id}
                              className="text-2xs bg-warm border-faint text-muted rounded-full border px-2.5 py-1"
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      )}

                    <div className="flex flex-wrap gap-6">
                      {project.urls.repo && (
                        <a
                          href={project.urls.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xs text-muted hover:text-accent tracking-widest uppercase transition-colors"
                        >
                          Repository ↗
                        </a>
                      )}
                      {project.urls.live && (
                        <a
                          href={project.urls.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xs text-muted hover:text-accent tracking-widest uppercase transition-colors"
                        >
                          Live site ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={ROUTES.projects}
                hash="all-projects"
              />
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
