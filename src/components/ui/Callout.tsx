import clsx from 'clsx'

type CalloutVariant = 'accent' | 'info' | 'success' | 'warning' | 'danger'

const variantStyles: Record<CalloutVariant, string> = {
  accent: 'border-accent/30 bg-accent-light/40',
  info: 'border-blue-500/30 bg-blue-500/5',
  success: 'border-green-500/30 bg-green-500/5',
  warning: 'border-yellow-500/30 bg-yellow-500/5',
  danger: 'border-red-500/30 bg-red-500/5',
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant
}

export default function Callout({
  variant = 'accent',
  className,
  children,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        'rounded py-5 pr-5 pl-6',
        'border-l-2',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
