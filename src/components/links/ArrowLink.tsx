import { ComponentProps } from 'react'

import Link from 'next/link'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'

type Props = ComponentProps<typeof Link> & {
  children: React.ReactNode
}

export const ArrowLink = ({ children, className, ...props }: Props) => {
  return (
    <Link
      {...props}
      className={clsx('link-underline group inline-flex items-start gap-0.5', className)}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-px" />
    </Link>
  )
}
