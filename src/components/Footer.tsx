import { SiteSettings } from '@/sanity/types'

import { Heart, Mail } from 'lucide-react'
import { SiGithub, SiWhatsapp, SiX } from 'react-icons/si'
import { BsLinkedin } from 'react-icons/bs'

type Props = {
  settings: NonNullable<SiteSettings>
}

export default async function Footer({ settings }: Props) {
  const { names, socialUrls, phone, hasWhatsApp, email } = settings

  const year = new Date().getFullYear()

  const socials = [
    socialUrls?.github && {
      href: socialUrls.github,
      label: 'GitHub',
      icon: SiGithub,
    },
    socialUrls?.linkedin && {
      href: socialUrls.linkedin,
      label: 'LinkedIn',
      icon: BsLinkedin,
    },
    phone &&
      hasWhatsApp && {
        href: `https://wa.me/${phone.replace(/\D/g, '')}`,
        label: 'WhatsApp',
        icon: SiWhatsapp,
      },
    email && {
      href: `mailto:${email}`,
      label: 'Email',
      icon: Mail,
    },
    socialUrls?.twitter && {
      href: socialUrls.twitter,
      label: 'Twitter / X',
      icon: SiX,
    },
  ].filter(Boolean)

  return (
    <footer className="border-faint border-t">
      <div className="container flex flex-col gap-8 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Wordmark */}
          <span className="text-ink font-serif text-lg italic">
            {names.display || names.full}
          </span>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="text-muted hover:text-accent-strong transition-all ease-out hover:-translate-y-0.25"
              >
                <Icon className="size-5 sm:size-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-faint flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          {names && names.full && (
            <p className="text-muted text-[0.7rem]">
              © {year} {names.full}. All rights reserved.
            </p>
          )}
          <p className="text-muted flex items-start gap-1 text-[0.7rem]">
            Built with Next.js & Sanity{' '}
            <Heart
              className="text-accent-strong fill-accent-strong"
              width={14}
              height={14}
            />
          </p>
        </div>
      </div>
    </footer>
  )
}
