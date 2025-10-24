import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - Complete Guide to AutoDoc AI README Generator | AutoDoc AI',
  description: 'Complete guide to using AutoDoc AI README generator. Learn how to create perfect GitHub documentation, customize templates, integrate with repositories, and optimize your workflow. Step-by-step tutorials and best practices.',
  keywords: [
    'AutoDoc AI documentation',
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
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://autodocai.vercel.app/documentation'
  },
  openGraph: {
    title: 'Documentation - Complete Guide to AutoDoc AI README Generator',
    description: 'Complete guide to using AutoDoc AI README generator. Learn how to create perfect GitHub documentation with step-by-step tutorials and best practices.',
    url: 'https://autodocai.vercel.app/documentation',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoDoc AI Documentation Guide'
      }
    ],
    locale: 'en_US',
    type: 'article'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation - Complete Guide to AutoDoc AI README Generator',
    description: 'Complete guide to using AutoDoc AI README generator. Learn how to create perfect GitHub documentation.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
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
            headline: 'Complete Guide to AutoDoc AI README Generator',
            description: 'Learn how to create perfect GitHub documentation with AutoDoc AI. Step-by-step tutorials, best practices, and advanced configuration options.',
            url: 'https://autodocai.vercel.app/documentation',
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
              '@id': 'https://autodocai.vercel.app/documentation'
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
                name: 'How does AutoDoc AI analyze my repository?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'AutoDoc AI uses advanced algorithms to scan your repository structure, analyze code files, read package.json/requirements.txt, and understand your project\'s architecture to generate comprehensive documentation.'
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