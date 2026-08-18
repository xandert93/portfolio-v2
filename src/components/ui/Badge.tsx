import type { ReactNode } from 'react'

import { motion } from 'framer-motion'
import clsx from 'clsx'

type Props = {
  children: ReactNode
  className?: string
}

const Badge = ({ children, className }: Props) => {
  return (
    <span
      className={clsx(
        'relative inline-flex items-center gap-2 overflow-hidden',
        'rounded-full border px-4 py-1.5',
        'border-accent/40 bg-accent-light text-accent',
        'text-[0.65rem] tracking-widest uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

const Shimmer = () => {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg]"
      style={{
        background:
          'linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 30%, transparent), transparent)',
      }}
      animate={{ x: ['0%', '400%'] }}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatDelay: 1.4,
      }}
    />
  )
}

Badge.Shimmer = Shimmer

export default Badge
