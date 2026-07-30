'use client'

import type { Skill, Skills } from '@/sanity/types'
import { genImageBuilder } from '@/sanity/lib/image'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Section } from '@/components/ui/Section'
import clsx from 'clsx'
import { fadeUp, fadeUpReduced } from '@/lib/motion'

const ALL = 'All' as const
type CategoryKey = typeof ALL | string

// Fixed display order for tabs. Anything not listed here (e.g. a brand-new
// category added in Sanity that hasn't been slotted in yet) falls back to
// alphabetical order and is appended at the end.
const CATEGORY_ORDER = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'CMS & SaaS',
  'Testing',
  'DevOps',
  'AI',
]

export default function TechSkillsSection({ skills }: { skills: Skills }) {
  const reduce = useReducedMotion()
  const [activeTab, setActiveTab] = useState<CategoryKey>(ALL)

  const categories = useMemo<CategoryKey[]>(() => {
    const unique = Array.from(
      new Set(skills.map((skill) => skill.category).filter(Boolean)),
    ) as string[]

    unique.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a)
      const bi = CATEGORY_ORDER.indexOf(b)
      // Known categories sort by their position in CATEGORY_ORDER.
      // Unknown categories (-1) sort after all known ones, alphabetically among themselves.
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    })

    return [ALL, ...unique]
  }, [skills])

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryKey, number> = {}

    for (const category of categories) counts[category] = 0

    counts[ALL] = skills.length

    for (const skill of skills) {
      const category = skill.category as string | undefined

      if (category && counts[category] !== undefined) counts[category] += 1
    }

    return counts
  }, [skills, categories])

  const filteredSkills =
    activeTab === ALL ? skills : skills.filter((skill) => skill.category === activeTab)

  return (
    <Section
      id="skills"
      glyph={{ number: 2, side: 'right' }}
      glow={{ side: 'left', vertical: 'top' }}
      header={{
        eyebrow: 'Toolkit',
        heading: (
          <>
            What I <em className="text-accent font-serif italic">work with</em>
          </>
        ),
        lead: "The landscape keeps moving and I move with it — here's the full set of technologies I'm comfortable reaching for on any given project.",
      }}
    >
      <motion.div
        variants={reduce ? fadeUpReduced : fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.7 }}
      >
        <FilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          shownCount={filteredSkills.length}
          counts={categoryCounts}
          categories={categories}
        />
      </motion.div>

      {/* Skill Grid */}
      <motion.ul
        layout
        className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 md:gap-6 lg:grid-cols-7"
      >
        {filteredSkills.map((skill, i) => (
          <SkillTile key={skill._id} skill={skill} index={i} reduce={Boolean(reduce)} />
        ))}
      </motion.ul>

      <Footnote reduce={Boolean(reduce)} />
    </Section>
  )
}

const FilterTabs = ({
  activeTab,
  setActiveTab,
  shownCount,
  counts,
  categories,
}: {
  activeTab: CategoryKey
  setActiveTab: (c: CategoryKey) => void
  shownCount: number
  counts: Record<CategoryKey, number>
  categories: CategoryKey[]
}) => {
  return (
    <div className="border-faint mb-10 flex border-t border-b py-3">
      <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 md:justify-start">
        {categories.map((categoryName) => {
          const isActive = activeTab === categoryName

          const handleClick = () => setActiveTab(categoryName)

          return (
            <button
              key={categoryName}
              onClick={handleClick}
              className={clsx(
                'group relative px-3 py-1.5 text-lg transition-colors',
                isActive && 'text-accent',
              )}
            >
              <span
                className={clsx(
                  'font-serif italic',
                  !isActive && 'text-ink/70 hover:text-ink',
                )}
              >
                {categoryName}
              </span>
              <span className="text-ink/40 ml-1.5 font-mono text-[10px]">
                ({counts[categoryName] ?? 0})
              </span>
              {isActive && (
                <motion.span
                  layoutId="category-button-underline"
                  className="bg-accent absolute right-3 bottom-0 left-3 h-px"
                />
              )}
            </button>
          )
        })}
      </div>

      <small className="text-ink/40 ml-auto self-end font-mono text-[10px] tracking-[0.2em] uppercase">
        {shownCount} shown
      </small>
    </div>
  )
}

type SkillTileProps = {
  skill: Skill
  index: number
  reduce: boolean
}

const SkillTile = ({ skill: { name, logo }, index, reduce }: SkillTileProps) => {
  const logoUrl = genImageBuilder(logo).url()

  const delay = Math.min((index % 7) * 0.05, 0.3)

  const transition = reduce
    ? { duration: 0.3, ease: 'easeOut' as const, delay }
    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay }

  return (
    <motion.li
      layout
      variants={reduce ? fadeUpReduced : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      transition={transition}
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

        <Image
          src={logoUrl}
          alt={name}
          width={64}
          height={64}
          className="relative h-[55%] w-[55%] object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="text-ink/80 text-[11px] font-medium tracking-tight sm:text-xs">
        {name}
      </span>
    </motion.li>
  )
}

const Footnote = ({ reduce }: { reduce: boolean }) => {
  return (
    <motion.div
      variants={reduce ? fadeUpReduced : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      className="border-faint mt-14 flex items-baseline justify-between gap-4 border-t pt-6"
    >
      <p className="text-ink/50 font-serif text-base italic">
        - and picking up{' '}
        <span className="text-accent">whatever the next project asks for.</span>
      </p>
    </motion.div>
  )
}
