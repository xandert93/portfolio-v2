import Link from 'next/link'
import Image from 'next/image'

import { fetchProjects } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'

export default async function ProjectsPage() {
  const projects = await fetchProjects()

  const featuredProjects = projects.filter((p) => p.isFeatured)
  const otherProjects = projects.filter((p) => !p.isFeatured)

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Hero */}
      <section className="mb-20">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Portfolio
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Selected projects and product experiences.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          A collection of applications, experiments, and production systems I've
          designed and built.
        </p>
      </section>

      {/* Featured */}
      {featuredProjects.length > 0 && (
        <section className="mb-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Work</h2>
          </div>

          <div className="space-y-12">
            {featuredProjects.map((project) => (
              <article
                key={project._id}
                className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Link href={`/projects/${project.slug?.current}`}>
                  <div className="grid lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                      {project.coverImage && (
                        <img
                          src={urlFor(project.coverImage).auto('format').url()}
                          alt={project.title ?? ''}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      {project.date && (
                        <p className="mb-4 text-sm text-zinc-500">
                          {new Date(project.date).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      )}

                      <h3 className="mb-4 text-3xl font-bold">
                        {project.title}
                      </h3>

                      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                        {project.summary}
                      </p>

                      <div className="mb-8 flex flex-wrap gap-2">
                        {project.techStack?.map((tech) => (
                          <span
                            key={tech._id}
                            className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        {project.liveUrl && (
                          <span className="font-medium text-blue-600">
                            View Project →
                          </span>
                        )}

                        {project.repoUrl && (
                          <span className="font-medium text-zinc-500">
                            Source Code
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Grid */}
      <section>
        <h2 className="mb-8 text-2xl font-semibold">All Projects</h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {otherProjects.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug?.current}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                {project.coverImage && (
                  <img
                    // src={project.coverImage}
                    // alt={project.title}
                    // fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{project.title}</h3>

                  {project.date && (
                    <span className="text-sm text-zinc-500">
                      {new Date(project.date).getFullYear()}
                    </span>
                  )}
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.summary}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 4).map((tech) => (
                    <span
                      key={tech._id}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-600">
                    View case study
                  </span>

                  <div className="flex gap-3 text-sm text-zinc-500">
                    {project.liveUrl && <span>Live</span>}
                    {project.repoUrl && <span>Code</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
