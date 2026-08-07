'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { fadeUp, fadeUpReduced } from '@/lib/motion'

export type Shot = { key: string; url: string; full: string }

type Props = {
  shots: Shot[]
  title: string
}

export default function ScreenshotGallery({ shots, title }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])

  useEffect(() => {
    if (openIndex === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') setOpenIndex((i) => ((i ?? 0) + 1) % shots.length)
      if (e.key === 'ArrowLeft')
        setOpenIndex((i) => ((i ?? 0) - 1 + shots.length) % shots.length)
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, shots.length, close])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {shots.map((shot, i) => (
          <motion.button
            key={shot.key}
            type="button"
            onClick={() => setOpenIndex(i)}
            variants={shouldReduceMotion ? fadeUpReduced : fadeUp}
            className="card no-hover-transform group relative aspect-16/10 overflow-hidden"
            aria-label={`View screenshot ${i + 1} of ${title}`}
          >
            <Image
              src={shot.url}
              alt={`${title} — screenshot ${i + 1}`}
              fill
              loading="lazy"
              sizes="(min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <span className="bg-paper/70 text-ink absolute bottom-3 left-3 rounded-sm px-2.5 py-1 font-serif text-[0.7rem] italic opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {String(i + 1).padStart(2, '0')}
            </span>
          </motion.button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshots`}
          onClick={close}
          className="bg-paper/95 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="btn-ghost absolute top-5 right-5 rounded-sm p-2"
          >
            <X className="size-4" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="border-faint relative aspect-16/10 w-full max-w-5xl overflow-hidden rounded-sm border"
          >
            <Image
              src={shots[openIndex].full}
              alt={`${title} — screenshot ${openIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <p className="text-muted absolute bottom-6 text-[0.65rem] tracking-widest uppercase">
            {openIndex + 1} / {shots.length}
          </p>
        </div>
      )}
    </>
  )
}
