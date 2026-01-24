import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get Help with ReadmeArchitect | ReadmeArchitect',
  description: 'Get in touch with the ReadmeArchitect team. Support, feedback, feature requests, and partnership inquiries welcome. Fast response times and community-driven development.',
  keywords: [
    'contact ReadmeArchitect',
    'support',
    'feedback',
    'help',
    'customer service',
    'feature requests',
    'partnership',
    'ReadmeArchitect support',
    'README generator help',
    'technical support',
    'bug reports',
    'collaboration'
  ].join(', '),
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/contact'
  },
  openGraph: {
    title: 'Contact Us - Get Help with ReadmeArchitect',
    description: 'Get in touch with the ReadmeArchitect team. Support, feedback, feature requests, and partnership inquiries welcome.',
    url: 'https://readmearchitect.vercel.app/contact',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact ReadmeArchitect'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get Help with ReadmeArchitect',
    description: 'Get in touch with the ReadmeArchitect team. Support, feedback, and feature requests welcome.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
  },
  category: 'Technology'
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for Contact Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact ReadmeArchitect',
            description: 'Get in touch with the ReadmeArchitect team for support, feedback, or inquiries.',
            url: 'https://readmearchitect.vercel.app/contact',
            mainEntity: {
              '@type': 'Organization',
              name: 'ReadmeArchitect',
              url: 'https://readmearchitect.vercel.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://readmearchitect.vercel.app/logo.png'
              }
            }
          }),
        }}
      />
      {children}
    </>
  )
}