'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { scrollToSection } from '@/lib/scrollToSection'

export type RailItem = {
  id: string
  label: string
}

type Props = {
  items: RailItem[]
}

/**
 * Sticky "contents" index for the project detail page. Replaces the old
 * per-section eyebrow/glow/glyph pattern with a single structural device:
 * the numbering here is a real reading order and the active numeral
 * lights up in the accent color as the reader scrolls (scroll-spy via
 * IntersectionObserver).
 */
export default function ProjectContentsRail({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Sections on this page"
      className="sticky top-[calc(var(--navbar-h)+2.5rem)] hidden self-start lg:block"
    >
      <span className="text-muted mb-4 block pl-3 text-[0.6rem] tracking-[0.2em] uppercase">
        Contents
      </span>
      <ol className="flex flex-col gap-1">
        {items.map(({ id, label }, i) => {
          const isActive = activeId === id
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => scrollToSection(id)}
                className={clsx(
                  'flex w-full items-baseline gap-3 border-l py-2 pl-3 text-left text-sm transition-colors',
                  isActive
                    ? 'border-accent text-ink'
                    : 'border-faint text-muted hover:border-accent/50 hover:text-ink',
                )}
              >
                <span
                  className={clsx(
                    'font-serif text-xs italic transition-colors',
                    isActive ? 'text-accent' : 'text-muted/70',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-snug">{label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
