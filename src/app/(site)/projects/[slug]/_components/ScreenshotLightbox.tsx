'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export type Shot = {
  key: string
  url: string
  full: string
  title?: string
  description?: string
}

type LightboxContextValue = {
  open: (key: string) => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

/**
 * Lets any descendant (the Solution section's breather image, a Screens
 * grid thumbnail) open the same full-screen viewer at a given shot, by
 * key, instead of each owning its own modal. That means arrow-key
 * navigation from the Solution image can carry on into the rest of the
 * gallery instead of being a dead end.
 */
export function useScreenshotLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) {
    throw new Error(
      'useScreenshotLightbox must be used within a ScreenshotLightboxProvider',
    )
  }
  return ctx
}

type Props = {
  shots: Shot[]
  title: string
  children: ReactNode
}

export default function ScreenshotLightboxProvider({ shots, title, children }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? 0 : (i + 1) % shots.length)),
    [shots.length],
  )
  const previous = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? shots.length - 1 : (i - 1 + shots.length) % shots.length,
      ),
    [shots.length],
  )

  const open = useCallback(
    (key: string) => {
      const index = shots.findIndex((shot) => shot.key === key)
      if (index !== -1) setOpenIndex(index)
    },
    [shots],
  )

  useEffect(() => {
    if (openIndex === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') previous()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, next, previous])

  const transition = shouldReduceMotion
    ? { duration: 0.15 }
    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }

  const contextValue = useMemo(() => ({ open }), [open])
  const activeShot = openIndex !== null ? shots[openIndex] : null

  return (
    <LightboxContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {activeShot && openIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} screenshots`}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="bg-paper/95 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm md:p-10"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close screenshots"
              className="btn-ghost absolute top-5 right-5 z-10 rounded-sm p-2"
            >
              <X className="size-4" />
            </button>

            {shots.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  previous()
                }}
                aria-label="Previous screenshot"
                className="btn-ghost absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-sm p-2 md:left-8"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}

            <div
              className="flex w-full max-w-5xl flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={activeShot.key}
                initial={{
                  opacity: 0,
                  scale: shouldReduceMotion ? 1 : 0.96,
                  x: shouldReduceMotion ? 0 : 12,
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                transition={transition}
                className="border-faint relative aspect-16/10 w-full overflow-hidden rounded-sm border"
              >
                <Image
                  src={activeShot.full}
                  alt={`${title} — screenshot ${openIndex + 1}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </motion.div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <p className="text-muted text-2xs tracking-widest uppercase">
                  {openIndex + 1} / {shots.length}
                </p>
                {activeShot.title && (
                  <p className="text-ink font-serif text-base italic md:text-lg">
                    {activeShot.title}
                  </p>
                )}
                {activeShot.description && (
                  <p className="text-muted max-w-md text-xs leading-relaxed md:text-sm">
                    {activeShot.description}
                  </p>
                )}
              </div>
            </div>

            {shots.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Next screenshot"
                className="btn-ghost absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-sm p-2 md:right-8"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}
