import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data | ReadmeForge',
  description: 'Learn how ReadmeForge protects your privacy and handles your data. Transparent privacy policy for our README generation service. GDPR compliant and secure.',
  keywords: [
    'privacy policy',
    'data protection',
    'privacy',
    'data security',
    'user privacy',
    'GDPR compliance',
    'ReadmeForge privacy',
    'data handling',
    'security practices',
    'user data protection'
  ].join(', '),
  authors: [{ name: 'ReadmeForge Team' }],
  creator: 'ReadmeForge',
  publisher: 'ReadmeForge',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmeforge.vercel.app/privacy'
  },
  openGraph: {
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how ReadmeForge protects your privacy and handles your data. Transparent privacy policy for our README generation service.',
    url: 'https://readmeforge.vercel.app/privacy',
    siteName: 'ReadmeForge',
    images: [
      {
        url: 'https://readmeforge.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeForge Privacy Policy'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how ReadmeForge protects your privacy and handles your data.',
    images: ['https://readmeforge.vercel.app/og-image.png'],
    creator: '@readmeforge'
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