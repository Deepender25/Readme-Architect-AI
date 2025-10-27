import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generate README - Create Professional GitHub Documentation with AI | ReadmeArchitect',
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
  authors: [{ name: 'ReadmeArchitect Team' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  robots: 'noindex, follow', // Don't index the generator page as it's user-specific
  openGraph: {
    title: 'Generate README - Create Professional GitHub Documentation with AI',
    description: 'Create professional README files for your GitHub repositories using AI. Get comprehensive documentation in under 30 seconds.',
    url: 'https://readmearchitect.vercel.app/generate',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect README Generator'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generate README - Create Professional GitHub Documentation',
    description: 'Create professional README files for your GitHub repositories using AI.',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect'
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