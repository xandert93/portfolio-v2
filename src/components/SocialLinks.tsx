import { motion } from 'framer-motion'
import Eyebrow from './typography/Eyebrow'
import { fadeUp } from '@/lib/motion'

import { SiteSettings } from '@/sanity/types'
import { IconType } from 'react-icons'

import { SiGithub, SiX, SiStackoverflow } from 'react-icons/si'
import { BsLinkedin } from 'react-icons/bs'
import clsx from 'clsx'

type Urls = NonNullable<NonNullable<SiteSettings>['socialUrls']>

type SocialUrlKey = keyof Urls

const icons = {
  github: SiGithub,
  twitter: SiX,
  linkedin: BsLinkedin,
  stackoverflow: SiStackoverflow,
} satisfies Record<SocialUrlKey, IconType>

type Props = { urls: Urls; className?: string }

export default function SocialLinks({ urls, className }: Props) {
  return (
    <div className={clsx('flex items-center gap-8', className)}>
      {(Object.entries(urls) as [SocialUrlKey, string | undefined][]).map(
        ([name, href]) => {
          const Icon = icons[name]

          if (!Icon || !href) return null

          return (
            <a
              key={name}
              href={href}
              aria-label={name}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent-strong transition-all ease-out hover:-translate-y-px"
            >
              <div className="flex flex-col items-center gap-3">
                <Icon className="size-5 sm:size-6" />
                <span className="inline-block max-w-[8ch] truncate text-[0.7rem] font-medium tracking-[0.14em] uppercase">
                  {name}
                </span>
              </div>
            </a>
          )
        },
      )}
    </div>
  )
}
