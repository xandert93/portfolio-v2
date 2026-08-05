'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

import { ArrowRight, Mail } from 'lucide-react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion'

import type { About, SiteSettings } from '@/sanity/types'
import { ROUTES } from '@/config/routes'

import { Section } from '@/components/ui/Section'
import { containerVariants, fadeUp } from '@/lib/motion'
import OpenToWorkBadge from '@/components/site/OpenToWorkBadge'

import Eyebrow from '@/components/typography/Eyebrow'
import SocialLinks from '@/components/site/SocialLinks'

const PROMPTS = [
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

const VIEWPORT_ONCE = { once: true, amount: 0.7 } as const

// Card tilts/fades in first, then staggers its children (header → address → message) in behind it.
const postcardVariants: Variants = {
  hidden: { opacity: 0, y: 24, rotate: 3 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 3,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
}

// The stamp gets "pressed down" rather than faded — a small overshoot sells the physical placement.
const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
  },
}

type Props = {
  about: NonNullable<About>
  settings: NonNullable<SiteSettings>
}

export default function ContactCtaSection({ about, settings }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const parallaxFast = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <Section
      id="contact"
      glyph={{
        number: 5,
        side: 'left',
      }}
      glow={{
        side: 'right',
        vertical: 'top',
      }}
      header={{
        eyebrow: 'Get in touch',
        heading: (
          <>
            Got a project in <span className="text-accent font-serif italic">mind</span>?
            <br />
            Let's make it real
          </>
        ),
      }}
    >
      <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <Content about={about} settings={settings} />
        <Postcard cardRef={cardRef} parallaxY={parallaxFast} />
      </div>

      <MarqueeBand prompts={PROMPTS} />
    </Section>
  )
}

const Content = ({ about, settings }: Props) => {
  const { isOpenToWork } = about
  const { email, socialUrls } = settings

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="flex flex-col items-center gap-8"
    >
      <motion.div variants={fadeUp}>
        <OpenToWorkBadge isOpenToWork={isOpenToWork} />
      </motion.div>

      <motion.blockquote
        variants={fadeUp}
        className="border-accent text-ink relative border-l pl-5 font-serif italic"
        style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', lineHeight: 1.5 }}
      >
        The best ideas usually start as a two-line email. Send me a rough sketch, a link,
        a “what if” - and I promise to get back to you.
      </motion.blockquote>

      <ActionButtons email={email} />
      {socialUrls && (
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-8 pt-2 text-[0.6rem]"
        >
          <Eyebrow className="basis-full justify-center" children="Elsewhere" />
          <SocialLinks urls={socialUrls} />
        </motion.div>
      )}
    </motion.div>
  )
}

function ActionButtons({ email }: { email: string }) {
  return (
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
  )
}

const Postcard = ({
  cardRef,
  parallaxY,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>
  parallaxY: MotionValue<string>
}) => {
  return (
    <motion.div
      ref={cardRef}
      style={{ y: parallaxY }}
      className="relative mx-auto w-full max-w-md"
    >
      <motion.div
        variants={postcardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
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

        <div className="border-faint text-muted relative overflow-hidden rounded-sm border bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] md:p-8">
          <PostcardHeader />
          <PostcardAddress />
          <PostcardMessage />
        </div>
      </motion.div>
    </motion.div>
  )
}

function PostcardHeader() {
  return (
    <motion.div
      variants={fadeUp}
      className="border-faint flex items-center justify-between border-b pb-4"
    >
      <span className="eyebrow text-[0.6rem]">Postcard · No. 05</span>
      <span className="font-serif text-xs italic">via airmail</span>
    </motion.div>
  )
}

function PostcardAddress() {
  return (
    <motion.div variants={fadeUp} className="mt-6 flex gap-6">
      <div className="flex-1 space-y-1 font-serif text-sm italic">
        <div className="text-[0.55rem] tracking-widest uppercase not-italic">To</div>
        <div>You,</div>
        <div>The person with the idea</div>
        <div>Somewhere on the internet</div>
      </div>

      <PostageStamp />
    </motion.div>
  )
}

function PostageStamp() {
  return (
    <motion.div variants={stampVariants} className="relative">
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
    </motion.div>
  )
}

function PostcardMessage() {
  return (
    <motion.div variants={fadeUp} className="border-faint mt-8 border-t pt-4">
      <p className="font-serif text-sm leading-relaxed italic">
        “Dear friend — tell me about the thing you've been putting off building. No
        Powerpoint presentation required.”
      </p>
      <div className="mt-6 flex items-end justify-between">
        <span className="eyebrow text-[0.55rem]">Yours,</span>
        <Signature />
      </div>
    </motion.div>
  )
}

function Signature() {
  return (
    <motion.svg aria-hidden viewBox="0 0 220 60" className="text-accent h-10 w-32">
      <motion.path
        d="M4 40 C 30 10, 60 55, 90 25 S 150 55, 180 20 L 210 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </motion.svg>
  )
}

const MarqueeBand = ({ prompts }: { prompts: string[] }) => {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="border-faint relative mt-16 overflow-hidden border-y py-4"
    >
      <MarqueeEdgeFade side="left" />
      <MarqueeEdgeFade side="right" />

      <motion.div
        className="text-muted flex w-max items-center gap-8 font-serif text-lg italic"
        animate={{ x: isPaused ? '0%' : '-50%' }}
        transition={{
          duration: 90,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8">
            {prompts.map((prompt) => (
              <span
                key={`${copy}-${prompt}`}
                className="flex shrink-0 items-center gap-8"
              >
                <span>let's talk about</span>
                <span className="text-accent">{prompt}</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function MarqueeEdgeFade({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 z-10 w-16 ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      style={{
        background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, var(--paper), transparent)`,
      }}
    />
  )
}
