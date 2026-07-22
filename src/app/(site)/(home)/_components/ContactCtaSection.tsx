'use client'

/* 📚 How to order imports:

A common convention is:

1. React/Next built-ins
2. Third-party libraries
3. Type-only imports
4. Internal absolute imports

*/

import { useRef } from 'react'
import Link from 'next/link'

import { ArrowRight, Mail } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

import type { About } from '@/sanity/types'
import { ROUTES } from '@/config/routes'

import { Section, fadeUp, containerVariants } from '@/components/ui/Section'
import { SiGithub, SiX } from 'react-icons/si'
import { BsLinkedin } from 'react-icons/bs'

type Props = {
  about: NonNullable<About>
  isOpenToWork?: boolean
}

export default function ContactCtaSection({ about }: Props) {
  const email = 'xandert.93@outlook.com'
  const isAvailable = about.isOpenToWork

  const cardRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const parallaxFast = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const prompts = [
    'a new website',
    'a web app',
    'a product idea',
    'a frontend rebuild',
    'a backend system',
    'an API integration',
    'a CMS setup',
    'a performance audit',
    'a technical consultation',
    'a side project',
  ]

  const socials = [
    { label: 'GitHub', href: 'https://github.com', icon: SiGithub },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: BsLinkedin },
    { label: 'Twitter', href: 'https://x.com', icon: SiX },
  ]

  return (
    <Section
      id="contact"
      index="05"
      glyphSide="right"
      glowSide="left"
      glowVertical="bottom"
      eyebrow="Get in touch"
      heading={
        <>
          Got a project in <span className="text-accent font-serif italic">mind</span>?
          <br />
          Let's make it real
        </>
      }
    >
      <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        {/* Copy column */}
        <motion.div variants={containerVariants} className="flex flex-col gap-8">
          <motion.div variants={fadeUp}>
            <span className="badge-open">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse-dot bg-accent absolute inline-flex h-full w-full rounded-full" />
                <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
              </span>
              {isAvailable ? 'Available for work' : 'Booking select projects'}
            </span>
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            className="border-accent text-ink relative border-l pl-5 font-serif italic"
            style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', lineHeight: 1.5 }}
          >
            The best ideas usually start as a two-line email. Send yours — a rough sketch,
            a link, a “what if” — and I'll write back.
          </motion.blockquote>

          {/* Actions */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Link href={ROUTES.contact} className="btn btn-primary group">
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={`mailto:${email}`} className="btn btn-ghost">
              Or just say hi
              <Mail className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-6 pt-2 text-[0.6rem]"
          >
            <span className="eyebrow">Elsewhere</span>
            <div className="flex items-center gap-8">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent-strong transition-all ease-out hover:-translate-y-px"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Icon className="size-5 sm:size-6" />
                    <span className="text-[0.7rem] font-medium tracking-[0.14em] uppercase">
                      {label}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Postcard column */}
        <motion.div
          ref={cardRef}
          style={{ y: parallaxFast }}
          className="relative mx-auto w-full max-w-md"
        >
          <motion.div
            variants={fadeUp}
            initial={{ rotate: 3 }}
            whileInView={{ rotate: 3 }}
            whileHover={{
              rotate: 0,
              scale: 1.02,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            }}
            className="relative origin-center"
          >
            {/* Shadow card behind */}
            <div
              aria-hidden
              className="border-faint bg-accent-light absolute inset-0 -z-10 translate-x-3 translate-y-3 rotate-[-4deg] rounded-sm border"
            />

            <div className="border-faint relative overflow-hidden rounded-sm border bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] md:p-8">
              {/* Postcard header rule */}
              <div className="border-faint flex items-center justify-between border-b pb-4">
                <span className="eyebrow text-[0.6rem]">Postcard · No. 05</span>
                <span className="text-muted font-serif text-xs italic">via airmail</span>
              </div>

              {/* Address block */}
              <div className="mt-6 flex gap-6">
                <div className="text-ink flex-1 space-y-1 font-serif text-sm italic">
                  <div className="text-muted text-[0.55rem] tracking-widest uppercase not-italic">
                    To
                  </div>
                  <div>You,</div>
                  <div>The person with the idea</div>
                  <div>Somewhere on the internet</div>
                </div>

                {/* Stamp */}
                <div className="relative">
                  <div className="border-accent relative flex h-20 w-16 items-center justify-center border-2 border-dashed p-1 text-center">
                    <div className="bg-accent-light text-accent flex h-full w-full flex-col items-center justify-center font-serif italic">
                      <span className="text-[1.4rem] leading-none">✎</span>
                      <span className="mt-1 text-[0.55rem] tracking-widest uppercase not-italic">
                        Hello
                      </span>
                    </div>
                  </div>
                  {/* Postmark */}
                  <div
                    aria-hidden
                    className="border-accent absolute top-8 -left-4 h-14 w-14 -rotate-12 rounded-full border-2 opacity-60"
                  >
                    <div className="text-accent flex h-full w-full items-center justify-center text-center font-serif text-[0.5rem] tracking-widest uppercase">
                      <span className="leading-tight">
                        Studio
                        <br />
                        2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="border-faint mt-8 border-t pt-4">
                <p className="text-ink font-serif text-sm leading-relaxed italic">
                  “Dear friend — tell me about the thing you've been putting off building.
                  No pitch deck required.”;
                </p>
                <div className="mt-6 flex items-end justify-between">
                  <span className="eyebrow text-[0.55rem]">Yours,</span>
                  <motion.svg
                    aria-hidden
                    viewBox="0 0 220 60"
                    className="text-accent h-10 w-32"
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
                      transition={{ duration: 1.8, ease: 'easeOut', delay: 0.6 }}
                    />
                  </motion.svg>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scrolling Marquee: "let's talk about ___" */}
      <motion.div
        variants={fadeUp}
        className="border-faint relative mt-16 overflow-hidden border-y py-4"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
          style={{ background: 'linear-gradient(to right, var(--paper), transparent)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
          style={{ background: 'linear-gradient(to left, var(--paper), transparent)' }}
        />
        <motion.div
          className="text-muted flex items-center gap-8 font-serif whitespace-nowrap italic"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(4)].flatMap((_, r) =>
            prompts.map((p, i) => (
              <span key={`${r}-${i}`} className="flex items-center gap-8 text-lg">
                <span>let's talk about</span>
                <span className="text-accent">{p}</span>
              </span>
            )),
          )}
        </motion.div>
      </motion.div>
    </Section>
  )
}
