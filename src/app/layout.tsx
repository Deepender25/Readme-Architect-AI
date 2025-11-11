import { Metadata } from 'next';
import { organizationSchema, webApplicationSchema } from '@/lib/structured-data';
import ClientRootLayout from '@/components/client-root-layout';
import "./globals.css";
import "@/styles/newloader.css";
import 'highlight.js/styles/github-dark.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://readmearchitect.vercel.app'),
  title: {
    default: 'ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation in 30 Seconds',
    template: '%s | ReadmeArchitect'
  },
  description: 'Generate stunning GitHub READMEs instantly with advanced AI. Trusted by 15,000+ developers worldwide. Free README generator with 99.2% accuracy. Transform your repositories with professional documentation in under 30 seconds using Google Gemini AI.',
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
    'AI code analysis',
    'repository analyzer',
    'GitHub README template',
    'markdown documentation'
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
    canonical: '/',
    languages: {
      'en-US': '/',
      'en': '/'
    }
  },
  verification: {
    google: 'google74b256ed93035973',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
      'yandex-verification': 'your-yandex-verification-code'
    }
  },
  category: 'technology',
  classification: 'Developer Tools',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-touch-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-touch-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-touch-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-touch-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-touch-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-touch-icon-57x57.png', sizes: '57x57', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://readmearchitect.vercel.app',
    title: 'ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation',
    description: 'Generate stunning GitHub READMEs instantly with AI. Trusted by 15,000+ developers worldwide. Free README generator with 99.2% accuracy.',
    siteName: 'ReadmeArchitect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReadmeArchitect - AI-Powered README Generator Interface',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReadmeArchitect - Free AI README Generator',
    description: 'Generate stunning GitHub READMEs instantly with AI. Trusted by 15,000+ developers worldwide.',
    site: '@readmearchitect',
    creator: '@readmearchitect',
    images: {
      url: '/og-image.png',
      alt: 'ReadmeArchitect - AI-Powered README Generator',
    },
  },
  appleWebApp: {
    capable: true,
    title: 'ReadmeArchitect',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'application-name': 'ReadmeArchitect',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'ReadmeArchitect',
    'msapplication-TileColor': '#00ff88',
    'msapplication-TileImage': '/mstile-144x144.png',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#00ff88',
    'color-scheme': 'dark',
    'coverage': 'Worldwide',
    'distribution': 'global',
    'rating': 'general',
    'target': 'all',
    'audience': 'Developers, Software Engineers, Technical Writers, Open Source Contributors',
    'subject': 'AI-powered README generation for GitHub repositories',
    'abstract': 'Professional AI-powered README generator that creates stunning GitHub documentation in under 30 seconds. Free, fast, and accurate with advanced AI technology.',
    'language': 'English',
    'revisit-after': '3 days',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <head>
        {/* Mobile Viewport Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, viewport-fit=cover, user-scalable=yes" />
        
        {/* DNS Prefetch & Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* Structured Data - WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ReadmeArchitect',
              alternateName: 'README Architect',
              url: 'https://readmearchitect.vercel.app',
              description: 'Professional AI-powered README generator for GitHub repositories using Google Gemini AI',
              inLanguage: 'en-US',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://readmearchitect.vercel.app/generate?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              sameAs: [
                'https://github.com/readmearchitect',
                'https://twitter.com/readmearchitect',
                'https://linkedin.com/company/readmearchitect'
              ],
              publisher: {
                '@type': 'Organization',
                name: 'ReadmeArchitect',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://readmearchitect.vercel.app/logo.png',
                  width: 512,
                  height: 512
                }
              }
            })
          }}
        />

        {/* Fonts with optimized loading */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Structured Data - Web Application */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
        <style>{`
        :root {
          --font-inter: Inter, sans-serif;
        }
        
        /* Ultra-smooth page setup */
        html {
          background-color: #000000 !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          scroll-behavior: smooth !important;
          height: 100% !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: none !important;
        }
        
        body {
          background-color: #000000 !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          scroll-behavior: smooth !important;
          height: 100% !important;
          min-height: 100vh !important;
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: none !important;
          transform: translate3d(0, 0, 0) !important;
          will-change: scroll-position !important;
        }
        
        
        /* Enhanced smooth page transition styles */
        .page-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 255, 136, 0.08) 50%, rgba(0, 0, 0, 0.4) 100%);
          z-index: 9999;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          will-change: opacity, backdrop-filter;
        }
        
        .page-transition-overlay.active {
          opacity: 0.5;
          backdrop-filter: blur(12px);
        }
        
        /* Prevent content shift during transitions */
        html.page-transitioning {
          overflow: hidden;
        }
        
        html.page-transitioning body {
          overflow: hidden;
        }
      `}</style>
      </head>
      <body className="antialiased bg-transparent">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}