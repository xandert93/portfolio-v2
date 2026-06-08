import Link from 'next/link'
import { fetchSiteSettings } from '@/sanity/lib/fetch'

export default async function Navbar() {
  const settings = await fetchSiteSettings()

  return (
    <nav className="flex justify-between items-center px-12 py-6 border-b border-faint">
      <Link
        href="/"
        className="font-serif text-lg text-ink hover:text-accent transition-colors"
      >
        {settings.name}
      </Link>
      <div className="flex gap-8">
        {(
          [
            ['Work', '/projects'],
            ['About', '/about'],
            ['Experience', '/experience'],
            ['Blog', '/blog'],
          ] as const
        ).map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
