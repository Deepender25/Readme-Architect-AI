import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://readmearchitect.vercel.app'
  const currentDate = new Date()
  
  return [
    // Homepage - Maximum Priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // Core Product Pages - Very High Priority
    {
      url: `${baseUrl}/generate`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/generator`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    
    // Feature & Information Pages - High Priority
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/examples`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Content Pages - Medium-High Priority
    {
      url: `${baseUrl}/tutorials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    
    // Support & Information Pages - Medium Priority
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // Output Pages - Medium Priority (for SEO discovery)
    {
      url: `${baseUrl}/output`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.55,
    },
    {
      url: `${baseUrl}/readme/output`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.5,
    },
    
    // Legal Pages - Low Priority
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    
    // Auth Pages - Minimal Priority (included for completeness)
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.1,
    },
  ]
}