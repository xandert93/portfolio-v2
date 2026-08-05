'use client'

import { genImageBuilder } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { About, SiteSettings } from '@/sanity/types'
import { ROUTES } from '@/config/routes'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import OpenToWorkBadge from '@/components/site/OpenToWorkBadge'

type Props = {
  settings: NonNullable<SiteSettings>
  about: NonNullable<About>
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const

// --- Timeline constants ---
// PACE scales the whole sequence uniformly — bump it up/down to speed up
// or slow down every stage at once without re-tuning each value by hand.
const PACE = 2

// Photo starts immediately (it's the stage-setter, not a payoff).
// Badge is a quick, low-ceremony fade so it doesn't compete with the tagline.
// Tagline (typewriter) is the anchor of the sequence.
// Heading starts near the tail end of the typewriter rather than waiting for
// the very last letter, so there's no dead pause between them.
// Buttons land last, shortly after the heading, as the "now you can act" beat.
const PHOTO_DELAY = 0
const PHOTO_DURATION = 0.9 * PACE
const BADGE_DELAY = 0.3 * PACE
const BADGE_DURATION = 0.4 * PACE
const TAGLINE_START_DELAY = 0.2 * PACE
const LETTER_STAGGER = 0.02 * PACE
const LETTER_DURATION = 0.03
const HEADING_OVERLAP = 0.8 // heading starts at 80% through the typewriter
const HEADING_DURATION = 0.5 * PACE
const BUTTONS_GAP = 0.2 * PACE // pause after heading before buttons

// Extracts plain text length from PortableText blocks so we can estimate
// how long the typewriter effect takes, without hardcoding a guess
function getPlainTextLength(blocks: unknown): number {
  if (!Array.isArray(blocks)) return 0
  const text = blocks
    .map((block) =>
      Array.isArray((block as any)?.children)
        ? (block as any).children.map((child: any) => child?.text ?? '').join('')
        : '',
    )
    .join(' ')
  return text.replace(/\s/g, '').length
}

const letterItem: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: LETTER_DURATION } },
}

export default function HeroSection({ settings, about }: Props) {
  const prefersReducedMotion = useReducedMotion()

  // --- Compute the timeline once per render, based on actual tagline length ---
  const letterCount = getPlainTextLength(settings.hero?.tagline)
  const taglineTypingDuration = letterCount * LETTER_STAGGER + LETTER_DURATION

  const headingDelay = TAGLINE_START_DELAY + taglineTypingDuration * HEADING_OVERLAP
  const buttonsDelay = headingDelay + HEADING_DURATION * 0.6 + BUTTONS_GAP

  const taglineContainer: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: LETTER_STAGGER, delayChildren: TAGLINE_START_DELAY },
    },
  }

  // Reduced motion: skip delays/stagger, just a quick simultaneous fade
  const fade = (delay: number, duration: number) =>
    prefersReducedMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration, ease: EASE_OUT },
        }

  return (
    <section className="relative flex min-h-[calc(100vh-var(--navbar-h-mobile))] items-center overflow-x-hidden md:min-h-[calc(100vh-var(--navbar-h))]">
      {/* Desktop full-bleed photo, anchored right, behind the text */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden md:block">
        <DesktopHeroVisual />
      </div>
      {/* Mobile background image with overlay. MobileHeroContent superimposes it */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        <MobileHeroVisual />
        <MobileHeroVisualOverlay />
      </div>
      {/* Content container */}
      <div className="relative z-10 w-full px-8 py-16 md:px-20">
        <div className="mx-auto hidden max-w-6xl md:block">
          <HeroContent />
        </div>
        <MobileHeroContent />
      </div>
    </section>
  )

  function DesktopHeroVisual() {
    const url = genImageBuilder(about.avatar).url()
    if (!url) return <div className="bg-warm absolute inset-0" />

    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{
          delay: PHOTO_DELAY,
          duration: prefersReducedMotion ? 0.3 : PHOTO_DURATION,
          ease: EASE_OUT,
        }}
        className="relative h-full w-full"
      >
        <Image
          src={url || '/placeholder.svg'}
          alt="Profile photo"
          fill
          className="object-cover object-[75%_20%]"
          priority
          sizes="(min-width: 768px) 58vw, 0px"
        />
        <div
          aria-hidden
          className="from-paper via-paper/40 absolute inset-0 w-1/3 bg-linear-to-r to-transparent"
        />
        <div
          aria-hidden
          className="from-paper/30 absolute inset-0 bg-linear-to-t via-transparent to-transparent"
        />
      </motion.div>
    )
  }

  function MobileHeroVisual() {
    const url = genImageBuilder(about.avatar).url()
    if (!url) return <div className="absolute inset-0 bg-[#15141a]" />

    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{
          delay: PHOTO_DELAY,
          duration: prefersReducedMotion ? 0.3 : PHOTO_DURATION,
          ease: EASE_OUT,
        }}
        className="absolute inset-0"
      >
        <Image
          src={url || '/placeholder.svg'}
          alt=""
          fill
          className="object-cover object-[62%_15%]"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    )
  }

  function MobileHeroVisualOverlay() {
    return (
      <div className="from-paper/40 via-paper/80 to-paper absolute inset-0 bg-linear-to-b" />
    )
  }

  // Splits PortableText output into per-letter spans (grouped by word so
  // wrapping stays on word boundaries) for the typewriter effect
  function wrapLetters(node: React.ReactNode, key: number, isEm = false) {
    if (typeof node !== 'string') return node
    const words = node.split(' ')
    return words.map((word, wi) => (
      <span key={`${key}-${wi}`} className="inline-block whitespace-nowrap">
        {word.split('').map((char, ci) => (
          <motion.span
            key={`${key}-${wi}-${ci}`}
            variants={letterItem}
            className={
              isEm ? 'text-accent inline-block font-medium italic' : 'inline-block'
            }
          >
            {char}
          </motion.span>
        ))}
        {wi < words.length - 1 ? '\u00A0' : ''}
      </span>
    ))
  }

  function Tagline() {
    if (prefersReducedMotion) {
      return (
        <div className="[&_em]:text-accent font-serif text-5xl leading-[1.08] md:text-6xl md:leading-[1.04] [&_em]:font-medium [&_em]:italic">
          <PortableText value={settings.hero?.tagline ?? []} />
        </div>
      )
    }

    return (
      <motion.div
        variants={taglineContainer}
        initial="hidden"
        animate="show"
        className="font-serif text-5xl leading-[1.08] md:text-6xl md:leading-[1.04]"
      >
        <PortableText
          value={settings.hero?.tagline ?? []}
          components={{
            block: ({ children }: any) => {
              const wrapped = Array.isArray(children)
                ? children.map((child, i) => wrapLetters(child, i))
                : wrapLetters(children, 0)
              return <p>{wrapped}</p>
            },
            marks: {
              em: ({ children }) => {
                const wrapped = Array.isArray(children)
                  ? children.map((child, i) => wrapLetters(child, i, true))
                  : wrapLetters(children, 0, true)
                return <>{wrapped}</>
              },
            },
          }}
        />
      </motion.div>
    )
  }

  function Heading() {
    return (
      <motion.p
        {...fade(headingDelay, HEADING_DURATION)}
        className="text-muted font-sans leading-relaxed font-light md:max-w-md"
      >
        {settings.hero?.heading}
      </motion.p>
    )
  }

  function ProjectsLink() {
    return (
      <Link href={ROUTES.projects} className="btn btn-primary">
        View my work ↗
      </Link>
    )
  }

  function ContactLink() {
    return (
      <Link href={ROUTES.contact} className="btn btn-ghost">
        Get in touch ➤
      </Link>
    )
  }

  function HeroContent() {
    return (
      <div className="flex max-w-xl flex-col items-start gap-8">
        <motion.div {...fade(BADGE_DELAY, BADGE_DURATION)}>
          <OpenToWorkBadge isOpenToWork={about.isOpenToWork} />
        </motion.div>
        <Tagline />
        <Heading />
        <motion.div {...fade(buttonsDelay, 0.5 * PACE)} className="flex gap-4">
          <ProjectsLink />
          <ContactLink />
        </motion.div>
      </div>
    )
  }

  function MobileHeroContent() {
    return (
      <div className="flex flex-col items-center gap-8 text-center md:hidden">
        <motion.div {...fade(BADGE_DELAY, BADGE_DURATION)}>
          <OpenToWorkBadge isOpenToWork={about.isOpenToWork} />
        </motion.div>
        <Tagline />
        <Heading />
        <motion.div
          {...fade(buttonsDelay, 0.5 * PACE)}
          className="flex justify-center gap-4"
        >
          <ProjectsLink />
          <ContactLink />
        </motion.div>
      </div>
    )
  }
}
