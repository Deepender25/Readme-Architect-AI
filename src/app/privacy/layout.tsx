import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data | ReadmeArchitect',
  description: 'Learn how ReadmeArchitect protects your privacy and handles your data. Transparent privacy policy for our README generation service. GDPR compliant and secure.',
  keywords: [
    'privacy policy',
    'data protection',
    'privacy',
    'data security',
    'user privacy',
    'GDPR compliance',
    'ReadmeArchitect privacy',
    'data handling',
    'security practices',
    'user data protection'
  ].join(', '),
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/privacy'
  },
  openGraph: {
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how ReadmeArchitect protects your privacy and handles your data. Transparent privacy policy for our README generation service.',
    url: 'https://readmearchitect.vercel.app/privacy',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect Privacy Policy'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - How We Protect Your Data',
    description: 'Learn how ReadmeArchitect protects your privacy and handles your data.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
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