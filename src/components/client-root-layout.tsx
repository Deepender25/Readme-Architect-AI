'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, LazyMotion, domAnimation } from 'framer-motion';
import { AuthProvider } from '@/lib/auth-client';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useEffect, useState } from 'react';
import MobileOptimizer from '@/components/mobile-optimizer';
import { initPerformanceOptimizations } from '@/lib/performance-monitor';

// Lazy load background for better initial load
const EnhancedGridBackground = dynamic(() => import('@/components/enhanced-grid-background'), {
  ssr: false,
  loading: () => null
});

interface ClientRootLayoutProps {
  children: React.ReactNode;
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for optimized animations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize performance optimizations
  useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  // Faster animations on mobile
  const transitionDuration = isMobile ? 0.25 : 0.35;
  const blurAmount = isMobile ? 2 : 4;

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Mobile Performance Optimizer */}
      <MobileOptimizer />
      
      {/* Enhanced Grid Background - Lazy loaded */}
      <EnhancedGridBackground />

      <AuthProvider>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{
              opacity: 0,
              y: isMobile ? 8 : 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: isMobile ? -8 : -16,
            }}
            transition={{
              duration: transitionDuration,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="min-h-screen relative z-50"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div 
              className="smooth-scroll content-scroll" 
              style={{
                transform: 'translate3d(0, 0, 0)',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'none'
              }}
            >
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </AuthProvider>

      {/* Vercel Analytics & Speed Insights - Lazy loaded */}
      <Analytics />
      <SpeedInsights />
    </LazyMotion>
  );
}