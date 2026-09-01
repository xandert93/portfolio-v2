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
 *
 * Every section reveals as one block on scroll. Sections whose body is a
 * `.map()`-generated list (features, challenges, screenshots, metrics)
 * additionally stagger their own items in — each item watches its own
 * scroll position rather than a shared container, so long lists still
 * animate in as the reader actually scrolls to them (see fadeUpStagger in
 * lib/motion.ts). That's independent of this wrapper: nesting an
 * independently-triggered item inside this block-level reveal is safe,
 * since each sets its own `initial`/`whileInView`.
 *
 * `margin` + a low `amount` (rather than a higher plain `amount`) is what
 * delays the reveal without risking it never firing on a long section —
 * see AnimatedCard's viewportMargin doc.
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
      <AnimatedCard
        viewportAmount="some"
        viewportMargin="0px 0px -35% 0px"
        className={clsx('flex flex-col', className)}
      >
        <header className="mb-7 flex items-center gap-3">
          <span className="text-accent font-serif text-sm leading-none italic">
            {String(index).padStart(2, '0')}
          </span>
          <h2 className="text-muted text-2xs font-medium tracking-[0.2em] uppercase">
            {eyebrow}
          </h2>
          <span aria-hidden className="bg-faint ml-1 h-px flex-1" />
        </header>
        {children}
      </AnimatedCard>
    </section>
  )
}
