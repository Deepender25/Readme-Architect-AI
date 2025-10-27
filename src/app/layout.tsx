'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import EnhancedGridBackground from '@/components/enhanced-grid-background';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Head from 'next/head';
import { organizationSchema, webApplicationSchema } from '@/lib/structured-data';
import "./globals.css";
import "@/styles/newloader.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <title>ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation in 30 Seconds</title>
        <meta name="title" content="ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation in 30 Seconds" />
        <meta name="description" content="Generate stunning GitHub READMEs instantly with advanced AI. Trusted by 15,000+ developers worldwide. Free README generator with 99.2% accuracy. Transform your repositories with professional documentation in under 30 seconds using Google Gemini AI." />
        <meta name="keywords" content="README generator, AI README generator, free README generator, GitHub README generator, automatic README creator, GitHub documentation, AI documentation generator, README maker, repository documentation, GitHub tools, markdown generator, documentation automation, code documentation, project documentation, developer tools, GitHub integration, AI writing assistant, technical documentation, software documentation, open source tools" />
        <meta name="author" content="ReadmeArchitect Team" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.78373;-100.445882" />
        <meta name="ICBM" content="39.78373, -100.445882" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="Developers, Software Engineers, Technical Writers, Open Source Contributors" />
        <meta name="subject" content="AI-powered README generation for GitHub repositories" />
        <meta name="copyright" content="ReadmeArchitect Team" />
        <meta name="abstract" content="Professional AI-powered README generator that creates stunning GitHub documentation in under 30 seconds. Free, fast, and accurate with advanced AI technology." />

        {/* Canonical URL */}
        <link rel="canonical" href="https://readmearchitect.vercel.app" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://readmearchitect.vercel.app" />
        <meta property="og:title" content="ReadmeArchitect - Free AI README Generator | Create Professional GitHub Documentation" />
        <meta property="og:description" content="Generate stunning GitHub READMEs instantly with AI. Trusted by 10,000+ developers worldwide. Free README generator with 99% accuracy." />
        <meta property="og:image" content="https://readmearchitect.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ReadmeArchitect - AI-Powered README Generator" />
        <meta property="og:site_name" content="ReadmeArchitect" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://readmearchitect.vercel.app" />
        <meta property="twitter:title" content="ReadmeArchitect - Free AI README Generator" />
        <meta property="twitter:description" content="Generate stunning GitHub READMEs instantly with AI. Trusted by 10,000+ developers worldwide." />
        <meta property="twitter:image" content="https://readmearchitect.vercel.app/og-image.png" />
        <meta property="twitter:image:alt" content="ReadmeArchitect - AI-Powered README Generator" />
        <meta property="twitter:creator" content="@readmearchitect" />
        <meta property="twitter:site" content="@readmearchitect" />

        {/* Additional Meta Tags */}
        <meta name="application-name" content="ReadmeArchitect" />
        <meta name="apple-mobile-web-app-title" content="ReadmeArchitect" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ReadmeArchitect',
              url: 'https://readmearchitect.vercel.app',
              description: 'Professional AI-powered README generator for GitHub repositories',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://readmearchitect.vercel.app/generate?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              },
              sameAs: [
                'https://github.com/readmearchitect',
                'https://twitter.com/readmearchitect'
              ]
            })
          }}
        />

        {/* Favicon - Comprehensive favicon setup */}
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#00ff88" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#00ff88" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://github.com" />

        {/* Fonts with optimized loading */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          media="print"
          onLoad={(e) => { (e.target as HTMLLinkElement).media = 'all' }}
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" />
        </noscript>

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

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />

        {/* Bing Webmaster Tools Verification */}
        <meta name="msvalidate.01" content="your-bing-verification-code" />

        {/* Yandex Verification */}
        <meta name="yandex-verification" content="your-yandex-verification-code" />
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
        
        
        /* Smooth page transition styles */
        .page-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);
          z-index: 9999;
          pointer-events: none;
        }
      `}</style>
      </head>
      <body className="antialiased bg-transparent">
        {/* Enhanced Grid Background - Professional animated grid across all pages */}
        <EnhancedGridBackground />

        <AuthProvider>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{
                opacity: 0,
                y: 8
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -5
              }}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="min-h-screen relative z-50 ultra-smooth-scroll critical-smooth"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'none'
              }}
            >
              <div className="smooth-scroll content-scroll ultra-smooth-scroll critical-smooth" style={{
                transform: 'translate3d(0, 0, 0)',
                willChange: 'scroll-position',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'none'
              }}>
                {children}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced page transition overlay */}
          <motion.div
            key={`overlay-${pathname}`}
            initial={{ opacity: 0.8, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            exit={{ opacity: 0.6, backdropFilter: 'blur(2px)' }}
            transition={{
              duration: 0.15,
              ease: "easeOut"
            }}
            className="page-transition-overlay"
            style={{
              willChange: 'opacity, backdrop-filter',
              pointerEvents: 'none'
            }}
          />
        </AuthProvider>

        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}