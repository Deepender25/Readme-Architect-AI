import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data | AutoDoc AI',
  description: 'Learn how AutoDoc AI protects your privacy and handles your data. Transparent privacy policy for our README generation service. GDPR compliant and secure.',
  keywords: [
    'privacy policy',
    'data protection',
    'privacy',
    'data security',
    'user privacy',
    'GDPR compliance',
    'AutoDoc AI privacy',
    'data handling',
    'security practices',
    'user data protection'
  ].join(', '),
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://autodocai.vercel.app/privacy'
  },
  openGraph: {
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how AutoDoc AI protects your privacy and handles your data. Transparent privacy policy for our README generation service.',
    url: 'https://autodocai.vercel.app/privacy',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoDoc AI Privacy Policy'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how AutoDoc AI protects your privacy and handles your data.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
  },
  category: 'Technology'
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}