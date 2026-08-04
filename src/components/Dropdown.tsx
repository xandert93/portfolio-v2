'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'

/* ── Custom dropdown ──────────────────────────────────────────
   A visually styled, animated listbox. A hidden native <select>
   stays the real form control so FormData + native `required`
   validation keep working exactly as before. The native popup is
   never opened — the custom panel is.

   Open/close and option-reveal motion are interaction-triggered
   (not scroll-triggered), so they intentionally use their own
   local variants rather than the shared whileInView vocabulary —
   see docs/motion.md, "animate vs whileInView vs variants".
   ─────────────────────────────────────────────────────────── */
export type DropdownOption = { value: string; label: string }

type Props = {
  id: string
  name: string
  required?: boolean
  placeholderLabel: string
  options: readonly DropdownOption[]
}

export function Dropdown({ id, name, required, placeholderLabel, options }: Props) {
  const shouldReduceMotion = useReducedMotion()

  const selectRef = useRef<HTMLSelectElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Every item shown in the panel, including the placeholder row.
  const items: DropdownOption[] = [{ value: '', label: placeholderLabel }, ...options]
  const placeholderIsDisabled = Boolean(required)

  const selectedLabel = items.find((o) => o.value === value)?.label ?? placeholderLabel
  const isEmpty = value === ''

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)

    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function syncSelect(next: string) {
    setValue(next)

    if (selectRef.current) {
      selectRef.current.value = next
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  function choose(index: number) {
    const item = items[index]
    if (!item) return
    if (item.value === '' && placeholderIsDisabled) return
    syncSelect(item.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function openAndFocus() {
    setOpen(true)

    const initial = Math.max(
      items.findIndex((o) => o.value === value),
      placeholderIsDisabled ? 1 : 0,
    )

    setActiveIndex(initial < 0 ? (placeholderIsDisabled ? 1 : 0) : initial)
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!open) openAndFocus()
        else if (activeIndex >= 0) choose(activeIndex)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openAndFocus()
        else setActiveIndex((i) => Math.max(placeholderIsDisabled ? 1 : 0, i - 1))
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  function handleListKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(items.length - 1, i + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(placeholderIsDisabled ? 1 : 0, i - 1))
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(placeholderIsDisabled ? 1 : 0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(items.length - 1)
        break
      case 'Enter':
        e.preventDefault()
        choose(activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  const listVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, y: -6, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
        },
        exit: { opacity: 0, y: -4, scale: 0.99, transition: { duration: 0.12 } },
      }

  const optionVariants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -6 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.16, ease: 'easeOut' } },
      }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Hidden native control — the source of truth for submission + validation */}
      <select
        ref={selectRef}
        id={`${id}-select`}
        name={name}
        required={required}
        defaultValue=""
        tabIndex={-1}
        aria-hidden
        className="sr-only"
      >
        <option value="" disabled={placeholderIsDisabled}>
          {placeholderLabel}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Visible trigger */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => (open ? setOpen(false) : openAndFocus())}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`text-ink border-faint focus:border-accent w-full cursor-pointer border-b bg-transparent pt-1 pb-2.5 text-left text-sm font-light transition-colors duration-200 outline-none ${
          isEmpty ? 'text-muted/70' : ''
        }`}
      >
        <span className="flex items-center justify-between gap-3">
          <span className={isEmpty ? 'text-muted/70' : 'text-ink'}>
            {isEmpty ? placeholderLabel : selectedLabel}
          </span>
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            aria-hidden
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="text-muted pointer-events-none shrink-0"
          >
            <path
              d="M1 3.5L5 7L9 3.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </span>
      </button>

      {/* Custom panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={id}
            onKeyDown={handleListKeyDown}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="dropdown-panel border-faint bg-paper absolute top-full right-0 left-0 z-30 mt-1.5 max-h-60 overflow-auto rounded-lg border py-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]"
          >
            {items.map((item, i) => {
              const isPlaceholder = item.value === ''
              const isDisabled = isPlaceholder && placeholderIsDisabled
              const isSelected = item.value === value
              const isActive = i === activeIndex
              return (
                <motion.li
                  key={item.value || '__placeholder'}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || undefined}
                  variants={optionVariants}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: shouldReduceMotion ? 0 : Math.min(i * 0.025, 0.15),
                  }}
                  onMouseEnter={() => !isDisabled && setActiveIndex(i)}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm font-light transition-colors duration-150 ${
                    isDisabled
                      ? 'text-muted/40 cursor-not-allowed'
                      : isActive
                        ? 'bg-faint/40 text-ink'
                        : isSelected
                          ? 'text-ink'
                          : 'text-ink/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && (
                    <svg
                      aria-hidden
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-accent shrink-0"
                    >
                      <path
                        d="M2.5 6.5L5 9L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
