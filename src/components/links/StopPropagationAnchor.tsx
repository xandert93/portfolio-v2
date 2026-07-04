'use client'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>

export function StopPropagationAnchor({ onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
    />
  )
}
