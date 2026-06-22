'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { urlFor } from '@/sanity/lib/image'
import { TESTIMONIALS_QUERY_RESULT } from '../../../sanity.types'

type Testimonial = TESTIMONIALS_QUERY_RESULT[number]

const ROTATE_INTERVAL_MS = 6000

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const startIndex = useMemo(() => {
    const featuredIndex = testimonials.findIndex((t) => t.isFeatured)
    return featuredIndex >= 0 ? featuredIndex : 0
  }, [testimonials])

  const [activeIndex, setActiveIndex] = useState(startIndex)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [testimonials.length, activeIndex])

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  if (testimonials.length === 0) return null

  const active = testimonials[activeIndex]

  return (
    <section>
      <p className="text-2xs tracking-widest uppercase text-muted mb-10">
        Testimonials
      </p>

      <div className="max-w-xl mx-auto text-center px-5 py-12">
        <div className="min-h-[140px] md:min-h-[160px] flex flex-col items-center justify-center gap-6">
          <blockquote
            key={active._id}
            className="font-serif text-2xl md:text-3xl leading-snug text-ink animate-fade-in"
          >
            &ldquo;{active.quote}&rdquo;
          </blockquote>

          <div className="min-h-[24px] flex items-center justify-center">
            <p className="text-sm text-muted">
              <span className="text-ink font-medium">{active.authorName}</span>
              {active.role || active.company ? (
                <>
                  {' — '}
                  {active.role}
                  {active.role && active.company ? ', ' : ''}
                  {active.company}
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-7">
          {testimonials.map((t, i) => (
            <button
              key={t._id}
              type="button"
              onClick={() => handleSelect(i)}
              aria-label={`Show testimonial from ${t.authorName}`}
              aria-current={i === activeIndex}
              className="p-1.5 -m-1.5 cursor-pointer"
            >
              <span
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-accent' : 'bg-faint hover:bg-muted'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-7 flex-wrap pt-6 border-t border-faint mt-2">
        {testimonials.map((t, i) => (
          <button
            key={t._id}
            type="button"
            onClick={() => handleSelect(i)}
            aria-label={`Show testimonial from ${t.authorName}`}
            aria-current={i === activeIndex}
            className={`flex flex-col items-center gap-1.5 cursor-pointer transition-opacity ${
              i === activeIndex ? 'opacity-100' : 'opacity-50 hover:opacity-80'
            }`}
          >
            {t.avatar ? (
              <img
                src={urlFor(t.avatar)
                  .width(120)
                  .height(120)
                  .fit('crop')
                  .auto('format')
                  .url()}
                alt=""
                width={60}
                height={60}
                className="rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-warm flex items-center justify-center text-sm font-medium text-ink">
                {t.authorName?.[0] ?? '?'}
              </div>
            )}
            <p className="text-2xs text-muted">{t.authorName?.split(' ')[0]}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
