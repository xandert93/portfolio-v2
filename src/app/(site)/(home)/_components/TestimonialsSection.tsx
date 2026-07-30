'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

import clsx from 'clsx'
import { genImageBuilder } from '@/sanity/lib/image'
import { ArrowRight, Sparkle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import type { Testimonial, Testimonials } from '@/sanity/types'

import { Section } from '@/components/ui/Section'

type Props = {
  testimonials: Testimonial[]
  autoPlayMs?: number
}

export default function TestimonialsSection({ testimonials, autoPlayMs = 7000 }: Props) {
  const testimonialCount = testimonials.length
  const canCycle = testimonialCount > 1

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const currentTestimonial = testimonials[activeIndex]

  const goTo = useCallback(
    (i: number) => {
      setActiveIndex(() => ((i % testimonialCount) + testimonialCount) % testimonialCount)
    },
    [testimonialCount],
  )

  const changeIndex = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((prev) => (prev + direction + testimonialCount) % testimonialCount)
    },
    [testimonialCount],
  )

  const goToNextTestimonial = useCallback(() => changeIndex(1), [changeIndex])
  const goToPrevTestimonial = useCallback(() => changeIndex(-1), [changeIndex])

  useEffect(() => {
    if (!canCycle || isPaused) return
    const timer = setTimeout(() => goToNextTestimonial(), autoPlayMs)

    return () => clearTimeout(timer)
  }, [activeIndex, isPaused, canCycle, autoPlayMs, goToNextTestimonial])

  const handleMouseEnter = useCallback(() => setIsPaused(true), [])
  const handleMouseLeave = useCallback(() => setIsPaused(false), [])

  return (
    <Section
      id="testimonials"
      aria-labelledby="testimonials-heading"

      glyph={{
        number: 3,
        side: 'left',
      }}
      glow={{
        side: 'center',
        vertical: 'top',
      }}
      header={{
        eyebrow: 'Kind words',
        heading: (
          <>
            What people say after <span className="text-accent">working together</span>
          </>
        ),
        lead: "A short reel of feedback from founders, designers, students and teams I've built with.",
      }}
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,20rem)]">
        <div className="relative">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <QuoteMark />
            <CurrentTestimonial testimonial={currentTestimonial} />
          </div>

          {canCycle && (
            <CarouselControls
              testimonialIds={testimonials.map((t) => t._id)}
              activeIndex={activeIndex}
              isPaused={isPaused}
              autoPlayMs={autoPlayMs}
              goTo={goTo}
              goToPrevTestimonial={goToPrevTestimonial}
              goToNextTestimonial={goToNextTestimonial}
            />
          )}
        </div>

        {canCycle && (
          <>
            <div aria-hidden className="bg-faint hidden w-px md:block" />
            <div className="hidden md:block">
              <TestimonialNavRail
                testimonials={testimonials}
                activeIndex={activeIndex}
                goTo={goTo}
              />
            </div>
          </>
        )}
      </div>
    </Section>
  )
}

const CurrentTestimonial = ({
  testimonial: { _id, quote, author },
}: {
  testimonial: Testimonial
}) => {
  return (
    <div
      className="relative z-10 min-h-70 pt-8 md:min-h-85 md:pt-14"
      id={`testimonial-panel-${_id}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex h-full flex-col justify-between gap-10"
        >
          <CurrentTestimonialQuote quote={quote} />
          <CurrentTestimonialAuthor author={author} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

type CurrentTestimonialAuthorProps = { author: Testimonial['author'] }

const CurrentTestimonialAuthor = ({ author }: CurrentTestimonialAuthorProps) => {
  const { name, role, company, avatar } = author

  return (
    <div className="flex items-center gap-4">
      <AuthorAvatar avatar={avatar} name={name} />
      <div className="flex flex-col gap-0.5">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-muted truncate text-xs tracking-wide">
          {role} · {company}
        </p>
      </div>
    </div>
  )
}

const CurrentTestimonialQuote = ({ quote }: { quote: Testimonial['quote'] }) => {
  return (
    <p
      className="text-ink font-serif leading-[1.4] tracking-[-0.01em] text-balance italic"
      style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.15rem)' }}
    >
      {quote}
    </p>
  )
}

type CarouselControlsProps = {
  testimonialIds: Array<Testimonial['_id']>
  activeIndex: number
  isPaused: boolean
  autoPlayMs: number
  goTo: (i: number) => void
  goToPrevTestimonial: () => void
  goToNextTestimonial: () => void
}

const CarouselControls = ({
  testimonialIds,
  activeIndex,
  isPaused,
  autoPlayMs,
  goTo,
  goToPrevTestimonial,
  goToNextTestimonial,
}: CarouselControlsProps) => {
  return (
    <div className="mt-8 flex items-center gap-6">
      <div className="flex gap-2">
        <CarouselNavButton onClick={goToPrevTestimonial} dir="left" />
        <CarouselNavButton onClick={goToNextTestimonial} dir="right" />
      </div>

      <div className="flex items-center gap-2">
        {testimonialIds.map((testimonialId, i) => (
          <ProgressIndicator
            key={testimonialId}
            i={i}
            isActive={i === activeIndex}
            isPaused={isPaused}
            autoPlayMs={autoPlayMs}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <TestimonialCounter currentNum={activeIndex + 1} total={testimonialIds.length} />
    </div>
  )
}

type ProgressIndicatorProps = {
  i: number
  isActive: boolean
  isPaused: boolean
  autoPlayMs: number
  onClick: () => void
}

const ProgressIndicator = ({
  isActive,
  isPaused,
  autoPlayMs,
  onClick,
}: ProgressIndicatorProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 ease-out',
        isActive ? 'bg-faint w-8' : 'bg-faint hover:bg-accent/30 w-4',
      )}
    >
      {isActive && (
        <span
          key={String(isPaused)}
          className="bg-accent absolute inset-y-0 left-0 block"
          style={{
            animationName: 'testimonial-progress',
            animationDuration: `${autoPlayMs}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
    </button>
  )
}

const TestimonialCounter = ({
  currentNum,
  total,
}: {
  currentNum: number
  total: number
}) => {
  return (
    <span className="text-muted ml-auto font-serif text-xs italic">
      {currentNum}
      <span className="mx-1 opacity-50">/</span>
      {total}
    </span>
  )
}

const TestimonialNavRail = ({
  testimonials,
  activeIndex,
  goTo,
}: {
  testimonials: Testimonials
  activeIndex: number
  goTo: (i: number) => void
}) => {
  return (
    <ul className="flex flex-col gap-2">
      {testimonials.map((t, i) => {
        const isActive = i === activeIndex

        return (
          <li key={t._id}>
            <button
              onClick={() => goTo(i)}
              className={clsx(
                'group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-(--radius) border px-4 py-3.5 text-left transition-all',
                isActive
                  ? 'border-accent bg-accent-light'
                  : 'border-faint hover:border-accent/40 hover:bg-accent-light/50 bg-transparent',
              )}
            >
              <AuthorAvatar name={t.author.name} avatar={t.author.avatar} size={40} />
              <div className="min-w-0">
                <p className="text-ink truncate text-[0.9rem] font-medium">
                  {t.author.name}
                </p>
                <p className="text-muted truncate text-xs">
                  {t.author.role} · {t.author.company}
                </p>
              </div>
              <motion.span
                aria-hidden
                animate={{ x: isActive ? 0 : -6, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-accent font-serif text-lg"
              >
                <Sparkle
                  width={20}
                  className="transition-transform duration-500 group-hover:-rotate-90"
                />
              </motion.span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const QuoteMark = () => {
  return (
    <span
      aria-hidden
      className="text-accent pointer-events-none absolute top-0 -left-4 z-0 font-serif leading-none italic opacity-15 select-none md:top-4 md:-left-8"
      style={{ fontSize: 'clamp(6rem, 9vw, 8.5rem)' }}
    >
      “
    </span>
  )
}

type CarouselNavButtonProps = {
  onClick: () => void
  dir: 'left' | 'right'
}

const CarouselNavButton = ({ onClick, dir }: CarouselNavButtonProps) => (
  <button
    onClick={onClick}
    className="text-ink border-faint hover:border-accent/40 hover:bg-accent-light/50 grid h-10 w-10 place-items-center rounded-full border transition-all hover:-translate-y-0.5"
  >
    <ArrowRight
      size={14}
      strokeWidth={1.6}
      className={dir === 'left' ? 'rotate-180' : undefined}
    />
  </button>
)

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '—'
  )
}

type AvatarProps = Pick<Testimonial['author'], 'name' | 'avatar'> & {
  size?: number
}

const AuthorAvatar = ({ name, avatar, size = 48 }: AvatarProps) => {
  const url = avatar ? genImageBuilder(avatar).url() : ''

  const fallbackInitials = getInitials(name)

  return (
    <span
      className="border-faint bg-accent-dim relative grid shrink-0 place-items-center overflow-hidden rounded-full border"
      style={{ width: size, height: size }}
    >
      {url ? (
        <Image
          src={url || '/placeholder.svg'}
          alt={name}
          width={size * 2.5}
          height={size * 2.5}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-accent font-serif italic" style={{ fontSize: size * 0.38 }}>
          {fallbackInitials}
        </span>
      )}
    </span>
  )
}
