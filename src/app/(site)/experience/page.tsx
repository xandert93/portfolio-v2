import { fetchCv, fetchEducations, fetchExperiences } from '@/sanity/lib/fetch'

import { genImageBuilder } from '@/sanity/lib/image'
import { Educations } from '@/sanity/types'
import { ExperienceList } from './_components/ExperienceList'

export default async function ExperiencePage() {
  const [cv, experiences, educations] = await Promise.all([
    fetchCv(),
    fetchExperiences(),
    fetchEducations(),
  ])

  const cvUrl = cv?.asset?.url

  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <header className="border-faint border-b">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-20 md:py-28">
          <div className="animate-fade-up">
            <span className="eyebrow">Background</span>

            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:flex-wrap md:items-center md:gap-8">
              <h1 className="text-ink font-serif text-5xl leading-[1.05] md:text-7xl">
                Experience
              </h1>
              <p className="text-muted max-w-xl text-base leading-relaxed text-pretty md:order-2 md:text-lg">
                A timeline of my professional experience, the teams I've worked with and
                the impact I've made along the way.
              </p>

              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary shrink-0 self-stretch md:self-center"
                >
                  View CV ↗
                </a>
              )}

              <div className="order-3 mt-2 grow self-stretch">
                <StatisticsBanner experienceCount={experiences.length} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Experience ───────────────────────────────── */}
      <section
        className="mx-auto w-full max-w-4xl px-6 py-20 md:px-20 md:py-28"
        aria-labelledby="experience-heading"
      >
        <div className="mb-12 max-w-xl">
          <span className="eyebrow">Work</span>
          <h2 id="experience-heading" className="section-heading">
            Where I've worked
          </h2>
        </div>
        <ExperienceList experiences={experiences} />
      </section>

      {/* ── Education ────────────────────────────────── */}
      <section className="border-faint border-t" aria-labelledby="education-heading">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 md:px-20 md:py-28">
          <div className="mb-10 max-w-xl">
            <span className="eyebrow">Learning</span>
            <h2 id="education-heading" className="section-heading">
              Education
            </h2>
          </div>
          <EducationList educations={educations} />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-faint border-t">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center md:px-20">
          <p className="text-2xs text-muted tracking-[0.14em] uppercase">
            Open to new opportunities
          </p>
          <a href="mailto:hello@example.com" className="link-underline">
            Get in touch
          </a>
        </div>
      </footer>
    </main>
  )
}

const StatisticsBanner = ({ experienceCount }: { experienceCount: number }) => {
  const years = new Date().getFullYear() - 2021

  const stats = [
    { value: `${years}+`, label: 'Years building' },
    { value: experienceCount, label: 'Roles held' },
    { value: '12+', label: 'Products shipped' },
  ]

  return (
    <dl className="border-faint bg-faint grid grid-cols-3 gap-px overflow-hidden rounded-lg border">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-paper-2 px-5 py-6 text-center sm:px-8">
          <dt className="text-accent font-serif text-3xl italic md:text-4xl">
            {stat.value}
          </dt>
          <dd className="text-muted mt-2 text-xs tracking-[0.14em] uppercase md:text-sm">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function EducationList({ educations }: { educations: Educations }) {
  return (
    <div className="relative flex flex-col">
      {educations.map((entry, i) => {
        const {
          _id,
          startYear,
          endYear,
          isCurrent,
          institution,
          qualification,
          fieldOfStudy,
          grade,
          description,
          highlights,
        } = entry

        const isLast = i === educations.length - 1

        const yearLabel = isCurrent
          ? `${startYear} – Present`
          : endYear
            ? `${startYear} – ${endYear}`
            : `${startYear}`

        return (
          <div
            key={_id}
            className="relative flex gap-5 pb-10 last:pb-0 md:gap-8 md:pb-12"
          >
            {/* Timeline spine — connects logos, stops before the last one */}
            {!isLast && (
              <span
                aria-hidden
                className="bg-faint absolute top-16 left-7 h-[calc(100%-3.5rem)] w-px md:top-18 md:left-8"
              />
            )}

            {/* Logo */}
            <div className="bg-surface ring-faint relative z-10 h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 md:h-16 md:w-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  institution.logo
                    ? genImageBuilder(institution.logo).url()
                    : '/placeholder.svg'
                }
                alt={institution.name}
                className="h-full w-full object-contain p-2"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-2xs text-muted tracking-[0.14em] uppercase">
                  {yearLabel}
                </p>
                {grade && (
                  <p className="text-2xs text-accent tracking-widest uppercase">
                    {grade}
                  </p>
                )}
              </div>

              <h3 className="text-ink mt-1.5 font-serif text-2xl">{institution.name}</h3>

              {(qualification || fieldOfStudy) && (
                <p className="text-accent mt-1 text-sm">
                  {[qualification, fieldOfStudy].filter(Boolean).join(' · ')}
                </p>
              )}

              {description && (
                <p className="text-muted mt-3 text-sm leading-relaxed font-light text-pretty">
                  {description}
                </p>
              )}

              {highlights.length && (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="text-muted before:text-accent text-xs leading-relaxed font-light before:mr-1.5 before:content-['·']"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
