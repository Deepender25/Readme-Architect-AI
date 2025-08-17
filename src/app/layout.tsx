'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/lib/auth';
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
        
        /* Prevent white flash during page transitions */
        html, body {
          background-color: #000000 !important;
          overflow-x: hidden;
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
      <body className="antialiased bg-black">
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
              className="min-h-screen bg-black"
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
      </body>
    </html>
  );
}