'use client'

import Head from 'next/head'
import { usePathname } from 'next/navigation'

interface PageSEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
  structuredData?: object[]
  breadcrumbs?: Array<{name: string, url: string}>
}

const baseUrl = 'https://autodocai.vercel.app'

export default function PageSEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  structuredData = [],
  breadcrumbs = []
}: PageSEOProps) {
  const pathname = usePathname()
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${pathname}`
  const fullOgImage = ogImage || `${baseUrl}/og-image.png`
  
  const fullTitle = title ? `${title} | AutoDoc AI` : 'AutoDoc AI - Free AI README Generator'
  const fullDescription = description || 'Generate stunning GitHub READMEs instantly with AI. Trusted by 10,000+ developers worldwide.'

  // Generate breadcrumb structured data
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  } : null

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="AutoDoc AI" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullOgImage} />
      <meta property="twitter:image:alt" content={fullTitle} />
      <meta property="twitter:creator" content="@autodocai" />
      <meta property="twitter:site" content="@autodocai" />
      
      {/* Structured Data */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </Head>
  )
}