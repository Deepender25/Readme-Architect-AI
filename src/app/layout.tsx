'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
import EnhancedGridBackground from '@/components/enhanced-grid-background';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" />
        <style>{`
        :root {
          --font-inter: 'Inter', sans-serif;
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
      </body>
    </html>
  );
}