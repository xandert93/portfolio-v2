'use client'

import { forwardRef, useRef, useState } from 'react'
import Image from 'next/image'

import { PortableText } from '@portabletext/react'

import { motion, useScroll, useTransform, type Variants } from 'framer-motion'

import { genImageBuilder } from '@/sanity/lib/image'

import { Section } from '@/components/ui/Section'
import { ArrowLink } from '@/components/links/ArrowLink'
import { ROUTES } from '@/config/routes'
import { About } from '@/sanity/types'
import { containerVariants, fadeUp } from '@/lib/motion'

type Props = {
  about: NonNullable<About>
}

export default function AboutSection({ about }: Props) {
  const { headline, galleryImages, bio, interests, quickFacts } = about

  const galleryRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const imageReveal: Variants = {
    hidden: { opacity: 0, scale: 0.94, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <Section
      id="about"

      glyph={{ number: 4, side: 'right' }}
      glow={{ side: 'left', vertical: 'top' }}
      header={{
        eyebrow: 'About me',
        heading: (
          <PortableText
            value={headline}
            components={{
              // Render just as plain text:
              block: ({ children }) => children,
              // Override styling for anything wrapped in <em>:
              marks: {
                em: ({ children }) => <em className="text-accent">{children}</em>,
              },
            }}
          />
        ),
      }}
    >
      <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        {/* Polaroid Gallery */}
        <motion.div
          ref={galleryRef}
          style={{ y: parallaxY }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-4/5">
            {galleryImages.length > 0 &&
              [
                {
                  index: 2,
                  rotate: -7,
                  offset: 'left-2 top-6',
                  z: 10,
                },
                {
                  index: 1,
                  rotate: 5,
                  offset: 'right-2 top-2',
                  z: 20,
                },
                {
                  index: 0,
                  rotate: -1.5,
                  offset: 'inset-x-6 top-10',
                  z: 30,
                  primary: true,
                },
              ].map(({ index, rotate, offset, z, primary }) => {
                const image = galleryImages[index]

                if (!image) return null

                return (
                  <Polaroid
                    key={index}
                    image={image}
                    rotate={rotate}
                    offset={offset}
                    z={z}
                    variants={imageReveal}
                    primary={primary}
                  />
                )
              })}

            {/* Signature scribble */}
            <motion.svg
              aria-hidden
              variants={fadeUp}
              viewBox="0 0 220 60"
              className="text-accent absolute right-4 -bottom-6 h-12 w-40"
            >
              <motion.path
                d="M4 40 C 30 10, 60 55, 90 25 S 150 55, 180 20 L 210 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.4 }}
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Copy column */}
        <motion.div variants={containerVariants} className="flex flex-col gap-8">
          <motion.blockquote
            variants={fadeUp}
            className="border-accent text-ink relative border-l pl-5 font-serif italic"
            style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', lineHeight: 1.5 }}
          >
            I build things on the web that feel considered — the kind you'd want to
            revisit, not just click through.
          </motion.blockquote>

          <motion.div
            variants={fadeUp}
            className="text-muted [&_strong]:text-accent flex flex-col gap-2 text-base leading-loose font-light [&_strong]:font-medium"
          >
            <PortableText value={bio} />
          </motion.div>

          {/* Quick Facts grid */}
          <motion.dl
            variants={containerVariants}
            className="border-faint grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6"
          >
            {quickFacts.map(({ label, value }) => (
              <motion.div key={label} variants={fadeUp} className="flex flex-col gap-1">
                <dt className="eyebrow text-[0.6rem]">{label}</dt>
                <dd className="text-ink font-serif text-sm italic">{value}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div variants={fadeUp}>
            <ArrowLink href={ROUTES.about} children="Read My Story" />
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee ticker */}
      <Marquee>{interests}</Marquee>
    </Section>
  )
}

const Polaroid = ({
  image,
  rotate,
  offset,
  z,
  variants,
  primary,
}: {
  image: NonNullable<About>['galleryImages'][number]
  rotate: number
  offset: string
  z: number
  variants: Variants
  primary?: boolean
}) => {
  const url = genImageBuilder(image).url()

  return (
    <motion.figure
      variants={variants}
      initial={{ rotate }}
      style={{ zIndex: z, transformPerspective: 1200 }}
      whileHover={{ y: -18, rotate: rotate * 0.25, scale: 1.045, zIndex: 50 }}
      whileTap={{
        y: -10,
        scale: 0.985,
        transition: { type: 'spring', stiffness: 400, damping: 28 },
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.7 }}
      className={`group absolute ${offset} ${
        primary ? 'w-[78%]' : 'w-[60%]'
      } cursor-pointer will-change-transform select-none`}
    >
      <div className="relative overflow-hidden rounded-[3px] border border-black/5 bg-[#faf9f6] p-2.5 pb-11 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] transition-shadow duration-300 ease-out group-hover:shadow-[0_32px_64px_-20px_rgba(0,0,0,0.28),0_12px_24px_-12px_rgba(0,0,0,0.12)]">
        {/* subtle paper sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-[3px] bg-linear-to-b from-white/40 to-transparent" />

        <div className="relative aspect-4/5 overflow-hidden rounded-[1px]">
          <Image
            src={url || '/placeholder.svg'}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            style={{ filter: 'contrast(1.03) saturate(1.05)' }}
          />
          {/* soft vignette on hover for depth */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <figcaption className="text-muted absolute inset-x-0 bottom-2 text-center font-serif text-xs italic">
          {image.caption}
        </figcaption>
      </div>
    </motion.figure>
  )
}

const Marquee = ({ children }: { children: string[] }) => {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      className="border-faint relative mt-16 overflow-hidden border-y py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{
          background: 'linear-gradient(to right, var(--paper), transparent)',
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
        style={{
          background: 'linear-gradient(to left, var(--paper), transparent)',
        }}
      />

      <motion.div
        className="flex w-max gap-3"
        animate={{ x: isPaused ? '0%' : '-50%' }}
        transition={{
          duration: 40,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3">
            {children.map((tag) => (
              <span
                key={`${copy}-${tag}`}
                className="bg-accent-light border-accent/20 text-accent shrink-0 rounded-sm border px-3.5 py-2 text-[0.65rem] tracking-wide uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
