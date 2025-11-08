"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

// Ultra-smooth page transition variants - Enhanced for navbar navigation
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 20,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    filter: 'blur(4px)',
  }
}

// Professional timing - Smooth and natural
const pageTransition = {
  type: 'tween' as const,
  ease: [0.22, 1, 0.36, 1], // Smooth deceleration curve
  duration: 0.5,
}

// Enhanced backdrop overlay for seamless transitions
const overlayVariants = {
  initial: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  animate: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  exit: { 
    opacity: 0.3,
    backdropFilter: 'blur(8px)',
  }
}

const overlayTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Set transitioning state
    setIsTransitioning(true)
    
    // Scroll to top smoothly on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Reset transitioning state after animation
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full min-h-screen bg-transparent"
          style={{
            // Hardware acceleration for ultra-smooth 60fps
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            perspective: 1000,
            willChange: 'transform, opacity, filter',
            transformStyle: 'preserve-3d',
          }}
          onAnimationStart={() => setIsTransitioning(true)}
          onAnimationComplete={() => setIsTransitioning(false)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Enhanced transition overlay - prevents visual artifacts and adds smooth fade */}
      <AnimatePresence>
        <motion.div
          key={`overlay-${pathname}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          transition={overlayTransition}
          className={`page-transition-overlay ${isTransitioning ? 'active' : ''}`}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9998,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 255, 136, 0.05) 50%, rgba(0, 0, 0, 0.3) 100%)',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            willChange: 'opacity, backdrop-filter',
          }}
        />
      </AnimatePresence>
    </>
  )
}