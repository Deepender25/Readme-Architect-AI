'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/lib/auth-client';
import EnhancedGridBackground from '@/components/enhanced-grid-background';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

interface ClientRootLayoutProps {
  children: React.ReactNode;
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Enhanced Grid Background - Professional animated grid across all pages */}
      <EnhancedGridBackground />

      <AuthProvider>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{
              opacity: 0,
              scale: 0.98,
              y: 16,
              filter: 'blur(4px)'
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              scale: 1.01,
              y: -16,
              filter: 'blur(4px)'
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="min-h-screen relative z-50 ultra-smooth-scroll critical-smooth"
            style={{
              willChange: 'transform, opacity, filter',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
              transformStyle: 'preserve-3d',
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

        {/* Enhanced page transition overlay with smooth fade */}
        <AnimatePresence>
          <motion.div
            key={`overlay-${pathname}`}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            exit={{ opacity: 0.4, backdropFilter: 'blur(10px)' }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="page-transition-overlay"
            style={{
              willChange: 'opacity, backdrop-filter',
              pointerEvents: 'none',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            }}
          />
        </AnimatePresence>
      </AuthProvider>

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}