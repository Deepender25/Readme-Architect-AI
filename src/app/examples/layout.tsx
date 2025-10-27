import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'README Examples - Professional Documentation Templates & Samples | ReadmeArchitect',
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
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/examples'
  },
  openGraph: {
    title: 'README Examples - Professional Documentation Templates & Samples',
    description: 'Browse real examples of AI-generated READMEs. See professional documentation templates for JavaScript, Python, React, Node.js, and more.',
    url: 'https://readmearchitect.vercel.app/examples',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect README Examples'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'README Examples - Professional Documentation Templates',
    description: 'Browse real examples of AI-generated READMEs. See professional documentation templates for different programming languages.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
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
            description: 'Explore real-world examples of AI-generated READMEs. See how ReadmeArchitect creates professional documentation for different types of projects and programming languages.',
            url: 'https://readmearchitect.vercel.app/examples',
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
              '@id': 'https://readmearchitect.vercel.app/examples'
            }
          }),
        }}
      />
      
      {children}
    </>
  )
}