import { Variants } from 'framer-motion'

export const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }, // staggerChildren staggers variant-controlled descendant motion components in the parent's variant tree, even if they're separated by regular DOM elements. Where it does stop is at another motion component that controls its own animation.
}

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

// Used when prefers-reduced-motion is set — keeps the stagger timing
// (so groups still reveal in order) but drops the y-offset and shortens duration
export const fadeUpReduced: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * fadeUp/fadeUpReduced with an extra per-item delay baked into the
 * "visible" transition. Used by grid/row items that each observe their
 * *own* scroll position independently (via `whileInView` on the item
 * itself, not a shared stagger container) — see the note on
 * ProjectSection's `<AnimatedCard>` usage. A shared stagger container
 * (`staggerChildren`) fires once, on a timer, from the moment it first
 * enters view; for a list taller than the viewport that timer completes
 * long before the reader has scrolled to the later items, so they just
 * appear already-visible instead of animating in. Giving each item its
 * own trigger fixes that; this delay only adds a small, deliberate offset
 * so items in the same row don't all pop in at once.
 */
export function fadeUpStagger(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
    },
  }
}

export function fadeUpStaggerReduced(delay: number): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut', delay } },
  }
}
