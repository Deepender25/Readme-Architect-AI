import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://readmearchitect.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/settings',
        '/history',
        '/repositories',
        '/auth/',
        '/_next/',
        '/readme/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}