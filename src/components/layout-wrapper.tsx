"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { CenteredWithLogo } from '@/components/blocks/footers/centered-with-logo'
import PageTransition from '@/components/page-transition'

interface LayoutWrapperProps {
  children: ReactNode
  showNavbar?: boolean
  showFooter?: boolean
}

export default function LayoutWrapper({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden performance-optimized smooth-scroll no-lag">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar */}
      {showNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <GitHubOAuthNavbar />
        </div>
      )}

      {/* Main Content with Page Transitions */}
      <main className={`relative z-10 min-h-screen ${showNavbar ? 'pt-16' : ''}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Footer */}
      {showFooter && (
        <div className="relative z-10">
          <CenteredWithLogo />
        </div>
      )}
    </div>
  )
}