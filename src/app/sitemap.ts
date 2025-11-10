import { MetadataRoute } from 'next'

/**
 * Perfect SEO-Optimized Sitemap for ReadmeArchitect
 * 
 * Priority Guidelines:
 * 1.0 = Homepage (most important)
 * 0.9-0.95 = Core product pages (main features)
 * 0.8-0.85 = Important content pages
 * 0.7-0.75 = Secondary content pages
 * 0.5-0.65 = Support pages
 * 0.3-0.4 = Legal/policy pages
 * 0.1-0.2 = Auth/utility pages
 * 
 * Change Frequency Guidelines:
 * always = Changes every time accessed (not recommended)
 * hourly = Changes multiple times per day
 * daily = Changes once per day
 * weekly = Changes once per week
 * monthly = Changes once per month
 * yearly = Changes once per year
 * never = Archived content
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://readmearchitect.vercel.app'
  const currentDate = new Date()
  const lastYear = new Date('2024-01-01')
  
  return [
    // ============================================
    // TIER 1: HOMEPAGE - MAXIMUM PRIORITY
    // ============================================
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // ============================================
    // TIER 2: CORE PRODUCT PAGES - CRITICAL
    // ============================================
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
    
    // ============================================
    // TIER 3: FEATURE & SHOWCASE PAGES - HIGH
    // ============================================
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
    
    // ============================================
    // TIER 4: CONTENT & LEARNING PAGES - MEDIUM-HIGH
    // ============================================
    {
      url: `${baseUrl}/tutorials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    
    // ============================================
    // TIER 5: INFORMATION PAGES - MEDIUM
    // ============================================
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    
    // ============================================
    // TIER 6: DOCUMENTATION - SUPPORT
    // ============================================
    {
      url: `${baseUrl}/documentation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    
    // ============================================
    // TIER 7: LEGAL PAGES - LOW PRIORITY
    // ============================================
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastYear,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastYear,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}

/**
 * EXCLUDED FROM SITEMAP (Intentionally):
 * 
 * User-Specific Pages (Should not be indexed):
 * - /history - User's generation history
 * - /history/[id] - Individual history items
 * - /repositories - User's GitHub repositories
 * - /settings - User settings
 * - /output - Dynamic output pages
 * - /output/[id] - Individual outputs
 * - /readme/[id] - Individual README pages
 * - /readme/output - README output pages
 * 
 * Authentication Pages (Low SEO value):
 * - /login - Login page
 * - /auth/* - Auth callback pages
 * - /switch-account - Account switching
 * 
 * API Routes (Not for search engines):
 * - /api/* - All API endpoints
 * 
 * These pages are handled by robots.txt with Disallow directives
 */