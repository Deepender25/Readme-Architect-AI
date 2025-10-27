import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Contact Us - Get Help & Support',
  description: 'Get in touch with the ReadmeArchitect team. Have questions, feedback, or ideas? We'd love to hear from you! Support, bug reports, feature requests, and collaboration inquiries welcome. Response time: 24-48 hours.',
  keywords: [
    'contact ReadmeArchitect',
    'support',
    'feedback',
    'help',
    'customer service',
    'feature requests',
    'partnership',
    'bug reports',
    'collaboration',
    'get in touch',
    'ReadmeArchitect support',
    'developer support'
  ],
  canonical: '/contact'
})
