import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReadmeArchitect - AI-Powered README Generator',
  description: 'Generate professional README files for your GitHub repositories using AI. Create beautiful documentation in seconds.',
  keywords: ['README', 'generator', 'AI', 'GitHub', 'documentation', 'markdown'],
  authors: [{ name: 'ReadmeArchitect' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'ReadmeArchitect - AI-Powered README Generator',
    description: 'Generate professional README files for your GitHub repositories using AI',
    url: 'https://readmearchitect.vercel.app',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: '/favicon.ico',
        width: 32,
        height: 32,
        alt: 'ReadmeArchitect Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ReadmeArchitect - AI-Powered README Generator',
    description: 'Generate professional README files for your GitHub repositories using AI',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};