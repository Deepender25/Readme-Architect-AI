import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Generate README - Create Professional GitHub Documentation with AI',
  description: 'Create professional README files for your GitHub repositories using AI. Paste your repository URL and get comprehensive documentation in under 30 seconds. Free AI-powered README generator.',
  keywords: [
    'generate README',
    'create README',
    'README maker',
    'GitHub README generator',
    'AI documentation creator',
    'repository documentation generator',
    'markdown generator',
    'project documentation creator',
    'automatic README generator',
    'GitHub documentation maker',
    'README creation tool',
    'AI README creator'
  ],
  canonical: '/generate'
})