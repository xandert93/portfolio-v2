import { fetchSiteSettings } from '@/sanity/lib/fetch'

export default async function Footer() {
  const settings = await fetchSiteSettings()

  return (
    <footer className="px-12 py-8 border-t border-faint flex justify-between items-center">
      <span className="font-serif text-sm text-muted">{settings.name}</span>
      <div className="flex gap-6">
        {settings.githubUrl && (
          <a
            href={settings.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            GitHub
          </a>
        )}
        {settings.linkedinUrl && (
          <a
            href={settings.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
        )}
        {settings.email && (
          <a
            href={`mailto:${settings.email}`}
            className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            Email
          </a>
        )}
      </div>
    </footer>
  )
}
