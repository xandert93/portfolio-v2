'use client'

import { useState } from 'react'
import Image from 'next/image'
import { genImageBuilder } from '@/sanity/lib/image'
import { Testimonials } from '@/sanity/types'

type Props = {
  testimonials: Testimonials
}

function getInitials(name: string | null) {
  return (
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('') ?? ''
  )
}

export default function TestimonialsSection({ testimonials }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const main = testimonials[activeIndex]
  const others = testimonials.filter((_, i) => i !== activeIndex).slice(0, 3)

  function goTo(index: number) {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }

  return (
    <section className="border-faint relative border-t px-8 py-24 md:px-20">
      <div className="bg-accent/8 pointer-events-none absolute top-0 left-1/4 h-100 w-150 rounded-full blur-[80px]" />
      <p className="text-2xs text-accent relative z-10 mb-2 tracking-widest uppercase">
        What people say
      </p>
      <h2 className="relative z-10 mb-12 font-serif text-3xl italic md:text-4xl">
        Kind words
      </h2>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr]">
        {/* Featured testimonial */}
        <div className="bg-warm border-accent/20 relative flex flex-col overflow-hidden rounded-2xl border p-10">
          <p className="text-accent/10 absolute -top-6 right-6 font-serif text-[10rem] leading-none italic select-none">
            ”
          </p>

          <div className="text-accent relative z-10 mb-6 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
              </svg>
            ))}
          </div>

          <p className="relative z-10 mb-8 font-serif text-2xl leading-snug font-light md:text-3xl">
            {main.quote}
          </p>

          <div className="relative z-10 mt-auto mb-8 flex items-center gap-4">
            {main.author.avatar ? (
              <Image
                src={genImageBuilder(main.author.avatar)
                  .width(116)
                  .height(116)
                  .fit('crop')
                  .auto('format')
                  .url()}
                alt={main.author.name ?? ''}
                width={58}
                height={58}
                className="border-accent/40 rounded-full border"
              />
            ) : (
              <div className="bg-faint border-accent/40 text-accent flex h-14.5 w-14.5 items-center justify-center rounded-full border font-serif">
                {getInitials(main.author.name)}
              </div>
            )}
            <div>
              <p className="text-base font-semibold">{main.author.name}</p>
              <p className="text-muted mt-0.5 text-sm">
                {main.author.role}
                {main.author.company ? `, ${main.author.company}` : ''}
              </p>
            </div>
          </div>

          {/* Arrows + dots */}
          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous testimonial"
              className="border-faint text-muted hover:text-ink hover:border-ink flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
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
                    i === activeIndex ? 'bg-accent w-6' : 'bg-faint w-1.5'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next testimonial"
              className="border-faint text-muted hover:text-ink hover:border-ink flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
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
              onClick={() => goTo(testimonials.findIndex((x) => x._id === t._id))}
              className="bg-warm border-faint hover:border-accent/30 flex flex-1 items-start gap-4 rounded-2xl border p-6 text-left transition-colors"
            >
              {t.author.avatar ? (
                <Image
                  src={genImageBuilder(t.author.avatar)
                    .width(96)
                    .height(96)
                    .fit('crop')
                    .auto('format')
                    .url()}
                  alt={t.author.name}
                  width={48}
                  height={48}
                  className="border-faint shrink-0 rounded-full border"
                />
              ) : (
                <div className="bg-faint border-faint text-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-sm">
                  {getInitials(t.author.name)}
                </div>
              )}
              <div>
                <p className="text-muted mb-2 line-clamp-2 text-sm leading-relaxed font-light">
                  {t.quote}
                </p>
                <p className="text-sm font-semibold">{t.author.name}</p>
                <p className="text-muted mt-0.5 text-xs">
                  {t.author.role}
                  {t.author.company ? `, ${t.author.company}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
