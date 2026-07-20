'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  // Keep markup identical between server and first client render to avoid a
  // hydration mismatch; only swap theme-dependent bits once mounted.
  const label = !isMounted
    ? 'Toggle theme'
    : isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="border-faint text-muted hover:border-accent hover:text-accent relative grid h-9 w-9 place-items-center rounded-full border transition-colors duration-300"
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ${
          isMounted && !isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ${
          isMounted && isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}
