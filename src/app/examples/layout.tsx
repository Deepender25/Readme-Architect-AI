import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'README Examples - Professional Documentation Templates & Samples | AutoDoc AI',
  description: 'Browse real examples of AI-generated READMEs. See professional documentation templates for JavaScript, Python, React, Node.js, and more. Get inspiration for your GitHub repositories with our sample READMEs.',
  keywords: [
    'README examples',
    'documentation examples',
    'README templates',
    'GitHub README samples',
    'project documentation examples',
    'README inspiration',
    'documentation samples',
    'professional README examples',
    'AI-generated README examples',
    'GitHub documentation templates',
    'repository README examples',
    'markdown documentation examples'
  ].join(', '),
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://autodocai.vercel.app/examples'
  },
  openGraph: {
    title: 'README Examples - Professional Documentation Templates & Samples',
    description: 'Browse real examples of AI-generated READMEs. See professional documentation templates for JavaScript, Python, React, Node.js, and more.',
    url: 'https://autodocai.vercel.app/examples',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoDoc AI README Examples'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'README Examples - Professional Documentation Templates',
    description: 'Browse real examples of AI-generated READMEs. See professional documentation templates for different programming languages.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
  },
  category: 'Technology'
}

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for Examples */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Professional README Examples & Templates',
            description: 'Explore real-world examples of AI-generated READMEs. See how AutoDoc AI creates professional documentation for different types of projects and programming languages.',
            url: 'https://autodocai.vercel.app/examples',
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
              '@id': 'https://autodocai.vercel.app/examples'
            }
          }),
        }}
      />
      
      {children}
    </>
  )
}