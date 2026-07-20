import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { ComponentProps } from 'react'

type Props = ComponentProps<typeof Link> & {
  children: React.ReactNode
}

const ArrowLink = ({ children, className = '', ...props }: Props) => {
  return (
    <Link
      {...props}
      className={`link-underline group inline-flex items-start gap-0.5 ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.25" />
    </Link>
  )
}

export default ArrowLink
