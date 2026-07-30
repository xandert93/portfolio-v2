import { motion } from 'framer-motion'

type Props = {
  isAvailable: boolean
}

export default function OpenToWorkBadge({ isAvailable }: Props) {
  return (
    <div className="text-accent border-accent/40 bg-accent-light relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-1.5 text-[0.65rem] tracking-widest uppercase">
      <AvailabilityDot />
      {isAvailable ? 'Available for work' : 'Booking select projects'}
      <Shimmer />
    </div>
  )
}

const AvailabilityDot = () => {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
      <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
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
