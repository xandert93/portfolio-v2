'use client'

import type { Skill, Skills } from '@/sanity/types'
import { genImageBuilder } from '@/sanity/lib/image'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Section } from '@/components/ui/Section'

type ChapterKey = 'All' | 'Frontend' | 'Backend' | 'Data' | 'Tooling'

const categoryMap: Record<string, Exclude<ChapterKey, 'All'>> = {
  'React.js': 'Frontend',
  'Next.js': 'Frontend',
  TypeScript: 'Frontend',
  JavaScript: 'Frontend',
  'Tailwind CSS': 'Frontend',
  Redux: 'Frontend',
  'React Query': 'Frontend',
  'Framer Motion': 'Frontend',
  'Node.js': 'Backend',
  'Express.js': 'Backend',
  'Socket.IO': 'Backend',
  JWT: 'Backend',
  'Auth.js': 'Backend',
  Stripe: 'Backend',
  GraphQL: 'Data',
  Firebase: 'Data',
  Supabase: 'Data',
  Sanity: 'Data',
  MongoDB: 'Data',
  PostgreSQL: 'Data',
  Prisma: 'Data',
  Cloudinary: 'Data',
  Git: 'Tooling',
  Figma: 'Tooling',
  Jest: 'Tooling',
  Cypress: 'Tooling',
  Docker: 'Tooling',
}

const chapterOrder: ChapterKey[] = ['All', 'Frontend', 'Backend', 'Data', 'Tooling']

export default function TechSkillsSection({ skills }: { skills: Skills }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<ChapterKey>('All')

  const list = useMemo(() => (skills ?? []).filter((s) => s?.name), [skills])

  const counts = useMemo(() => {
    const c: Record<ChapterKey, number> = {
      All: list.length,
      Frontend: 0,
      Backend: 0,
      Data: 0,
      Tooling: 0,
    }
    for (const s of list) {
      const k = categoryMap[s.name!] as Exclude<ChapterKey, 'All'> | undefined
      if (k) c[k] += 1
    }
    return c
  }, [list])

  const filtered = useMemo(() => {
    if (active === 'All') return list
    return list.filter((s) => categoryMap[s.name!] === active)
  }, [list, active])

  if (!list.length) return null

  return (
    <Section
      id="skills"
      index="02"
      glyphSide="right"
      glowSide="left"
      glowVertical="top"
      eyebrow="Toolkit"
      heading={
        <>
          What I <em className="text-accent font-serif italic">work with</em>
        </>
      }
      lead="The landscape keeps moving and I move with it — here's the full set of technologies I'm comfortable reaching for on any given project."
    >
      {/* Filter chapters */}
      <div className="border-faint mb-10 flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-b py-3">
        {chapterOrder.map((k, i) => {
          const isActive = active === k
          return (
            <button
              key={k}
              onClick={() => setActive(k)}
              className="group relative px-3 py-1.5 text-sm transition-colors"
              style={{ color: isActive ? 'var(--accent)' : undefined }}
            >
              <span className="text-ink/30 mr-2 font-mono text-[10px] tracking-widest">
                {String(i).padStart(2, '0')}
              </span>
              <span
                className={
                  isActive
                    ? 'font-serif text-lg italic'
                    : 'text-ink/70 hover:text-ink font-serif text-lg italic'
                }
              >
                {k}
              </span>
              <span className="text-ink/40 ml-1.5 font-mono text-[10px]">
                ({counts[k]})
              </span>
              {isActive && (
                <motion.span
                  layoutId="chapter-underline"
                  className="bg-accent absolute right-3 bottom-0 left-3 h-px"
                />
              )}
            </button>
          )
        })}
        <span className="text-ink/40 ml-auto font-mono text-[10px] tracking-[0.2em] uppercase">
          {String(filtered.length).padStart(2, '0')} shown
        </span>
      </div>

      {/* Dense grid */}
      <motion.ul
        layout
        className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 md:gap-6 lg:grid-cols-7"
      >
        {filtered.map((skill, i) => (
          <SkillTile
            key={skill._id ?? skill.name}
            skill={skill}
            index={i}
            reduce={!!reduce}
          />
        ))}
      </motion.ul>

      {/* Footnote */}
      <div className="border-faint mt-14 flex items-baseline justify-between gap-4 border-t pt-6">
        <p className="text-ink/50 font-serif text-base italic">
          &mdash; and picking up whatever the next project asks for.
        </p>
        <span className="text-ink/40 font-mono text-[10px] tracking-[0.2em] uppercase">
          {list.length} total
        </span>
      </div>
    </Section>
  )
}

function SkillTile({
  skill,
  index,
  reduce,
}: {
  skill: Skill
  index: number
  reduce: boolean
}) {
  const name = skill.name ?? ''
  const logo = (skill as any).logo

  const logoUrl =
    logo && logo.asset
      ? (() => {
          try {
            return genImageBuilder(logo).url()
          } catch {
            return null
          }
        })()
      : null

  return (
    <motion.li
      layout
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.02, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col items-center text-center"
    >
      <div className="bg-paper-2 border-faint relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-sm">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(120% 120% at 30% 20%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 65%)',
          }}
        />
        {logoUrl ? (
          <Image
            src={logoUrl || '/placeholder.svg'}
            alt={name}
            width={64}
            height={64}
            className="relative h-[55%] w-[55%] object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span
            className="text-ink/50 group-hover:text-ink relative font-serif text-2xl italic transition-colors"
            aria-hidden
          >
            {name.slice(0, 2)}
          </span>
        )}
      </div>
      <span className="text-ink/80 text-[11px] font-medium tracking-tight sm:text-xs">
        {name}
      </span>
    </motion.li>
  )
}
