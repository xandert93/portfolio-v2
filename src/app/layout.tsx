import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

const fullName = 'Xander Tharmaratnam'
const siteDescription =
  'Full-stack developer based in London, focused on React, Next.js, and backend systems.'
const siteUrl = 'https://your-domain.com'
const ogImage = `${siteUrl}/og.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${fullName} | Portfolio`,
    template: `%s | ${fullName}`,
  },
  description: siteDescription,
  keywords: [
    'portfolio',
    'software engineer',
    'next.js',
    'react',
    'typescript',
  ],
  authors: [{ name: fullName }],
  creator: fullName,
  openGraph: {
    title: `${fullName} | Portfolio`,
    description: siteDescription,
    url: siteUrl,
    siteName: fullName,
    images: [{ url: ogImage, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${fullName} | Portfolio`,
    description: siteDescription,
    images: [ogImage],
  },
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable} bg-paper`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
