import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy - How We Protect Your Data & Privacy',
  description: 'Learn how ReadmeArchitect protects your privacy and handles your data. Comprehensive privacy policy for our AI-powered README generation service. Your code stays private and secure with encrypted transmission and no permanent storage.',
  keywords: [
    'privacy policy',
    'data protection',
    'privacy',
    'data security',
    'user privacy',
    'GDPR compliance',
    'code privacy',
    'data encryption',
    'secure README generator',
    'private repository safety',
    'data handling policy'
  ],
  canonical: '/privacy'
})
