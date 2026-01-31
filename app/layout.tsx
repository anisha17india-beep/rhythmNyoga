import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans'
});

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-heading'
});

export const metadata: Metadata = {
  title: 'Rhythm N Yoga Wellness - Heal Naturally',
  description: 'Experience holistic healing through yoga therapy, Ho\'opono\'pono, flower remedies, and dance therapy. Transform your mind, body, and spirit.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${nunito.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
