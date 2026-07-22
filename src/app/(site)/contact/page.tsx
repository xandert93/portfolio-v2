import { fetchSiteSettings } from '@/sanity/lib/fetch'
import ContactForm from '@/components/ContactForm'

export default async function ContactPage() {
  const settings = await fetchSiteSettings()

  if (!settings) return 'Fill settings on Sanity pls!'

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs text-muted mb-4 tracking-widest uppercase">Contact</p>
        <h1 className="text-ink mb-4 font-serif text-5xl">Let's talk</h1>
        <p className="text-muted text-sm leading-relaxed font-light">
          Have a project in mind, or just want to say hello? Fill out the form below and
          I'll get back to you as soon as I can.
        </p>
      </div>

      <ContactForm />

      {settings.email && (
        <p className="text-muted mt-12 text-center text-sm">
          Prefer email? Reach me directly at{' '}
          <a
            href={`mailto:${settings.email}`}
            className="text-ink border-ink hover:text-accent hover:border-accent border-b transition-colors"
          >
            {settings.email}
          </a>
        </p>
      )}
    </main>
  )
}
