import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://autodocai.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/generate',
          '/features',
          '/examples',
          '/documentation',
          '/contact',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/api/',
          '/login',
          '/settings',
          '/switch-account',
          '/readme/output',
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