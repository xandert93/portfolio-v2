import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'

import { ROUTES } from '@/config/routes'

type Props = {
  title: string
  slug: string
  /** 'lg' is the wide featured card; 'md' (default) is the standard grid card. */
  size?: 'md' | 'lg'
}

/**
 * Card title. The <Link> carries `before:absolute before:inset-0`, which is
 * what makes the whole card clickable (a "stretched link") without nesting
 * anchors inside the card.
 */
export default function ProjectCardTitle({ title, slug, size = 'md' }: Props) {
  return (
    <h3
      className={clsx(
        'font-serif italic',
        size === 'lg' ? 'text-2xl leading-tight md:text-3xl' : 'text-2xl leading-snug',
      )}
    >
      <Link
        href={`${ROUTES.projects}/${slug}`}
        className="group-hover:text-accent flex items-start gap-1 transition-colors before:absolute before:inset-0 before:content-['']"
      >
        <span>{title}</span>
        <ArrowUpRight
          className={clsx(
            'text-muted group-hover:text-accent shrink-0 self-start transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            size === 'lg' ? 'size-5' : 'mt-1.5 size-4',
          )}
        />
      </Link>
    </h3>
  )
}
