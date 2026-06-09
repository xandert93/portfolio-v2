import Link from 'next/link'
import { fetchProjects } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'

export default async function ProjectsPage() {
  const projects = await fetchProjects()

  const featuredProjects = projects.filter((p) => p.isFeatured)
  const otherProjects = projects.filter((p) => !p.isFeatured)

  return (
    <main className="max-w-7xl mx-auto px-12 py-16">
      <div className="mb-16">
        <p className="text-2xs tracking-widest uppercase text-muted mb-4">
          Portfolio
        </p>
        <h1 className="font-serif text-5xl text-ink mb-4">Work</h1>
        <p className="text-sm text-muted font-light max-w-md leading-relaxed">
          A selection of projects I've designed and built — from side
          experiments to production systems.
        </p>
      </div>

      {/* Featured */}
      {featuredProjects.length > 0 && (
        <section className="mb-20">
          <p className="text-2xs tracking-widest uppercase text-muted mb-8">
            Featured work
          </p>
          <div className="flex flex-col gap-px border border-faint bg-faint">
            {featuredProjects.map((project) => (
              <div
                key={project._id}
                className="grid grid-cols-2 bg-accent-light hover:bg-warm transition-colors group"
              >
                {project.coverImage ? (
                  <img
                    src={urlFor(project.coverImage)
                      .width(720)
                      .height(480)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={project.title ?? ''}
                    className="w-full h-full object-cover block"
                    style={{ minHeight: '320px' }}
                  />
                ) : (
                  <div
                    className="w-full bg-warm flex items-center justify-center"
                    style={{ minHeight: '320px' }}
                  >
                    <span className="text-2xs tracking-widest uppercase text-muted">
                      No image
                    </span>
                  </div>
                )}

                <div className="flex flex-col justify-center p-12">
                  <p className="text-2xs tracking-widest uppercase text-muted mb-6">
                    Featured
                  </p>

                  <Link
                    href={`/projects/${project.slug?.current}`}
                    className="font-serif text-4xl text-ink mb-4 group-hover:text-accent transition-colors leading-tight"
                  >
                    {project.title}
                  </Link>

                  <p className="text-sm text-muted leading-relaxed font-light mb-8">
                    {project.summary}
                  </p>

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-8">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech._id}
                          className="text-2xs px-2.5 py-1 bg-paper border border-faint rounded-full text-muted"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-6">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
                      >
                        Repository ↗
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
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
      )}

      {/* All projects */}
      {otherProjects.length > 0 && (
        <section>
          <p className="text-2xs tracking-widest uppercase text-muted mb-8">
            All projects
          </p>
          <div className="grid grid-cols-2 gap-6">
            {otherProjects.map((project, i) => (
              <div
                key={project._id}
                className="group overflow-hidden border border-faint bg-paper hover:bg-warm transition-colors"
              >
                {project.coverImage ? (
                  <img
                    src={urlFor(project.coverImage)
                      .width(720)
                      .height(405)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={project.title ?? ''}
                    className="w-full aspect-video object-cover block"
                  />
                ) : (
                  <div className="w-full aspect-video bg-warm flex items-center justify-center">
                    <span className="text-2xs tracking-widest uppercase text-muted">
                      No image
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <p className="text-2xs tracking-widest uppercase text-muted mb-5">
                    Project {String(i + 1).padStart(2, '0')}
                  </p>

                  <Link
                    href={`/projects/${project.slug?.current}`}
                    className="font-serif text-2xl text-ink block mb-3 group-hover:text-accent transition-colors"
                  >
                    {project.title}
                  </Link>

                  <p className="text-sm text-muted leading-relaxed mb-5 font-light">
                    {project.summary}
                  </p>

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech._id}
                          className="text-2xs px-2.5 py-1 bg-warm border border-faint rounded-full text-muted"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-6">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
                      >
                        Repository ↗
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
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
      )}
    </main>
  )
}
