'use client'

import { useState } from 'react'
import Image from 'next/image'
import { genImageBuilder } from '@/sanity/lib/image'
import { TESTIMONIALS_QUERY_RESULT } from '../../../sanity.types'

type TestimonialsProps = {
  testimonials: TESTIMONIALS_QUERY_RESULT
}

function getInitials(name: string | null) {
  return (
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('') ?? ''
  )
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (testimonials.length === 0) return null

  const main = testimonials[activeIndex]
  const others = testimonials.filter((_, i) => i !== activeIndex).slice(0, 3)

  function goTo(index: number) {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative px-8 md:px-20 py-24 border-t border-faint">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-accent/8 blur-[80px] pointer-events-none" />
      <p className="text-2xs tracking-widest uppercase text-accent mb-2 relative z-10">
        What people say
      </p>
      <h2 className="font-serif italic text-3xl md:text-4xl mb-12 relative z-10">
        Kind words
      </h2>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6">
        {/* Featured testimonial */}
        <div className="relative overflow-hidden bg-warm border border-accent/20 rounded-2xl p-10 flex flex-col">
          <p className="absolute -top-6 right-6 font-serif italic text-[10rem] text-accent/10 leading-none select-none">
            &rdquo;
          </p>

          <div className="relative z-10 flex gap-1 mb-6 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
              </svg>
            ))}
          </div>

          <p className="relative z-10 font-serif text-2xl md:text-3xl font-light leading-snug mb-8">
            {main.quote}
          </p>

          <div className="relative z-10 flex items-center gap-4 mt-auto mb-8">
            {main.avatar ? (
              <Image
                src={genImageBuilder(main.avatar)
                  .width(116)
                  .height(116)
                  .fit('crop')
                  .auto('format')
                  .url()}
                alt={main.authorName ?? ''}
                width={58}
                height={58}
                className="rounded-full border border-accent/40"
              />
            ) : (
              <div className="w-[58px] h-[58px] rounded-full bg-faint border border-accent/40 flex items-center justify-center font-serif text-accent">
                {getInitials(main.authorName)}
              </div>
            )}
            <div>
              <p className="text-base font-semibold">{main.authorName}</p>
              <p className="text-sm text-muted mt-0.5">
                {main.role}
                {main.company ? `, ${main.company}` : ''}
              </p>
            </div>
          </div>

          {/* Arrows + dots */}
          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full border border-faint flex items-center justify-center text-muted hover:text-ink hover:border-ink transition-colors"
            >
              ←
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t._id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'w-6 bg-accent' : 'w-1.5 bg-faint'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full border border-faint flex items-center justify-center text-muted hover:text-ink hover:border-ink transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Supporting testimonials */}
        <div className="flex flex-col gap-4">
          {others.map((t) => (
            <button
              key={t._id}
              onClick={() =>
                goTo(testimonials.findIndex((x) => x._id === t._id))
              }
              className="text-left bg-warm border border-faint rounded-2xl p-6 flex gap-4 items-start flex-1 hover:border-accent/30 transition-colors"
            >
              {t.avatar ? (
                <Image
                  src={genImageBuilder(t.avatar)
                    .width(96)
                    .height(96)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={t.authorName ?? ''}
                  width={48}
                  height={48}
                  className="rounded-full border border-faint shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-faint border border-faint flex items-center justify-center font-serif text-sm text-muted shrink-0">
                  {getInitials(t.authorName)}
                </div>
              )}
              <div>
                <p className="text-sm text-muted leading-relaxed font-light mb-2 line-clamp-2">
                  {t.quote}
                </p>
                <p className="text-sm font-semibold">{t.authorName}</p>
                <p className="text-xs text-muted mt-0.5">
                  {t.role}
                  {t.company ? `, ${t.company}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
