import React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  variant?: 'primary' | 'ghost'
  className?: string
  children?: React.ReactNode
}

const variants = {
  primary: clsx(
    'bg-accent text-paper tracking-[0.01em]',
    'transition-all duration-250 ease-in-out',
    'shadow-[0_1px_0_rgba(0,0,0,0.04)]',
    'hover:-translate-y-0.5',
    'hover:bg-accent-strong',
    'hover:shadow-[0_12px_30px_-12px_var(--accent)]',
  ),

  ghost: clsx(
    'border border-faint text-ink',
    'transition-all duration-250 ease-in-out',
    'hover:-translate-y-0.5',
    'hover:border-accent',
    'hover:bg-warm',
  ),
}

type Props<T extends React.ElementType = 'button'> = ButtonProps & {
  as?: T
} & Omit<React.ComponentProps<T>, keyof ButtonProps | 'as'>

export default function Button<T extends React.ElementType = 'button'>(props: Props<T>) {
  const { as, variant = 'primary', className, children, ...rest } = props

  const Component = as ?? 'button'

  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'rounded',
        'px-6 py-4 sm:px-8',
        'text-sm font-medium',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}
