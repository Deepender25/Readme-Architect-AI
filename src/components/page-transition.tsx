"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
    y: 20
  },
  in: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    y: 0
  },
  out: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(10px)',
    y: -20
  }
}

const pageTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.4,
  filter: { duration: 0.3 }
}

const overlayVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  exit: { opacity: 1 }
}

const overlayTransition = {
  duration: 0.2,
  ease: "easeInOut"
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full min-h-screen bg-transparent smooth-page-transition"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Smooth transition overlay to prevent white flash */}
      <AnimatePresence>
        <motion.div
          key={`overlay-${pathname}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          transition={overlayTransition}
          className="page-transition-overlay"
        />
      </AnimatePresence>
    </>
  )
}