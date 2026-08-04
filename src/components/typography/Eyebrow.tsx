import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function Eyebrow({ children, className = '' }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-[0.6rem]',
        'text-accent font-sans text-[0.65rem] font-medium tracking-[0.2em] uppercase',
        "before:bg-accent before:h-px before:w-7 before:opacity-60 before:content-['']",
        className,
      )}
    >
      {children}
    </span>
  )
}
