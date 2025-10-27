import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - ReadmeArchitect Usage Terms | ReadmeArchitect',
  description: 'Terms and conditions for using ReadmeArchitect README generator. Service agreement, usage rights, and legal information for our AI-powered documentation tool.',
  keywords: [
    'terms of service',
    'usage terms',
    'service agreement',
    'legal terms',
    'terms and conditions',
    'user agreement',
    'ReadmeArchitect terms',
    'README generator terms',
    'service terms',
    'usage agreement'
  ].join(', '),
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/terms'
  },
  openGraph: {
    title: 'Terms of Service - ReadmeArchitect Usage Terms',
    description: 'Terms and conditions for using ReadmeArchitect README generator. Service agreement, usage rights, and legal information.',
    url: 'https://readmearchitect.vercel.app/terms',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect Terms of Service'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - ReadmeArchitect Usage Terms',
    description: 'Terms and conditions for using ReadmeArchitect README generator.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
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