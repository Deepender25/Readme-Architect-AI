import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get Help with AutoDoc AI | AutoDoc AI',
  description: 'Get in touch with the AutoDoc AI team. Support, feedback, feature requests, and partnership inquiries welcome. Fast response times and community-driven development.',
  keywords: [
    'contact AutoDoc AI',
    'support',
    'feedback',
    'help',
    'customer service',
    'feature requests',
    'partnership',
    'AutoDoc AI support',
    'README generator help',
    'technical support',
    'bug reports',
    'collaboration'
  ].join(', '),
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://autodocai.vercel.app/contact'
  },
  openGraph: {
    title: 'Contact Us - Get Help with AutoDoc AI',
    description: 'Get in touch with the AutoDoc AI team. Support, feedback, feature requests, and partnership inquiries welcome.',
    url: 'https://autodocai.vercel.app/contact',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact AutoDoc AI'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get Help with AutoDoc AI',
    description: 'Get in touch with the AutoDoc AI team. Support, feedback, and feature requests welcome.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
  },
  category: 'Technology'
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}