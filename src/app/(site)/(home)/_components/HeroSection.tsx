import { genImageBuilder } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import {
  ABOUT_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from '../../../../../sanity.types'
import { PortableText } from 'next-sanity'

type Props = {
  settings: SITE_SETTINGS_QUERY_RESULT
  about: ABOUT_QUERY_RESULT
}

const navbarHeight = 90

export default function HeroSection({ settings, about }: Props) {
  if (!settings) return 'Add Settings to Sanity'
  if (!about) return 'Add About to Sanity'

  return (
    <section
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
      className="relative flex items-center overflow-hidden"
    >
      {/* Desktop full-bleed photo, anchored right, behind the text */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[58%]">
        <DesktopHeroVisual />
      </div>

      {/* Mobile background image with overlay. MobileHeroContent superimposes it */}
      <div className="md:hidden absolute inset-0">
        <MobileHeroVisual />
        <MobileHeroVisualOverlay />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full md:px-20 px-8 py-16">
        <div className="hidden md:block max-w-6xl mx-auto">
          <HeroContent />
        </div>
        <MobileHeroContent />
      </div>
    </section>
  )

  function DesktopHeroVisual() {
    if (!about?.avatar) return <div className="absolute inset-0 bg-warm" />

    return (
      <div className="relative w-full h-full">
        <Image
          src={genImageBuilder(about.avatar)
            .width(1600)
            .height(2000)
            .fit('crop')
            .auto('format')
            .quality(100)
            .url()}
          alt={'Profile photo'}
          fill
          // Anchored toward the top so the face stays in frame as the
          // container gets shorter/wider at different desktop breakpoints.
          // Tune the % if your crop centres the face elsewhere.
          className="object-cover object-[75%_20%]"
          priority
          sizes="(min-width: 768px) 58vw, 0px"
        />
        {/* Left-edge fade so the photo blends into the dark background
            instead of reading as a hard-edged card */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-paper via-paper/40 to-transparent w-1/3"
        />
        {/* Subtle overall darken so light text on the right side of the
            photo stays legible if the headline ever runs long */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-paper/30 via-transparent to-transparent"
        />
      </div>
    )
  }

  function MobileHeroVisual() {
    if (!about?.avatar) return <div className="absolute inset-0 bg-[#15141a]" />

    return (
      <Image
        src={genImageBuilder(about.avatar)
          .width(1200)
          .height(1600)
          .fit('crop')
          .auto('format')
          .quality(95)
          .url()}
        alt=""
        fill
        // Tighter portrait crop on mobile (3:4 source) with the face
        // anchored near the top third rather than dead-centre, since
        // centre-cropping a portrait tends to cut off the top of the head.
        className="object-cover object-[50%_15%]"
        priority
        sizes="100vw"
      />
    )
  }

  function MobileHeroVisualOverlay() {
    return (
      <div className="absolute inset-0 bg-linear-to-b from-paper/40 via-paper/80 to-paper" />
    )
  }

  function OpenToWorkBadge() {
    return (
      <div className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-accent border border-accent/40 bg-accent-light px-4 py-1.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Open to work
      </div>
    )
  }

  function Tagline() {
    // return (
    // <p className="font-serif md:text-6xl text-5xl md:leading-[1.04] leading-[1.08]">
    //   Code with <em className="italic text-accent font-medium">craft</em>.
    //   <br />
    //   Built to <em className="italic text-accent font-medium">last</em>.
    // </p>
    // )

    return (
      <div
        className="font-serif md:text-6xl text-5xl md:leading-[1.04] leading-[1.08]
    [&_em]:italic [&_em]:text-accent [&_em]:font-medium"
      >
        <PortableText value={settings?.hero?.tagline} />
      </div>
    )
  }

  function Heading() {
    return (
      <h1 className="text-base text-muted leading-relaxed md:max-w-md font-light">
        {settings?.hero?.heading}
      </h1>
    )
  }

  function ProjectsLink() {
    return (
      <Link
        href="/projects"
        className="text-sm font-normal md:px-8 px-6 py-3.5 bg-accent text-paper rounded hover:opacity-90 transition-opacity"
      >
        View my work ↗
      </Link>
    )
  }

  function ContactLink() {
    return (
      <Link
        href="/contact"
        className="text-sm font-medium md:px-8 px-6 py-3.5 border border-faint text-ink rounded hover:bg-warm transition-colors"
      >
        Get in touch ➤
      </Link>
    )
  }

  function HeroContent() {
    return (
      <div className="flex flex-col gap-8 items-start max-w-xl">
        {about?.isOpenToWork && <OpenToWorkBadge />}
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
      <div className="md:hidden flex flex-col gap-8 text-center">
        <div>{about?.isOpenToWork && <OpenToWorkBadge />}</div>
        <Tagline />
        <Heading />
        <div className="flex gap-4 justify-center">
          <ProjectsLink />
          <ContactLink />
        </div>
      </div>
    )
  }
}
