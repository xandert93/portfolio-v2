import { fetchSiteSettings } from '@/sanity/lib/fetch'
import ContactForm from '@/components/ContactForm'

export default async function ContactPage() {
  const settings = await fetchSiteSettings()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-16">
        <p className="text-2xs tracking-widest uppercase text-muted mb-4">
          Contact
        </p>
        <h1 className="font-serif text-5xl text-ink mb-4">Let's talk</h1>
        <p className="text-sm text-muted font-light leading-relaxed">
          Have a project in mind, or just want to say hello? Fill out the form
          below and I'll get back to you as soon as I can.
        </p>
      </div>

      <ContactForm />

      {settings.email && (
        <p className="text-sm text-muted mt-12 text-center">
          Prefer email? Reach me directly at{' '}
          <a
            href={`mailto:${settings.email}`}
            className="text-ink border-b border-ink hover:text-accent hover:border-accent transition-colors"
          >
            {settings.email}
          </a>
        </p>
      )}
    </main>
  )
}
