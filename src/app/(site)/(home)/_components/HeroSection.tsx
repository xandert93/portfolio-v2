'use client'

import { genImageBuilder } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import type { About, SiteSettings } from '@/sanity/types'
import { ROUTES } from '@/config/routes'
import { motion } from 'framer-motion'

type Props = {
  settings: NonNullable<SiteSettings>
  about: NonNullable<About>
}

export default function HeroSection({ settings, about }: Props) {
  return (
    <section className="relative flex min-h-[calc(100vh-var(--navbar-h-mobile))] items-center md:min-h-[calc(100vh-var(--navbar-h))]">
      {/* Desktop full-bleed photo, anchored right, behind the text */}
      <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block">
        <DesktopHeroVisual />
      </div>
      {/* Mobile background image with overlay. MobileHeroContent superimposes it */}
      <div className="absolute inset-0 md:hidden">
        <MobileHeroVisual />
        <MobileHeroVisualOverlay />
      </div>
      {/* Content container */}
      <div className="relative z-10 w-full px-8 py-16 md:px-20">
        <div className="mx-auto hidden max-w-6xl md:block">
          <HeroContent />
        </div>
        <MobileHeroContent />
      </div>
    </section>
  )

  function DesktopHeroVisual() {
    const url = genImageBuilder(about.avatar).url()
    if (!url) return <div className="bg-warm absolute inset-0" />

    return (
      <div className="relative h-full w-full">
        <Image
          src={url || '/placeholder.svg'}
          alt="Profile photo"
          fill
          className="object-cover object-[75%_20%]"
          priority
          sizes="(min-width: 768px) 58vw, 0px"
        />
        <div
          aria-hidden
          className="from-paper via-paper/40 absolute inset-0 w-1/3 bg-linear-to-r to-transparent"
        />
        <div
          aria-hidden
          className="from-paper/30 absolute inset-0 bg-linear-to-t via-transparent to-transparent"
        />
      </div>
    )
  }

  function MobileHeroVisual() {
    const url = genImageBuilder(about.avatar).url()
    if (!url) return <div className="absolute inset-0 bg-[#15141a]" />

    return (
      <Image
        src={url || '/placeholder.svg'}
        alt=""
        fill
        className="object-cover object-[62%_15%]"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    )
  }

  function MobileHeroVisualOverlay() {
    return (
      <div className="from-paper/40 via-paper/80 to-paper absolute inset-0 bg-linear-to-b" />
    )
  }

  function OpenToWorkBadge() {
    return (
      <div className="text-accent border-accent/40 bg-accent-light relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-1.5 text-[0.65rem] tracking-widest uppercase">
        <span className="relative flex h-1.5 w-1.5">
          <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
          <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
        </span>
        Available for Work
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg]"
          style={{
            background:
              'linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 30%, transparent), transparent)',
          }}
          animate={{ x: ['0%', '400%'] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1.4,
          }}
        />
      </div>
    )
  }

  function Tagline() {
    return (
      <div className="[&_em]:text-accent font-serif text-5xl leading-[1.08] md:text-6xl md:leading-[1.04] [&_em]:font-medium [&_em]:italic">
        <PortableText value={settings.hero?.tagline ?? []} />
      </div>
    )
  }

  function Heading() {
    return (
      <p className="text-muted font-sans leading-relaxed font-light md:max-w-md">
        {settings.hero?.heading}
      </p>
    )
  }

  function ProjectsLink() {
    return (
      <Link href={ROUTES.projects} className="btn btn-primary">
        View my work ↗
      </Link>
    )
  }

  function ContactLink() {
    return (
      <Link href={ROUTES.contact} className="btn btn-ghost">
        Get in touch ➤
      </Link>
    )
  }

  function HeroContent() {
    return (
      <div className="flex max-w-xl flex-col items-start gap-8">
        {about.isOpenToWork && <OpenToWorkBadge />}
        <Tagline />
        <Heading />
        <div className="flex gap-4">
          <ProjectsLink />
          <ContactLink />
        </div>
      </div>
    )
  }

  function MobileHeroContent() {
    return (
      <div className="flex flex-col items-center gap-8 text-center md:hidden">
        <div>{about.isOpenToWork && <OpenToWorkBadge />}</div>
        <Tagline />
        <Heading />
        <div className="flex justify-center gap-4">
          <ProjectsLink />
          <ContactLink />
        </div>
      </div>
    )
  }
}
