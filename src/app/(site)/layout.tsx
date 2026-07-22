import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { fetchSiteSettings } from '@/sanity/lib/fetch'
import { genFaviconUrl, genImageBuilder } from '@/sanity/lib/image'

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
  style: ['normal', 'italic'],
})

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ed' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0c10' },
  ],
}

const siteUrl = process.env.SITE_URL!

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings()

  if (!settings) throw new Error('Site settings not found')
  if (!settings.names) throw new Error('Missing names')
  if (!settings.seo) throw new Error('Missing SEO')

  const {
    names,
    seo: { title, description },
    favicon,
    ogImage,
  } = settings

  if (!title || !description) throw new Error('Missing SEO fields')

  const fullName = `${names.first} ${names.last}`
  const icon = favicon && genFaviconUrl(favicon, 32)
  const ogImageUrl = ogImage && genImageBuilder(ogImage).url()

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${fullName}`,
    },
    description,
    keywords: ['portfolio', 'software engineer', 'next.js', 'react', 'typescript'],
    authors: [{ name: fullName }],
    creator: fullName,

    ...(icon && {
      icons: {
        icon,
        shortcut: icon,
        apple: genFaviconUrl(favicon, 180),
      },
    }),

    ...(ogImageUrl && {
      openGraph: {
        title,
        description,
        url: siteUrl,
        siteName: names.display + ' | Portfolio',
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImageUrl,
      },
    }),
  }
}

type Props = Readonly<{ children: React.ReactNode }>

export default async function SiteLayout({ children }: Props) {
  const settings = await fetchSiteSettings()
  if (!settings) return 'Add Site Settings to Sanity'

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} bg-background`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar names={settings.names} />
          <main className="pt-(--navbar-h-mobile) md:pt-(--navbar-h)">{children}</main>
          <Footer settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  )
}
