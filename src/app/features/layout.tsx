import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - AI README Generator Capabilities & Tools | AutoDoc AI',
  description: 'Discover powerful features of AutoDoc AI: AI-powered analysis, GitHub integration, professional templates, multi-language support, real-time preview, and lightning-fast generation. Everything you need for perfect documentation.',
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
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://autodocai.vercel.app/features'
  },
  openGraph: {
    title: 'Features - AI README Generator Capabilities & Tools',
    description: 'Discover powerful features of AutoDoc AI: AI-powered analysis, GitHub integration, professional templates, and lightning-fast generation.',
    url: 'https://autodocai.vercel.app/features',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoDoc AI Features'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - AI README Generator Capabilities & Tools',
    description: 'Discover powerful features of AutoDoc AI: AI-powered analysis, GitHub integration, and professional templates.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
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
            description: 'Explore the powerful features that make AutoDoc AI the ultimate documentation tool for developers. AI-powered analysis, GitHub integration, and professional templates.',
            url: 'https://autodocai.vercel.app/features',
            datePublished: '2024-01-01',
            dateModified: new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: 'AutoDoc AI Team'
            },
            publisher: {
              '@type': 'Organization',
              name: 'AutoDoc AI',
              logo: {
                '@type': 'ImageObject',
                url: 'https://autodocai.vercel.app/logo.png'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://autodocai.vercel.app/features'
            }
          }),
        }}
      />
      
      {children}
    </>
  )
}