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
      className="animate-fade-up relative pb-14 pl-12 last:pb-0 md:pl-20"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* Timeline rail — thin, starts at the node centre */}
      {!isLast && (
        <span aria-hidden className="bg-faint absolute top-2.5 bottom-0 left-1.25 w-px" />
      )}

      {/* Node — sits exactly at the top of the line */}
      <span
        aria-hidden
        className={`absolute top-1 left-0 block h-2.75 w-2.75 rounded-full ${
          isCurrent ? 'bg-accent animate-pulse-dot ring-accent-dim ring-4' : 'bg-muted'
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
                <h3 className="text-ink font-serif text-xl md:text-2xl">{title}</h3>
                <p className="text-accent mt-1 text-sm">{company.name}</p>
              </div>
              {isCurrent && <span className="badge">Current</span>}
            </div>

            <p className="text-2xs text-muted mt-2 tracking-[0.14em] uppercase">
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
    <p className="text-ink/90 mt-6 text-[0.95rem] leading-relaxed text-pretty">
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
        <li key={highlight} className="text-muted flex gap-3 text-sm leading-relaxed">
          <ArrowUpRight aria-hidden className="text-accent mt-1 h-3.5 w-3.5 shrink-0" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  )
}

const Impact = ({ impact }: { impact: Experience['role']['impact'] }) => {
  return (
    <p className="border-accent/40 bg-accent-light text-ink/90 mt-6 rounded-sm border-l-2 py-3 pr-3 pl-4 text-sm leading-relaxed">
      <span className="text-accent font-medium">Impact — </span>
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
            className="border-faint bg-warm text-2xs text-muted group-hover:border-accent/25 rounded-full border px-3 py-1 tracking-widest uppercase transition-colors"
          >
            {name}
          </span>
        ))}
      </div>
    )
  )
}
