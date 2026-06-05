import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google' // Loads Google fonts via Next’s built-in font optimizer (self-hosted, no runtime request).

import './globals.css' // Global CSS applied to the whole app.

// Font configs (currently unused, but apply to <body> if desired via <body className={`${geistSans.variable} ${geistMono.variable}`}>):
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// 🔙📚 For a portfolio, treat metadata as your SEO + link preview identity card
export const metadata: Metadata = {
  title: 'Xander Tharmaratnam | Portfolio',
  description:
    'Portfolio of Xander Tharmaratnam — software engineer focused on React, Next.js, and backend systems.',
  keywords: [
    'portfolio',
    'software engineer',
    'next.js',
    'react',
    'typescript',
  ],
  authors: [{ name: 'Xander Tharmaratnam' }],
  creator: 'Xander Tharmaratnam',
  openGraph: {
    title: 'Xander Tharmaratnam | Portfolio',
    description:
      'Software engineer portfolio showcasing projects and experience.',
    url: 'https://your-domain.com',
    siteName: 'Xander Tharmaratnam Portfolio',
    images: [
      {
        url: 'https://your-domain.com/og.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xander Tharmaratnam | Portfolio',
    description:
      'Software engineer portfolio showcasing projects and experience.',
    images: ['https://your-domain.com/og.png'],
  },
  metadataBase: new URL('https://your-domain.com'),
}
/*
What matters most
- title → browser tab + Google result headline
- description → search snippet + link preview text
- openGraph.images → what shows when you share on Discord/LinkedIn/Twitter
- metadataBase → makes relative URLs in metadata work correctly
*/

// RootLayout: Required wrapper for all routes in App Router. Must return <html> + <body>
type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
