import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://readmearchitect.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/examples',
          '/documentation',
          '/contact',
          '/about',
          '/blog',
          '/tutorials',
        ],
        disallow: [
          '/api/',
          '/login',
          '/repositories',
          '/history',
          '/settings',
          '/switch-account',
          '/readme/',
          '/_next/',
          '/static/',
          '/auth/',
          '/output/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}