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
