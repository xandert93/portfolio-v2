import Link from 'next/link'
import {
  fetchSiteSettings,
  fetchFeaturedProjects,
  fetchAbout,
  fetchSkills,
  fetchTestimonials,
} from '@/sanity/lib/fetch'

export default async function Home() {
  const [settings, featuredProjects, about, skills, testimonials] =
    await Promise.all([
      fetchSiteSettings(),
      fetchFeaturedProjects(),
      fetchAbout(),
      fetchSkills(),
      fetchTestimonials(),
    ])

  return (
    <main className="bg-paper text-ink font-sans min-h-screen">
      {/* Hero */}
      <div className="grid grid-cols-2 min-h-[88vh]">
        <div className="flex flex-col justify-center px-12 py-20 border-r border-faint">
          {about.isOpenToWork && (
            <div className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase bg-green-badge-bg text-green-badge px-4 py-1.5 rounded-full w-fit mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-badge animate-pulse" />
              Open to work
            </div>
          )}
          <h1 className="font-serif text-6xl leading-[1.05] mb-6">
            Full-stack
            <br />
            <em className="text-accent">developer</em>
            <br />
            based in London
          </h1>
          <p className="text-sm text-muted leading-relaxed max-w-sm mb-10 font-light">
            {settings.tagline}
          </p>
          <div className="flex gap-3">
            <Link
              href="/projects"
              className="text-2xs tracking-widest uppercase px-7 py-3 bg-ink text-paper rounded hover:opacity-80 transition-opacity"
            >
              View my work
            </Link>
            <a
              href={`mailto:${settings.email}`}
              className="text-2xs tracking-widest uppercase px-7 py-3 border border-faint text-ink rounded hover:bg-warm transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-end px-12 py-20 bg-warm">
          <p className="text-2xs tracking-widest uppercase text-muted mb-4">
            Selected technologies
          </p>
          <div className="grid grid-cols-2 gap-2">
            {skills.slice(0, 8).map((skill) => (
              <span
                key={skill._id}
                className="text-sm px-3 py-2.5 bg-paper border border-faint rounded-md text-ink font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <section className="px-12 py-20 border-t border-faint">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-serif text-4xl">Featured work</h2>
          <Link
            href="/projects"
            className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            All projects →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-px bg-faint border border-faint">
          {featuredProjects.map((project, i) => (
            <div
              key={project._id}
              className="bg-paper p-8 hover:bg-warm transition-colors group"
            >
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
                      className="text-2xs px-2.5 py-1 bg-accent-light rounded-full text-muted"
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
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="px-12 py-20 border-t border-faint">
          <h2 className="font-serif text-4xl mb-12">What people say</h2>
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="p-7 border border-faint rounded-lg bg-white"
              >
                <p className="text-sm text-muted leading-relaxed mb-6 font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-medium text-ink">{t.authorName}</p>
                <p className="text-xs text-muted mt-0.5">
                  {t.role}
                  {t.company ? `, ${t.company}` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="px-12 py-20 border-t border-faint">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-2xs tracking-widest uppercase text-muted mb-4">
              About me
            </p>
            <h2 className="font-serif text-4xl leading-snug">
              Self-taught,
              <br />
              <em className="text-accent">detail-obsessed</em>
            </h2>
          </div>
          <div>
            <p className="text-sm text-muted leading-relaxed font-light mb-6">
              {about.headline}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              More about me →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
