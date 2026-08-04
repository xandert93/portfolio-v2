'use client'
import { useRef, type ReactNode } from 'react'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

import clsx from 'clsx'
import { containerVariants, fadeUp, fadeUpReduced } from '@/lib/motion'

type Props = {
  id?: string

  glyph?: {
    number?: number
    side?: 'left' | 'right'
  }

  glow: {
    side?: 'center' | 'left' | 'right'
    vertical?: 'top' | 'bottom'
  }

  header: {
    eyebrow: string
    heading: ReactNode
    /** Optional intro paragraph under the heading. */
    lead?: ReactNode
    /** Small italic note shown on the opposite side of the eyebrow. */
    aside?: ReactNode
  }

  /** Trailing accent full-stop after the heading. */
  dot?: boolean
  children: ReactNode
  className?: string
  'aria-labelledby'?: string
}

export const Section = ({
  id,

  glyph,
  glow,
  header,

  dot = true,

  children,
  className,
  ...rest
}: Props) => {
  const ref = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Freeze the parallax range to a static value when reduced motion is requested,
  // instead of interpolating off scroll progress.
  const numberY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['4%', '-4%'],
  )

  const itemVariants = shouldReduceMotion ? fadeUpReduced : fadeUp

  return (
    <section
      id={id}
      ref={ref}
      className={clsx('section overflow-x-clip', className)}
      {...rest}
    >
      <div className="section-child">
        {glow && (
          <div
            aria-hidden
            className={clsx(
              'section-glow',
              glow.side === 'left' && '-left-40',
              glow.side === 'right' && '-right-40',
              glow.side === 'center' && 'left-1/2 -translate-x-1/2',
              glow.vertical === 'top' ? 'top-0' : 'bottom-0',
            )}
          />
        )}

        {glyph && (
          <MotionNumberGlyph
            aria-hidden
            style={{ y: numberY }}
            className={clsx(
              'number-glyph',
              glow.vertical === 'top' ? 'top-4 md:top-10' : 'bottom-4 md:bottom-10',
              glyph.side === 'left' ? 'left-4 md:left-20' : 'right-4 md:right-20',
            )}
            children={String(glyph.number).padStart(2, '0')}
          />
        )}

        <motion.div
          className="ruled relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <header className="mb-10 flex flex-col gap-6 md:mb-15 md:gap-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <motion.span variants={itemVariants} className="eyebrow">
                {header.eyebrow}
              </motion.span>
              {header.aside && (
                <motion.span
                  variants={itemVariants}
                  className="text-muted font-serif text-xs italic"
                >
                  {header.aside}
                </motion.span>
              )}
            </div>

            <motion.h2 variants={itemVariants} className="section-heading">
              {header.heading}
              {dot && (
                <span aria-hidden className="text-accent ml-0.5">
                  .
                </span>
              )}
            </motion.h2>

            {header.lead && (
              <motion.p
                variants={itemVariants}
                className="text-muted max-w-2xl leading-relaxed"
              >
                {header.lead}
              </motion.p>
            )}
          </header>

          {children}
        </motion.div>
      </div>
    </section>
  )
}

type NumberGlyphProps = {
  index: string | number
  glowVertical?: 'top' | 'bottom'
  glyphSide?: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}

const NumberGlyph = ({
  glowVertical,
  glyphSide,
  className = '',
  style,
  ...props
}: NumberGlyphProps) => {
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

const MotionNumberGlyph = motion.create(NumberGlyph)
