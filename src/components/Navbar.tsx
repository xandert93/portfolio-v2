'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  ['Work', '/projects'],
  ['About', '/about'],
  ['Experience', '/experience'],
  ['Blog', '/blog'],
] as const

type NavbarProps = {
  name: string
}

export default function Navbar({ name }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleNavbar = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>,
  ) => {
    setIsOpen((prev) => !prev)
  }

  return (
    <nav className="relative flex justify-between items-center px-6 md:px-12 py-6 border-b border-faint bg-paper z-50">
      <Link
        href="/"
        className="font-serif italic text-xl text-ink flex items-center gap-1.5"
      >
        <span className="text-accent not-italic">✦</span> {name}
      </Link>

      {/* 💻 Navbar */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(([label, href]) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`relative text-2xs tracking-widest uppercasetransition-colors group ${
                !isActive ? 'text-muted hover:text-ink' : 'text-ink'
              }`}
            >
              {label}
              {/* Underlining Pseudo Element */}
              <span
                className={`absolute left-1/2 -bottom-1.5 h-px bg-accent transition-transform duration-300 origin-center w-full ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                } -translate-x-1/2`}
              />
            </Link>
          )
        })}
        <Link
          href="/contact"
          className={`text-2xs tracking-widest uppercase px-5 py-2 border border-accent/40 text-accent rounded-full hover:bg-accent-light transition-colors ${
            pathname !== '/contact'
              ? 'border-accent/40 text-accent hover:bg-accent-dim'
              : 'border-accent bg-accent-dim text-accent'
          }`}
        >
          Contact
        </Link>
      </div>

      {/* 📱 Handburger Menu Button  */}
      <button
        onClick={toggleNavbar}
        className="md:hidden relative w-6 h-[18px] flex flex-col justify-between z-50 cursor-pointer"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {[
          isOpen ? 'rotate-45 translate-y-[9px]' : '',
          isOpen ? 'opacity-0 scale-x-0' : '',
          isOpen ? '-rotate-45 -translate-y-[9px]' : '',
        ].map((cls, i) => (
          <span
            key={i}
            className={`block h-px w-full bg-ink transition-all duration-300 origin-center ${cls}`}
          />
        ))}
      </button>

      {/* 📱 Overlay */}
      <div
        onClick={toggleNavbar}
        aria-hidden="true"
        className={`fixed inset-0 bg-paper/70 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* 📱 Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-paper border-l border-faint flex flex-col gap-1 px-6 py-24 md:hidden transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {navLinks.map(([label, href]) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={toggleNavbar}
              className={`text-sm uppercase tracking-widest py-4 border-b border-faint hover:text-ink transition-colors ${
                !isActive ? 'text-muted hover:text-ink' : 'text-ink'
              } `}
            >
              {label}
            </Link>
          )
        })}
        <Link
          href="/contact"
          onClick={toggleNavbar}
          className="mt-6 text-center text-sm tracking-[0.16em] uppercase py-3 border border-accent/40 text-accent rounded-sm hover:bg-accent-dim transition-colors"
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}

function Poobar({ name }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/90 backdrop-blur-md border-b border-faint shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
          : 'bg-paper border-b border-faint'
      }`}
    >
      <div className="container flex justify-between items-center h-16">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif italic text-lg text-ink flex items-center gap-2 select-none"
        >
          <span className="text-accent not-italic leading-none">✦</span>
          {name}
        </Link>

        {/* Mobile toggle */}
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-paper border-l border-faint flex flex-col px-8 pt-24 pb-10 gap-0.5 md:hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {navLinks.map(([label, href]) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`text-[0.7rem] tracking-[0.16em] uppercase py-4 border-b border-faint transition-colors ${
                active ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {label}
            </Link>
          )
        })}
        <Link
          href="/contact"
          className="mt-6 text-center text-[0.7rem] tracking-[0.16em] uppercase py-3 border border-accent/40 text-accent rounded-sm hover:bg-accent-dim transition-colors"
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}
