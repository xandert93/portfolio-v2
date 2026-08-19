'use client'

import type { ReactNode } from 'react'
import clsx from 'clsx'

import AnimatedCard from '@/components/ui/AnimatedCard'

type Props = {
  id: string
  /** Reading-order index, kept in sync with the sticky contents rail. */
  index: number
  eyebrow: string
  children: ReactNode
  className?: string
}

/**
 * One block of the case study. Gives every section the same editorial
 * header the rest of the site uses — an accent index numeral + eyebrow —
 * so the detail page reads as part of the same system as the home,
 * projects and contact pages rather than a bare document.
 */
export default function ProjectSection({
  id,
  index,
  eyebrow,
  children,
  className,
}: Props) {
  return (
    <section id={id} className="scroll-mt-32">
      <AnimatedCard className={clsx('flex flex-col', className)}>
        <header className="mb-7 flex items-center gap-3">
          <span className="text-accent font-serif text-sm leading-none italic">
            {String(index).padStart(2, '0')}
          </span>
          <span className="text-muted text-[0.65rem] font-medium tracking-[0.2em] uppercase">
            {eyebrow}
          </span>
          <span aria-hidden className="bg-faint ml-1 h-px flex-1" />
        </header>
        {children}
      </AnimatedCard>
    </section>
  )
}
