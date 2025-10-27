import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - ReadmeForge Usage Terms | ReadmeForge',
  description: 'Terms and conditions for using ReadmeForge README generator. Service agreement, usage rights, and legal information for our AI-powered documentation tool.',
  keywords: [
    'terms of service',
    'usage terms',
    'service agreement',
    'legal terms',
    'terms and conditions',
    'user agreement',
    'ReadmeForge terms',
    'README generator terms',
    'service terms',
    'usage agreement'
  ].join(', '),
  authors: [{ name: 'ReadmeForge Team' }],
  creator: 'ReadmeForge',
  publisher: 'ReadmeForge',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmeforge.vercel.app/terms'
  },
  openGraph: {
    title: 'Terms of Service - ReadmeForge Usage Terms',
    description: 'Terms and conditions for using ReadmeForge README generator. Service agreement, usage rights, and legal information.',
    url: 'https://readmeforge.vercel.app/terms',
    siteName: 'ReadmeForge',
    images: [
      {
        url: 'https://readmeforge.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeForge Terms of Service'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - ReadmeForge Usage Terms',
    description: 'Terms and conditions for using ReadmeForge README generator.',
    images: ['https://readmeforge.vercel.app/og-image.png'],
    creator: '@readmeforge'
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