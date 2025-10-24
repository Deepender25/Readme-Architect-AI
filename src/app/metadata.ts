import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoDoc AI - AI-Powered README Generator',
  description: 'Generate professional README files for your GitHub repositories using AI. Create beautiful documentation in seconds.',
  keywords: ['README', 'generator', 'AI', 'GitHub', 'documentation', 'markdown'],
  authors: [{ name: 'AutoDoc AI' }],
  creator: 'AutoDoc AI',
  publisher: 'AutoDoc AI',
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
    title: 'AutoDoc AI - AI-Powered README Generator',
    description: 'Generate professional README files for your GitHub repositories using AI',
    url: 'https://autodocai.vercel.app',
    siteName: 'AutoDoc AI',
    images: [
      {
        url: '/favicon.ico',
        width: 32,
        height: 32,
        alt: 'AutoDoc AI Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'AutoDoc AI - AI-Powered README Generator',
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