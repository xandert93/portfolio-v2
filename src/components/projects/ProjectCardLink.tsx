import clsx from 'clsx'

import { StopPropagationAnchor } from '../links/StopPropagationAnchor'

type Props = {
  className?: string
  href: string
  children: React.ReactNode
}

export default function ProjectCardLink({ className, ...props }: Props) {
  return (
    <StopPropagationAnchor
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'group inline-flex items-center gap-1.5',
        'text-muted hover:text-accent',
        'text-2xs tracking-widest uppercase',
        'transition-colors duration-200',
        className,
      )}
      {...props}
    />
  )
}
