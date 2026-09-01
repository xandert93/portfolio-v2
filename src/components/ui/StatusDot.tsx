import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Props = HTMLAttributes<HTMLSpanElement> & {
  color?: string
  ping?: boolean
}

export default function StatusDot({
  color = 'bg-accent',
  ping = true,
  className,
  ...props
}: Props) {
  return (
    <span className={clsx('relative size-1.5', className)} {...props}>
      {ping && (
        <span
          className={clsx('absolute inset-0 animate-ping rounded-full opacity-60', color)}
        />
      )}
      <span className={clsx('absolute inset-0 rounded-full', color)} />
    </span>
  )
}
