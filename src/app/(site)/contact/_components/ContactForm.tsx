'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SendHorizontal } from 'lucide-react'

import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'
import { BUDGETS, PROJECT_TYPES, REFERRALS, TIMELINES } from '@/lib/contact-options'

const MESSAGE_MAX = 2000

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputClasses =
  'text-ink placeholder:text-muted/70 w-full border-b border-faint bg-transparent pb-2.5 pt-1 text-sm font-light outline-none transition-colors duration-200 focus:border-accent'

const labelClasses = 'text-sm text-muted tracking-wider uppercase'

// Deliberately outside the label's typographic voice: no uppercase, no wide
// tracking (letter-spacing inherits from the parent, which is what made the
// old inline "(optional)" look shouted), and pulled to the opposite edge so
// it reads as a quiet aside rather than a second label.
const optionalTagClasses =
  'text-muted/50 shrink-0 font-serif text-[0.7rem] italic tracking-normal normal-case'

/* ── Field config ────────────────────────────────────────────
   Data-driven so the repeated "grid row of 1-2 fields" markup
   only has to be written once, in the renderer below. Fields
   are grouped into rows exactly as they should lay out.
   ─────────────────────────────────────────────────────────── */
type InputFieldDef = {
  kind: 'input'
  name: string
  label: string
  type: string
  optional?: boolean
  required?: boolean
  maxLength?: number
  autoComplete?: string
  inputMode?: 'tel' | 'url'
  placeholder: string
}

type DropdownFieldDef = {
  kind: 'dropdown'
  name: string
  label: string
  optional?: boolean
  required?: boolean
  placeholderLabel: string
  options: readonly DropdownOption[]
}

type FieldDef = InputFieldDef | DropdownFieldDef

const FIELD_ROWS: FieldDef[][] = [
  [
    {
      kind: 'input',
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      maxLength: 100,
      autoComplete: 'name',
      placeholder: 'Michael Smith',
    },
    {
      kind: 'input',
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      maxLength: 255,
      autoComplete: 'email',
      placeholder: 'm.smith@example.com',
    },
  ],
  [
    {
      kind: 'input',
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      optional: true,
      maxLength: 30,
      inputMode: 'tel',
      autoComplete: 'tel',
      placeholder: '+44 7700 900123',
    },
    {
      kind: 'input',
      name: 'organisation',
      label: 'Company',
      type: 'text',
      optional: true,
      maxLength: 120,
      autoComplete: 'organization',
      placeholder: 'Studio, agency or team',
    },
  ],
  [
    {
      kind: 'input',
      name: 'website',
      label: 'Current site',
      type: 'url',
      optional: true,
      maxLength: 255,
      inputMode: 'url',
      autoComplete: 'url',
      placeholder: 'https://www.mysite.co.uk',
    },
  ],
  [
    {
      kind: 'dropdown',
      name: 'projectType',
      label: 'Project type',
      required: true,
      placeholderLabel: 'Select one',
      options: PROJECT_TYPES,
    },
    {
      kind: 'dropdown',
      name: 'timeline',
      label: 'Timeline',
      optional: true,
      placeholderLabel: 'No fixed date',
      options: TIMELINES,
    },
  ],
  [
    {
      kind: 'dropdown',
      name: 'budget',
      label: 'Budget',
      optional: true,
      placeholderLabel: 'Not sure yet',
      options: BUDGETS,
    },
    {
      kind: 'dropdown',
      name: 'referral',
      label: 'How did you find me',
      optional: true,
      placeholderLabel: 'Prefer not to say',
      options: REFERRALS,
    },
  ],
]

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errMessage, setErrMessage] = useState('')
  const [messageLength, setMessageLength] = useState(0)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setStatus('loading')
    setErrMessage('')

    const data = Object.fromEntries(new FormData(form).entries())

    // Honeypot — bots tend to fill every field
    if (data.company) {
      setStatus('success')
      form.reset()
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setMessageLength(0)
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') return <SuccessPanel onReset={() => setStatus('idle')} />

  const isLoading = status === 'loading'

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      {/* Honeypot — hidden from real users */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset disabled={isLoading} className="space-y-7 disabled:opacity-60">
        <legend className="sr-only">Enquiry details</legend>

        {FIELD_ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            {row.map((field) => (
              <Field
                key={field.name}
                htmlFor={field.name}
                label={field.label}
                optional={field.optional}
              >
                {field.kind === 'input' ? (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    maxLength={field.maxLength}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    placeholder={field.placeholder}
                    className={inputClasses}
                  />
                ) : (
                  <Dropdown
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholderLabel={field.placeholderLabel}
                    options={field.options}
                  />
                )}
              </Field>
            ))}
          </div>
        ))}

        <Field htmlFor="message" label="Message">
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={MESSAGE_MAX}
            onChange={(e) => setMessageLength(e.target.value.length)}
            placeholder='What are you building, who is it for and what does "done" look like?'
            className={`${inputClasses} resize-none`}
          />
          <div className="text-2xs text-muted/70 mt-2 flex justify-end tabular-nums">
            {messageLength} / {MESSAGE_MAX}
          </div>
        </Field>

        <Field>
          <label className="text-muted flex cursor-pointer items-center gap-3 text-xs leading-relaxed font-light">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              required
              className="border-faint text-accent accent-accent mt-0.5 h-3.5 w-3.5 shrink-0 rounded-xs"
            />
            <span>
              I consent to my details being stored for the purpose of responding to this
              enquiry. <br />
              My information will not be shared with third parties.
            </span>
          </label>
        </Field>
      </fieldset>

      <AnimatePresence initial={false}>
        {status === 'error' && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden text-sm text-red-500"
          >
            {errMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full max-w-50 justify-center"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="bg-paper h-1.5 w-1.5 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </span>
              Sending
            </span>
          ) : (
            <>
              Send enquiry
              <SendHorizontal size={14} />
            </>
          )}
        </button>
      </div>

      {/* Screen-reader status channel */}
      <p aria-live="polite" className="sr-only">
        {isLoading ? 'Sending your enquiry' : ''}
      </p>
    </form>
  )
}

/* ── Pieces ──────────────────────────────────────────────── */

// Forms deliberately don't animate field-by-field on mount — motion here
// would interrupt task completion rather than support it (see
// docs/motion.md, "What NOT to animate"). The card this form sits in gets
// a single whileInView reveal instead, coordinated with ContactAside.
function Field({
  htmlFor,
  label,
  optional,
  children,
}: {
  htmlFor?: string
  label?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      {label && <FieldLabel htmlFor={htmlFor} label={label} optional={optional} />}
      {children}
    </div>
  )
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
        className="border-accent text-accent mb-5 flex h-12 w-12 items-center justify-center rounded-full border"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 10.5L8 14.5L16 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h3 className="text-ink font-serif text-2xl italic">Message sent</h3>
      <p className="text-muted mt-2 max-w-xs text-sm font-light">
        Thanks for reaching out — I’ll get back to you as soon as I can, usually within a
        day or two.
      </p>
      <button onClick={onReset} className="link-underline mt-8">
        <span>Send another message</span>
      </button>
    </motion.div>
  )
}

const FieldLabel = ({
  htmlFor,
  label,
  optional,
}: {
  htmlFor?: string
  label: string
  optional?: boolean
}) => {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
      </label>
      {optional && <span className={optionalTagClasses}>optional</span>}
    </div>
  )
}
