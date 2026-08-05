'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { SiWhatsapp } from 'react-icons/si'
import { Mail, Phone } from 'lucide-react'

import { containerVariants, fadeUp, fadeUpReduced } from '@/lib/motion'
import { genImageBuilder } from '@/sanity/lib/image'
import type { About } from '@/sanity/generated-types'

import Eyebrow from '../../../../components/typography/Eyebrow'
import OpenToWorkBadge from '../../../../components/site/OpenToWorkBadge'
import SocialLinks from '@/components/site/SocialLinks'

const processSteps = [
  {
    title: 'You send the brief',
    body: 'Anything you already know - goals, deadlines, links or even half-formed ideas.',
  },
  {
    title: 'I reply within 1 – 2 days',
    body: 'Receive my honest feedback, questions and a rough sense of scope and cost.',
  },
  {
    title: 'Together, we scope it properly',
    body: 'A short call, then a written proposal with phases, timings and price.',
  },
]

type Props = {
  name?: string
  avatar?: About['avatar']
  isOpenToWork?: boolean
  email?: string
  phone?: string
  hasWhatsApp?: boolean
  socialUrls?: {
    github?: string
    linkedin?: string
    twitter?: string
    stackoverflow?: string
  }
}

export default function ContactAside({
  name,
  avatar,
  isOpenToWork,
  email,
  phone,
  hasWhatsApp,
  socialUrls,
}: Props) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? fadeUpReduced : fadeUp

  const avatarUrl = avatar
    ? genImageBuilder(avatar).width(160).height(160).fit('crop').url()
    : null

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col gap-8 md:sticky md:top-[calc(var(--navbar-h)+2.5rem)]"
    >
      {avatarUrl && (
        <motion.div variants={item} className="flex items-center gap-4">
          <span className="border-accent-dim relative h-16 w-16 shrink-0 overflow-hidden rounded-full border">
            <Image
              src={avatarUrl}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </span>
          <div className="min-w-0">
            {name && <p className="text-ink font-serif text-lg italic">{name}</p>}
            {typeof isOpenToWork === 'boolean' && (
              <div className="mt-1.5">
                <OpenToWorkBadge isOpenToWork={isOpenToWork} />
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div variants={item}>
        <Eyebrow className="mb-8">What happens next</Eyebrow>
        <ProcessSteps />
      </motion.div>

      {(email || phone) && (
        <motion.div variants={item}>
          <Eyebrow className="mb-8">Prefer a direct line?</Eyebrow>

          <div className="flex flex-col gap-4">
            {email && (
              <DirectContactCardLink
                href={`mailto:${email}`}
                label="Email"
                value={email}
                icon={<Mail className="h-5 w-5" />}
              />
            )}

            {phone && (
              <DirectContactCardLink
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                label="Call"
                value={phone}
                icon={<Phone className="h-5 w-5" />}
              />
            )}

            {phone && hasWhatsApp && (
              <DirectContactCardLink
                href={`https://wa.me/${phone.replace(/[^\d]/g, '')}`}
                label="WhatsApp"
                value="Start a conversation →"
                icon={<SiWhatsapp className="h-5 w-5" />}
                external
              />
            )}
          </div>
        </motion.div>
      )}

      {socialUrls && (
        <motion.div variants={item}>
          <Eyebrow className="mb-8">Elsewhere</Eyebrow>
          <SocialLinks urls={socialUrls} className="flex-wrap justify-center" />
        </motion.div>
      )}
    </motion.aside>
  )
}

const ProcessSteps = () => {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? fadeUpReduced : fadeUp

  return (
    <ol className="flex flex-col gap-6">
      {processSteps.map((s, i) => (
        <motion.li key={s.title} variants={item} className="flex gap-4">
          <span
            aria-hidden
            className="text-accent border-accent-dim bg-accent-light mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-serif text-xs italic"
          >
            {i + 1}
          </span>
          <div>
            <h3 className="text-ink font-serif text-lg italic">{s.title}</h3>
            <p className="text-muted mt-1.5 text-sm leading-relaxed font-light">
              {s.body}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

type DirectContactCardLinkProps = {
  href: string
  label: string
  value: string
  icon: React.ReactNode
  external?: boolean
}

const DirectContactCardLink = ({
  href,
  label,
  value,
  icon,
  external = false,
}: DirectContactCardLinkProps) => {
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="card group flex items-center gap-4 p-5"
    >
      <span className="bg-accent-dim text-accent flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="text-muted block text-[0.65rem] font-medium tracking-[0.16em] uppercase">
          {label}
        </span>
        <span className="text-ink group-hover:text-accent block truncate text-sm font-medium transition-colors">
          {value}
        </span>
      </span>
    </a>
  )
}
