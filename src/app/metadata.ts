import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation in 30 Seconds',
  description: 'Generate stunning GitHub READMEs instantly with advanced AI. Trusted by 15,000+ developers worldwide. Free README generator with 99.2% accuracy. Transform your repositories with professional documentation using Google Gemini AI. No signup required.',
  keywords: [
    'README generator',
    'AI README generator', 
    'free README generator',
    'GitHub README generator',
    'automatic README creator',
    'GitHub documentation',
    'AI documentation generator',
    'README maker',
    'repository documentation',
    'GitHub tools',
    'markdown generator',
    'documentation automation',
    'code documentation',
    'project documentation',
    'developer tools',
    'GitHub integration',
    'AI writing assistant',
    'technical documentation',
    'software documentation',
    'open source tools',
    'ReadmeArchitect',
    'professional documentation',
    'AI-powered tools',
    'developer productivity',
    'documentation templates',
    'Google Gemini AI',
    'instant README',
    'README creator online',
    'best README generator'
  ],
  authors: [{ name: 'ReadmeArchitect Team', url: 'https://readmearchitect.vercel.app' }],
  creator: 'ReadmeArchitect',
  publisher: 'ReadmeArchitect',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://readmearchitect.vercel.app'
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
    title: 'ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation',
    description: 'Generate professional README files for your GitHub repositories using advanced AI. Trusted by 15,000+ developers worldwide with 99.2% accuracy. Start free now!',
    url: 'https://readmearchitect.vercel.app',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: 'https://readmearchitect.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect - AI-Powered README Generator Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReadmeArchitect - Free AI README Generator',
    description: 'Generate professional README files for your GitHub repositories using advanced AI. Trusted by 15,000+ developers worldwide. Start free!',
    images: ['https://readmearchitect.vercel.app/og-image.png'],
    creator: '@readmearchitect',
    site: '@readmearchitect',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'priority': '1.0', // Highest priority
    'importance': 'high'
  }
};