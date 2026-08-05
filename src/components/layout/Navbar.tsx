'use client'

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import NavLink from '../layout/NavLink'
import ThemeToggleButton from '../ui/ThemeToggleButton'
import clsx from 'clsx'

import { FEATURES } from '@/config/features'
import { ROUTES } from '@/config/routes'

import { SiteSettings } from '@/sanity/types'

const NAV_LINKS = [
  FEATURES.projects && { label: 'Work', href: ROUTES.projects },
  FEATURES.about && { label: 'About', href: ROUTES.about },
  FEATURES.experience && { label: 'Experience', href: ROUTES.experience },
  FEATURES.blog && { label: 'Blog', href: ROUTES.blog },
].filter(Boolean)

const SCROLL_THRESHOLD = 12
const HIDE_AFTER_Y = 140

type NavbarProps = {
  names: NonNullable<SiteSettings>['names']
}

export default function Navbar({ names }: NavbarProps) {
  const pathname = usePathname()
  const drawerId = useId()
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  const [isMobNavOpen, setIsMobNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showDesktopNav, setShowDesktopNav] = useState(true)
  const lastY = useRef(0)

  const closeMobileNav = useCallback(() => setIsMobNavOpen(false), [])
  const toggleMobileNav = useCallback(() => setIsMobNavOpen((prev) => !prev), [])

  // Scroll behavior: shrink header, hide on scroll-down / show on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > SCROLL_THRESHOLD)

      const isScrollingDown = y > lastY.current && y > HIDE_AFTER_Y
      setShowDesktopNav(!isScrollingDown)

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(closeMobileNav, [pathname, closeMobileNav])

  // Escape key + body scroll lock, scoped to when the drawer is open
  useEffect(() => {
    if (!isMobNavOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return

      closeMobileNav()
      toggleButtonRef.current?.focus()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isMobNavOpen, closeMobileNav])

  return (
    <>
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          showDesktopNav ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <nav
          className={clsx(
            'flex h-(--navbar-h-mobile) border-b px-6 transition-all duration-500 md:h-(--navbar-h) md:px-12',
            isScrolled
              ? 'border-faint bg-paper/80 backdrop-blur-xl'
              : 'bg-paper border-transparent',
          )}
        >
          <div className="flex grow justify-between">
            <WordmarkLink children={names.display || names.full} />
            <div className="hidden items-center gap-8 text-xs font-medium md:flex">
              <NavLinksList />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggleButton />
              {/* 💻 - hidden @ < md  */}
              <ContactLink />
              {/* 📲 - hidden @ >= md  */}
              <HamburgerMenuButton
                ref={toggleButtonRef}
                handleClick={toggleMobileNav}
                isOpen={isMobNavOpen}
                drawerId={drawerId}
              />
            </div>
          </div>
        </nav>
      </header>

      {/* 📲 - hidden @ >= md  */}
      <MobileNavOverlay isOpen={isMobNavOpen} handleClick={closeMobileNav} />
      {/* 📲 - hidden @ >= md  */}
      <MobileNavDrawer
        id={drawerId}
        isOpen={isMobNavOpen}
        handleLinkClick={closeMobileNav}
      />
    </>
  )
}

const WordmarkLink = ({ children }: { children: string }) => {
  return (
    <Link
      href={ROUTES.home}
      className="group text-ink flex items-center gap-2 font-serif text-lg italic"
    >
      <span className="text-accent not-italic transition-transform duration-500 group-hover:rotate-90">
        ✦
      </span>{' '}
      {children}
    </Link>
  )
}

const NavLinksList = () => {
  const pathname = usePathname()

  return NAV_LINKS.map(({ label, href }: any) => (
    <NavLink key={href} href={href} label={label} isActive={pathname === href} />
  ))
}

const ContactLink = () => {
  return (
    <Link
      href={ROUTES.contact}
      className="border-accent/40 text-accent hover=border-accent hover:bg-accent-dim hidden rounded-full border px-5 py-2 text-xs font-medium tracking-[0.16em] uppercase transition-all duration-300 md:inline-block"
    >
      Contact
    </Link>
  )
}

interface HamburgerMenuButtonProps {
  /** Click handler for the button */
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Whether the menu is currently open */
  isOpen: boolean
  /** ID of the drawer/panel this button controls */
  drawerId: string
}

const HamburgerMenuButton = forwardRef<HTMLButtonElement, HamburgerMenuButtonProps>(
  ({ handleClick, isOpen, drawerId }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls={drawerId}
        className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.25 md:hidden"
      >
        {/* Top line */}
        <span
          className={`bg-ink block h-px w-5 origin-center transition-all duration-300 ${
            isOpen ? 'translate-y-1.5 rotate-45' : ''
          }`}
        />

        {/* Middle line */}
        <span
          className={`bg-ink block h-px w-5 transition-all duration-300 ${
            isOpen ? 'scale-x-0 opacity-0' : ''
          }`}
        />

        {/* Bottom line */}
        <span
          className={`bg-ink block h-px w-5 origin-center transition-all duration-300 ${
            isOpen ? '-translate-y-1.5 -rotate-45' : ''
          }`}
        />
      </button>
    )
  },
)

type MobileNavOverlayProps = {
  handleClick: () => void
  isOpen: boolean
}

const MobileNavOverlay = ({ handleClick, isOpen }: MobileNavOverlayProps) => {
  return (
    <div
      onClick={handleClick}
      aria-hidden="true"
      className={`bg-paper/70 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    />
  )
}

type MobileNavDrawerProps = {
  handleLinkClick: () => void
  isOpen: boolean
  id: string
}

const MobileNavDrawer = ({ id, isOpen, handleLinkClick }: MobileNavDrawerProps) => {
  const pathname = usePathname()

  return (
    <aside
      id={id}
      aria-hidden={!isOpen}
      className={`border-faint bg-paper fixed top-0 right-0 z-50 flex h-full w-72 flex-col gap-0.5 border-l px-8 pt-24 pb-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {NAV_LINKS.map(({ label, href }: any) => (
        <NavLink
          key={href}
          href={href}
          label={label}
          isActive={pathname === href}
          onClick={handleLinkClick}
          variant="mobile"
        />
      ))}

      <Link
        href={ROUTES.contact}
        onClick={handleLinkClick}
        className="border-accent/40 text-accent hover:bg-accent-dim mt-6 rounded-sm border py-3 text-center text-[0.72rem] tracking-[0.16em] uppercase transition-colors"
      >
        Contact
      </Link>
    </aside>
  )
}
