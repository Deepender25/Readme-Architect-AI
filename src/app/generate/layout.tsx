import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generate README - Create Professional GitHub Documentation with AI | AutoDoc AI',
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
  ].join(', '),
  authors: [{ name: 'AutoDoc AI Team' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
  robots: 'noindex, follow', // Don't index the generator page as it's user-specific
  openGraph: {
    title: 'Generate README - Create Professional GitHub Documentation with AI',
    description: 'Create professional README files for your GitHub repositories using AI. Get comprehensive documentation in under 30 seconds.',
    url: 'https://autodocai.vercel.app/generate',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: 'https://autodocai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoDoc AI README Generator'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generate README - Create Professional GitHub Documentation',
    description: 'Create professional README files for your GitHub repositories using AI.',
    images: ['https://autodocai.vercel.app/og-image.png'],
    creator: '@autodocai'
  },
  category: 'Technology'
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}