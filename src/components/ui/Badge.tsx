import type { ReactNode } from 'react'

import clsx from 'clsx'

type Props = {
  children: ReactNode
  className?: string
}

export function Badge({ children, className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2',
        'text-[0.65rem] font-medium tracking-[0.16em] uppercase',
        'text-accent',
        'border-accent-dim border',
        'bg-accent-dim',
        'rounded-full px-4 py-1.5',
        className,
      )}
    >
      {children}
    </span>
  )
}
