import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - AutoDoc AI Usage Terms | AutoDoc AI',
  description: 'Terms and conditions for using AutoDoc AI README generator. Service agreement, usage rights, and legal information for our AI-powered documentation tool.',
  keywords: [
    'terms of service',
    'usage terms',
    'service agreement',
    'legal terms',
    'terms and conditions',
    'user agreement',
    'AutoDoc AI terms',
    'README generator terms',
    'service terms',
    'usage agreement'
  ].join(', '),
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://autodocai.vercel.app/terms'
  },
  openGraph: {
    title: 'Terms of Service - AutoDoc AI Usage Terms',
    description: 'Terms and conditions for using AutoDoc AI README generator. Service agreement, usage rights, and legal information.',
    url: 'https://autodocai.vercel.app/terms',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoDoc AI Terms of Service'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - AutoDoc AI Usage Terms',
    description: 'Terms and conditions for using AutoDoc AI README generator.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
  },
  category: 'Technology'
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}