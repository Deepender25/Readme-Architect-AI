import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - User Guide | ReadmeArchitect',
  description: 'Learn how to use ReadmeArchitect README generator. Step-by-step tutorials and guides for creating GitHub documentation.',
  keywords: [
    'ReadmeArchitect documentation',
    'README generator guide', 
    'how to use ReadmeArchitect',
    'README generator tutorial',
    'documentation guide',
    'user manual'
  ].join(', '),
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 150, // Limit snippet length
    },
  },
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/documentation'
  },
  openGraph: {
    title: 'Documentation - User Guide | ReadmeArchitect',
    description: 'Learn how to use ReadmeArchitect README generator with step-by-step tutorials.',
    url: 'https://readmearchitect.vercel.app/documentation',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect Documentation'
      }
    ],
    locale: 'en_US',
    type: 'website' // Changed from 'article' to 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation - User Guide | ReadmeArchitect',
    description: 'Learn how to use ReadmeArchitect README generator.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
  },
  category: 'Technology',
  other: {
    'priority': '0.6' // Lower priority hint
  }
}