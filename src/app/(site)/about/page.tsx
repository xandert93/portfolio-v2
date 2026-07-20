import { fetchAbout, fetchSkills, fetchTestimonials } from '@/sanity/lib/fetch'
import { PortableText } from '@portabletext/react'
import { genImageBuilder } from '@/sanity/lib/image'

import TestimonialsSection from '@/components/sections/TestimonialsSection'

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

  const hasTestimonials = Boolean(testimonials.length)

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs text-muted mb-4 tracking-widest uppercase">About</p>
        <h1 className="text-ink font-serif text-5xl">Who I am</h1>
      </div>

      {/* Hero */}
      <section className="border-faint mb-20 grid grid-cols-[1fr_200px] items-start gap-12 border-b pb-20">
        <div>
          {about.isOpenToWork && (
            <div className="text-2xs bg-green-badge-bg text-green-badge mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 tracking-widest uppercase">
              <span className="bg-green-badge h-1.5 w-1.5 animate-pulse rounded-full" />
              Available for Work
            </div>
          )}

          <h2 className="text-ink mb-6 font-serif text-3xl leading-snug">
            {about.headline}
          </h2>

          {about.bio && (
            <div className="text-muted space-y-4 text-sm leading-relaxed font-light">
              <PortableText value={about.bio} />
            </div>
          )}

          <div className="mt-8 flex gap-6">
            {about.location && <p className="text-muted text-xs">{about.location}</p>}
            {about.resumeUrl && (
              <a
                href={about.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xs text-ink border-ink hover:text-accent hover:border-accent border-b pb-0.5 tracking-widest uppercase transition-colors"
              >
                Download résumé ↗
              </a>
            )}
          </div>
        </div>

        {about.avatar && (
          <img
            src={genImageBuilder(about.avatar)
              .width(400)
              .height(400)
              .fit('crop')
              .auto('format')
              .url()}
            alt="Profile photo"
            className="border-faint block w-full rounded-lg border"
          />
        )}
      </section>

      {/* Skills */}
      <section className="border-faint mb-20 border-b pb-20">
        <p className="text-2xs text-muted mb-10 tracking-widest uppercase">Skills</p>
        <div className="flex flex-col gap-10">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="grid grid-cols-[140px_1fr] gap-8">
              <p className="text-muted pt-1 text-xs">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map(({ _id, name, proficiency }) => (
                  <span
                    key={_id}
                    className="bg-warm border-faint text-ink rounded-md border px-3 py-1.5 text-xs font-medium"
                  >
                    {name}
                    {proficiency && (
                      <span className="text-muted ml-1.5 font-normal">
                        · {proficiency}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {hasTestimonials && <TestimonialsSection testimonials={testimonials} />}
    </main>
  )
}
