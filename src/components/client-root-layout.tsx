'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import AuthProvider from '@/lib/auth';
import EnhancedGridBackground from '@/components/enhanced-dot-background';

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
              scale: 0.95,
              filter: 'blur(10px)'
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: 'blur(10px)'
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              filter: { duration: 0.3 }
            }}
            className="min-h-screen relative z-20"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Page transition overlay */}
        <motion.div
          key={`overlay-${pathname}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
          className="page-transition-overlay"
        />
      </AuthProvider>
    </>
  );
}