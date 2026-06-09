import { fetchExperience, fetchEducation } from '@/sanity/lib/fetch'
import { PortableText } from '@portabletext/react'

export default async function ExperiencePage() {
  const [experience, education] = await Promise.all([
    fetchExperience(),
    fetchEducation(),
  ])

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs tracking-widest uppercase text-muted mb-4">
          Background
        </p>
        <h1 className="font-serif text-5xl text-ink">Experience</h1>
      </div>

      {/* Work */}
      <section className="mb-20">
        <p className="text-2xs tracking-widest uppercase text-muted mb-10">
          Work
        </p>
        <div className="flex flex-col">
          {experience.map((entry, i) => (
            <div
              key={entry._id}
              className={`grid grid-cols-[140px_1fr] gap-8 py-10 ${i !== 0 ? 'border-t border-faint' : ''}`}
            >
              <div className="pt-1">
                <p className="text-xs text-muted leading-relaxed">
                  {entry.startDate
                    ? new Date(entry.startDate).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                  {' – '}
                  {entry.isCurrent
                    ? 'Present'
                    : entry.endDate
                      ? new Date(entry.endDate).toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-ink mb-1">
                  {entry.role}
                </h2>
                <p className="text-sm text-accent mb-4">{entry.company}</p>

                {entry.description && (
                  <div className="text-sm text-muted leading-relaxed font-light mb-6">
                    <PortableText value={entry.description} />
                  </div>
                )}

                {entry.skills && entry.skills.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {entry.skills.map((skill) => (
                      <span
                        key={skill._id}
                        className="text-2xs px-2.5 py-1 bg-warm border border-faint rounded-full text-muted"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <p className="text-2xs tracking-widest uppercase text-muted mb-10">
          Education
        </p>
        <div className="flex flex-col">
          {education.map((entry, i) => (
            <div
              key={entry._id}
              className={`grid grid-cols-[140px_1fr] gap-8 py-10 ${i !== 0 ? 'border-t border-faint' : ''}`}
            >
              <div className="pt-1">
                <p className="text-xs text-muted">
                  {entry.startYear}
                  {entry.endYear != null && ` – ${entry.endYear}`}
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-ink mb-1">
                  {entry.institution}
                </h2>
                {entry.degree && (
                  <p className="text-sm text-accent mb-4">{entry.degree}</p>
                )}
                {entry.description && (
                  <p className="text-sm text-muted leading-relaxed font-light">
                    {entry.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
