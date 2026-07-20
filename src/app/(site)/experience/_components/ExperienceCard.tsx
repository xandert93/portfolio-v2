import { ArrowUpRight } from 'lucide-react'
import { genImageBuilder } from '@/sanity/lib/image'
import { Experience } from '@/sanity/types'

type Props = {
  experience: Experience
  index: number
  isLast: boolean
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })
}

export default function ExperienceCard({ experience, index, isLast }: Props) {
  const {
    _id,
    company,
    employment: { startDate, isCurrent, endDate, location },
    role: { title, summary, highlights, impact },
    skills,
  } = experience

  const logoSrc = company.logo ? genImageBuilder(company.logo).url() : '/placeholder.svg'

  return (
    <li
      className="relative animate-fade-up pl-12 pb-14 last:pb-0 md:pl-20"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Timeline rail — thin, starts at the node centre */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[5px] top-[10px] bottom-0 w-px bg-faint"
        />
      )}

      {/* Node — sits exactly at the top of the line */}
      <span
        aria-hidden
        className={`absolute left-0 top-[4px] block h-[11px] w-[11px] rounded-full ${
          isCurrent ? 'bg-accent animate-pulse-dot ring-4 ring-accent-dim' : 'bg-muted'
        }`}
      />

      <article className="card group p-6 md:p-8">
        {/* Card Header */}
        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt={`${company.name} logo`}
            className="w-24 shrink-0 rounded-xl object-contain sm:block"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-ink md:text-2xl">{title}</h3>
                <p className="mt-1 text-sm text-accent">{company.name}</p>
              </div>
              {isCurrent && <span className="badge-open">Current</span>}
            </div>

            <p className="mt-2 text-2xs uppercase tracking-[0.14em] text-muted">
              {formatDate(startDate)}
              {' — '}
              {isCurrent ? 'Present' : endDate ? formatDate(endDate) : ''}
              <span className="text-faint"> • </span>
              {location}
            </p>
          </div>
        </div>

        <Summary summary={summary} />
        <HighlightList highlights={highlights} />
        <Impact impact={impact} />
        <SkillBadgeList skills={skills} />
      </article>
    </li>
  )
}

const Summary = ({ summary }: { summary: Experience['role']['summary'] }) => {
  return (
    <p className="mt-6 text-pretty text-[0.95rem] leading-relaxed text-ink/90">
      {summary}
    </p>
  )
}

const HighlightList = ({
  highlights,
}: {
  highlights: Experience['role']['highlights']
}) => {
  return (
    <ul className="mt-5 grid gap-2.5">
      {highlights.map((highlight) => (
        <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-muted">
          <ArrowUpRight aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  )
}

const Impact = ({ impact }: { impact: Experience['role']['impact'] }) => {
  return (
    <p className="mt-6 border-l-2 rounded-sm border-accent/40 bg-accent-light py-3 pl-4 pr-3 text-sm leading-relaxed text-ink/90">
      <span className="font-medium text-accent">Impact — </span>
      {impact}
    </p>
  )
}

const SkillBadgeList = ({ skills }: { skills: Experience['skills'] }) => {
  const hasSkills = Boolean(skills.length)

  return (
    hasSkills && (
      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map(({ _id, name }) => (
          <span
            key={_id}
            className="rounded-full border border-faint bg-warm px-3 py-1 text-2xs uppercase tracking-widest text-muted transition-colors group-hover:border-accent/25"
          >
            {name}
          </span>
        ))}
      </div>
    )
  )
}
