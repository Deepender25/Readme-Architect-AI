import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - Complete Guide to ReadmeArchitect README Generator | ReadmeArchitect',
  description: 'Complete guide to using ReadmeArchitect README generator. Learn how to create perfect GitHub documentation, customize templates, integrate with repositories, and optimize your workflow. Step-by-step tutorials and best practices.',
  keywords: [
    'ReadmeArchitect documentation',
    'README generator guide', 
    'how to generate README',
    'GitHub documentation tutorial',
    'README generator tutorial',
    'AI documentation guide',
    'GitHub integration guide',
    'README best practices',
    'documentation tutorial',
    'GitHub README guide',
    'automatic documentation guide',
    'repository documentation guide'
  ].join(', '),
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://readmearchitect.vercel.app/documentation'
  },
  openGraph: {
    title: 'Documentation - Complete Guide to ReadmeArchitect README Generator',
    description: 'Complete guide to using ReadmeArchitect README generator. Learn how to create perfect GitHub documentation with step-by-step tutorials and best practices.',
    url: 'https://readmearchitect.vercel.app/documentation',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect Documentation Guide'
      }
    ],
    locale: 'en_US',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation - Complete Guide to ReadmeArchitect README Generator',
    description: 'Complete guide to using ReadmeArchitect README generator. Learn how to create perfect GitHub documentation.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
  },
  category: 'Technology'
}

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Structured Data for Documentation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Complete Guide to ReadmeArchitect README Generator',
            description: 'Learn how to create perfect GitHub documentation with ReadmeArchitect. Step-by-step tutorials, best practices, and advanced configuration options.',
            url: 'https://readmearchitect.vercel.app/documentation',
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
              '@id': 'https://readmearchitect.vercel.app/documentation'
            }
          }),
        }}
      />
      
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How does ReadmeArchitect analyze my repository?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'ReadmeArchitect uses advanced algorithms to scan your repository structure, analyze code files, read package.json/requirements.txt, and understand your project\'s architecture to generate comprehensive documentation.'
                }
              },
              {
                '@type': 'Question',
                name: 'What programming languages are supported?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We support 50+ programming languages including JavaScript, TypeScript, Python, Java, Go, Rust, C++, PHP, Ruby, Swift, Kotlin, and many more. The AI adapts to each language\'s conventions.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I customize the generated README?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! You can choose from multiple templates, customize sections, add or remove badges, and edit the content after generation. The AI provides a solid foundation that you can build upon.'
                }
              }
            ]
          }),
        }}
      />
      
      {children}
    </>
  )
}