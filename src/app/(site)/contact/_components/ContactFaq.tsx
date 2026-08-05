'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { containerVariants, fadeUp, fadeUpReduced } from '@/lib/motion'
import { Faq } from '@/sanity/types'

const FAQS = [
  {
    question: 'How quickly will I hear back?',
    answer:
      'Usually within one to two working days. If it has been longer than that, the message may have gone astray — email me directly and it will get through.',
  },
  {
    question: 'Do you take on small jobs?',
    answer:
      'Yes. Landing pages, performance work, CMS setups and audits are all fair game alongside larger builds.',
  },
  {
    question: 'What do you need from me to quote?',
    answer:
      'A rough scope, an idea of timing, and any existing site or designs. I can work from a one-line idea too — it just means more questions first.',
  },
  {
    question: 'What do you build with?',
    answer:
      'Mostly Next.js, TypeScript and Tailwind, with Sanity for content. I am happy to work inside an existing stack where that makes more sense.',
  },
]

type Props = {
  faq: NonNullable<Faq>
}

export default function ContactFaq({ faq }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? fadeUpReduced : fadeUp

  return (
    <motion.ul
      className="border-faint border-t"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {faq.items?.map(({ question, answer }, i) => {
        const isOpen = open === i
        return (
          <motion.li key={question} variants={item} className="border-faint border-b">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-ink group-hover:text-accent font-serif text-lg italic transition-colors duration-200 md:text-xl">
                  {question}
                </span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="border-faint text-accent group-hover:border-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M5.5 1V10M1 5.5H10"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-muted max-w-2xl pb-6 text-sm leading-relaxed font-light">
                    {answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
