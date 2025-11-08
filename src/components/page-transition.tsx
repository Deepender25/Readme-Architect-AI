"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

// Professional page transition variants - Apple-inspired smooth motion
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 12,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -12,
  }
}

// Smooth, natural timing - based on Apple's Human Interface Guidelines
const pageTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.1, 0.25, 1], // Apple's standard easing
  duration: 0.4,
}

// Backdrop overlay for seamless transitions
const overlayVariants = {
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 0,
  },
  exit: { 
    opacity: 0,
  }
}

const overlayTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Material Design standard easing
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

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
            // Hardware acceleration for smooth 60fps
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            perspective: 1000,
            willChange: 'transform, opacity',
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Smooth transition overlay - prevents visual artifacts */}
      <AnimatePresence>
        <motion.div
          key={`overlay-${pathname}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          transition={overlayTransition}
          className="page-transition-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      </AnimatePresence>
    </>
  )
}