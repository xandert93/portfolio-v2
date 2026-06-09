import { fetchAbout, fetchSkills, fetchTestimonials } from '@/sanity/lib/fetch'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'

export default async function AboutPage() {
  const [about, skills, testimonials] = await Promise.all([
    fetchAbout(),
    fetchSkills(),
    fetchTestimonials(),
  ])

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>(
    (groups, skill) => {
      const category = skill.category ?? 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push(skill)
      return groups
    },
    {},
  )

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs tracking-widest uppercase text-muted mb-4">
          About
        </p>
        <h1 className="font-serif text-5xl text-ink">Who I am</h1>
      </div>

      {/* Hero */}
      <section className="grid grid-cols-[1fr_200px] gap-12 items-start mb-20 pb-20 border-b border-faint">
        <div>
          {about.isOpenToWork && (
            <div className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase bg-green-badge-bg text-green-badge px-4 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-badge animate-pulse" />
              Open to work
            </div>
          )}

          <h2 className="font-serif text-3xl text-ink mb-6 leading-snug">
            {about.headline}
          </h2>

          {about.bio && (
            <div className="text-sm text-muted leading-relaxed font-light space-y-4">
              <PortableText value={about.bio} />
            </div>
          )}

          <div className="flex gap-6 mt-8">
            {about.location && (
              <p className="text-xs text-muted">{about.location}</p>
            )}
            {about.resumeUrl && (
              <a
                href={about.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xs tracking-widest uppercase text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
              >
                Download résumé ↗
              </a>
            )}
          </div>
        </div>

        {about.avatar && (
          <img
            src={urlFor(about.avatar)
              .width(400)
              .height(400)
              .fit('crop')
              .auto('format')
              .url()}
            alt="Profile photo"
            className="w-full rounded-lg border border-faint block"
          />
        )}
      </section>

      {/* Skills */}
      <section className="mb-20 pb-20 border-b border-faint">
        <p className="text-2xs tracking-widest uppercase text-muted mb-10">
          Skills
        </p>
        <div className="flex flex-col gap-10">
          {Object.entries(skillsByCategory).map(
            ([category, categorySkills]) => (
              <div key={category} className="grid grid-cols-[140px_1fr] gap-8">
                <p className="text-xs text-muted pt-1">{category}</p>
                <div className="flex gap-2 flex-wrap">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill._id}
                      className="text-xs px-3 py-1.5 bg-warm border border-faint rounded-md text-ink font-medium"
                    >
                      {skill.name}
                      {skill.proficiency && (
                        <span className="text-muted font-normal ml-1.5">
                          · {skill.proficiency}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section>
          <p className="text-2xs tracking-widest uppercase text-muted mb-10">
            Testimonials
          </p>
          <div className="flex flex-col gap-8">
            {testimonials.map((t) => (
              <div key={t._id} className="p-8 border border-faint bg-paper">
                <blockquote className="font-serif text-xl text-ink leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  {t.avatar && (
                    <img
                      src={urlFor(t.avatar)
                        .width(80)
                        .height(80)
                        .fit('crop')
                        .auto('format')
                        .url()}
                      alt={t.authorName ?? ''}
                      className="w-10 h-10 rounded-full border border-faint block"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {t.authorName}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {t.role}
                      {t.company ? `, ${t.company}` : ''}
                    </p>
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
