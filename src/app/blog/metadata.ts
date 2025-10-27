import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Blog - AI Development & Documentation Insights',
  description: 'Explore insights, tutorials, and stories about AI-powered development tools, documentation best practices, and the future of developer productivity. Learn from the ReadmeArchitect team about README generation, GitHub integration, and AI in software development.',
  keywords: [
    'ReadmeArchitect blog',
    'AI development blog',
    'documentation best practices',
    'developer tools blog',
    'AI tutorials',
    'GitHub documentation tips',
    'README writing tips',
    'software documentation blog',
    'developer productivity',
    'AI in development',
    'documentation automation blog',
    'GitHub best practices'
  ],
  canonical: '/blog',
  ogType: 'website'
})
