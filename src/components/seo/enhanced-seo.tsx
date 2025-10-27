import { Metadata } from 'next'
import { organizationSchema, webApplicationSchema, faqSchema } from '@/lib/structured-data'

interface EnhancedSEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: any[]
  noIndex?: boolean
}

export function generateEnhancedMetadata({
  title = 'ReadmeArchitect - AI-Powered README Generator | Create Professional GitHub Documentation',
  description = 'Generate stunning GitHub READMEs instantly with advanced AI. Trusted by 15,000+ developers worldwide. Free README generator with 99.2% accuracy.',
  keywords = [],
  canonicalUrl,
  ogImage,
  noIndex = false
}: EnhancedSEOProps = {}): Metadata {
  const baseUrl = 'https://readmearchitect.vercel.app'
  const fullCanonicalUrl = canonicalUrl || baseUrl
  const fullOgImage = ogImage || `${baseUrl}/og-image.png`
  
  const defaultKeywords = [
    'README generator',
    'AI README generator', 
    'free README generator',
    'GitHub README generator',
    'automatic README creator',
    'GitHub documentation',
    'AI documentation generator',
    'README maker',
    'repository documentation',
    'GitHub tools',
    'markdown generator',
    'documentation automation',
    'code documentation',
    'project documentation',
    'developer tools',
    'GitHub integration',
    'AI writing assistant',
    'technical documentation',
    'software documentation',
    'open source tools',
    'ReadmeArchitect',
    'professional documentation',
    'AI-powered tools',
    'developer productivity',
    'documentation templates'
  ]
  
  const allKeywords = [...defaultKeywords, ...keywords].join(', ')
  
  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: 'ReadmeArchitect Team', url: baseUrl }],
    creator: 'ReadmeArchitect',
    publisher: 'ReadmeArchitect',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: fullCanonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: fullCanonicalUrl,
      siteName: 'ReadmeArchitect',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullOgImage],
      creator: '@readmearchitect',
      site: '@readmearchitect',
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    category: 'Technology',
    classification: 'Developer Tools',
    other: {
      'application-name': 'ReadmeArchitect',
      'apple-mobile-web-app-title': 'ReadmeArchitect',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'mobile-web-app-capable': 'yes',
      'theme-color': '#00ff88',
      'msapplication-TileColor': '#00ff88',
      'msapplication-config': '/browserconfig.xml',
    },
  }
}

export function EnhancedStructuredData({ schemas = [] }: { schemas?: any[] }) {
  const defaultSchemas = [organizationSchema, webApplicationSchema, faqSchema]
  const allSchemas = [...defaultSchemas, ...schemas]
  
  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  )
}

// SEO-optimized breadcrumb component
export function SEOBreadcrumbs({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  className="hover:text-green-600 transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 2),
        }}
      />
    </>
  )
}

// Enhanced article schema for blog posts
export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified?: string,
  author?: string,
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished,
    dateModified: dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: author || 'ReadmeArchitect Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ReadmeArchitect',
      logo: {
        '@type': 'ImageObject',
        url: 'https://readmearchitect.vercel.app/logo.png',
      },
    },
    image: image || 'https://readmearchitect.vercel.app/og-image.png',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

// Performance and Core Web Vitals optimization
export function SEOPerformanceOptimizations() {
  return (
    <>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.github.com" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://vercel.com" />
      <link rel="dns-prefetch" href="https://github.com" />
      
      {/* Resource hints for better performance */}
      <link rel="prefetch" href="/api/generate" />
      <link rel="prefetch" href="/generate" />
      
      {/* Critical CSS inlining hint */}
      <link rel="preload" href="/globals.css" as="style" />
      
      {/* Web app manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#00ff88" />
      <meta name="msapplication-TileColor" content="#00ff88" />
      
      {/* Apple touch icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </>
  )
}