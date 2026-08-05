import type { Metadata } from 'next'

import { fetchSiteSettings, fetchAbout, fetchFaq } from '@/sanity/lib/fetch'

import ContactForm from '@/app/(site)/contact/_components/ContactForm'
import ContactAside from '@/app/(site)/contact/_components/ContactAside'
import ContactFaq from '@/app/(site)/contact/_components/ContactFaq'

import { Section } from '@/components/ui/Section'
import AnimatedCard from '@/components/ui/AnimatedCard'

import { ROUTES } from '@/config/routes'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project, ask a question, or just say hello — tell me what you have in mind and I usually reply within a day or two.',
  openGraph: {
    title: 'Contact',
    description:
      'Start a project, ask a question, or just say hello — I usually reply within a day or two.',
    type: 'website',
  },
  alternates: { canonical: ROUTES.contact },
}

export default async function ContactPage() {
  const [settings, about, faq] = await Promise.all([
    fetchSiteSettings(),
    fetchAbout(),
    fetchFaq(),
  ])

  if (!settings)
    throw new Error('Site Settings document is missing. Please add to Sanity Studio!')
  if (!about) throw new Error('About document is missing. Please add to Sanity Studio!')

  return (
    <>
      <Section
        glow={{ side: 'left', vertical: 'top' }}
        glyph={faq ? { number: 1, side: 'right' } : undefined}
        header={{
          eyebrow: "Let's Talk",
          heading: "Tell me what you're building",
          lead: "Whether it's a full build, a rescue mission on something half-baked or a role you think I'd suit — the more context you give me, the richer our first interaction will be.",
        }}
      >
        <div className="z-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 lg:col-span-7">
            <AnimatedCard className="card no-hover-transform p-6 md:p-10">
              <ContactForm />
            </AnimatedCard>
          </div>
          <div className="md:col-span-5 lg:col-span-5">
            <ContactAside
              name={settings.names.display || settings.names.full}
              avatar={about.avatar}
              isOpenToWork={about.isOpenToWork}
              email={settings.email}
              phone={settings.phone}
              hasWhatsApp={settings.hasWhatsApp}
              socialUrls={settings.socialUrls}
            />
          </div>
        </div>
      </Section>
      {faq?.items && (
        <Section
          id="contact-faq"
          glow={{ side: 'left', vertical: 'bottom' }}
          glyph={{ number: 2, side: 'left' }}
          header={{
            eyebrow: 'Before you write',
            heading: faq.title,
          }}
        >
          <ContactFaq faq={faq} />
        </Section>
      )}
    </>
  )
}
