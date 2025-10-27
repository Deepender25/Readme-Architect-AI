import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - AI README Generator Capabilities & Tools | ReadmeArchitect',
  description: 'Discover powerful features of ReadmeArchitect: AI-powered analysis, GitHub integration, professional templates, multi-language support, real-time preview, and lightning-fast generation. Everything you need for perfect documentation.',
  keywords: [
    'README generator features',
    'AI documentation features',
    'GitHub integration tools',
    'code analysis features',
    'documentation templates',
    'AI README capabilities',
    'developer tools features',
    'GitHub README tools',
    'automatic documentation features',
    'repository analysis tools',
    'markdown generator features',
    'professional documentation tools'
  ].join(', '),
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/features'
  },
  openGraph: {
    title: 'Features - AI README Generator Capabilities & Tools',
    description: 'Discover powerful features of ReadmeArchitect: AI-powered analysis, GitHub integration, professional templates, and lightning-fast generation.',
    url: 'https://readmearchitect.vercel.app/features',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect Features'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - AI README Generator Capabilities & Tools',
    description: 'Discover powerful features of ReadmeArchitect: AI-powered analysis, GitHub integration, and professional templates.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
  },
  category: 'Technology'
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for Features */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'AI README Generator Features & Capabilities',
            description: 'Explore the powerful features that make ReadmeArchitect the ultimate documentation tool for developers. AI-powered analysis, GitHub integration, and professional templates.',
            url: 'https://readmearchitect.vercel.app/features',
            datePublished: '2024-01-01',
            dateModified: new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'ReadmeArchitect Team'
            },
            publisher: {
              '@type': 'Organization',
              name: 'ReadmeArchitect',
              logo: {
                '@type': 'ImageObject',
                url: 'https://readmearchitect.vercel.app/logo.png'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://readmearchitect.vercel.app/features'
            }
          }),
        }}
      />
      
      {children}
    </>
  )
}