'use client'

import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

import clsx from 'clsx'

/* -------------------------------------------------------------------------- */
/*  Shared motion variants — reused by every section for a uniform reveal      */
/* -------------------------------------------------------------------------- */

export const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

/* -------------------------------------------------------------------------- */
/*  Section — the single source of truth for every section's box model         */
/*                                                                            */
/*  Owns: padding + max-width + top rule (via .section), the oversized index   */
/*  glyph, the soft gold glow, the editorial left rule (.ruled), and a         */
/*  uniform eyebrow / heading / lead header. Every section on the page uses    */
/*  it so their box models line up exactly.                                    */
/* -------------------------------------------------------------------------- */

type Props = {
  id?: string
  /** Two-digit index shown as the oversized background glyph. Omit on hero. */
  index?: string
  glyphSide?: 'left' | 'right'
  glowSide?: 'left' | 'right' | 'center'
  glowVertical?: 'top' | 'bottom'
  /** Set false to drop the glow (e.g. hero). */
  glow?: boolean
  eyebrow: string
  /** Small italic note shown on the opposite side of the eyebrow. */
  aside?: ReactNode
  heading: ReactNode
  headingId?: string
  /** Optional intro paragraph under the heading. */
  lead?: ReactNode
  /** Trailing accent full-stop after the heading. */
  dot?: boolean
  children: ReactNode
  className?: string
  'aria-labelledby'?: string
}

export const Section = ({
  id,
  index,
  glyphSide = 'left',
  glowSide = 'right',
  glowVertical = 'top',
  glow = true,
  eyebrow,
  aside,
  heading,
  headingId,
  lead,
  dot = true,
  children,
  className,
  ...rest
}: Props) => {
  const ref = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const numberY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  return (
    <section
      id={id}
      ref={ref}
      className={clsx('section overflow-x-clip', className)}
      {...rest}
    >
      <div className="section-child">
        {/* soft inner gold glow */}
        {glow && (
          <div
            aria-hidden
            className={clsx(
              'section-glow',
              glowVertical === 'top' ? 'top-0' : 'bottom-0',
              glowSide === 'left' && '-left-40',
              glowSide === 'right' && '-right-40',
              glowSide === 'center' && 'left-1/2 -translate-x-1/2',
            )}
          />
        )}

        {/* oversized index glyph */}
        {index && (
          <MotionIndexGlyph
            aria-hidden
            style={{ y: numberY }}
            className={clsx(
              'number-glyph',
              glowVertical === 'top' ? 'top-4 md:top-10' : 'bottom-4 md:bottom-10',
              glyphSide === 'left' ? 'left-4 md:left-20' : 'right-4 md:right-20',
            )}
            children={index}
          />
        )}

        <motion.div
          className="ruled relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Uniform header */}
          <header className="mb-10 md:mb-15">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <motion.span variants={fadeUp} className="eyebrow">
                {eyebrow}
              </motion.span>
              {aside && (
                <motion.span
                  variants={fadeUp}
                  className="text-muted font-serif text-xs italic"
                >
                  {aside}
                </motion.span>
              )}
            </div>

            <motion.h2 variants={fadeUp} id={headingId} className="section-heading mt-4">
              {heading}
              {dot && (
                <span
                  aria-hidden
                  className="text-accent ml-1 inline-block font-serif italic"
                >
                  .
                </span>
              )}
            </motion.h2>

            {lead && (
              <motion.p
                variants={fadeUp}
                className="text-muted mt-5 max-w-2xl leading-relaxed"
              >
                {lead}
              </motion.p>
            )}
          </header>

          {children}
        </motion.div>
      </div>
    </section>
  )
}

type IndexGlyphProps = {
  index: string | number
  glowVertical?: 'top' | 'bottom'
  glyphSide?: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}

const IndexGlyph = ({
  glowVertical,
  glyphSide,
  className = '',
  style,
  ...props
}: IndexGlyphProps) => {
  return (
    <span
      aria-hidden
      style={style}
      className={clsx(
        'number-glyph',
        glowVertical === 'top' ? 'top-4 md:top-10' : 'bottom-4 md:bottom-10',
        glyphSide === 'left' ? '-left-2 md:-left-6' : '-right-2 md:-right-6',
        className,
      )}
      {...props}
    />
  )
}

const MotionIndexGlyph = motion.create(IndexGlyph)
