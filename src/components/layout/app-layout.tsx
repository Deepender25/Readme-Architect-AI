"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import ModernNavbar from '@/components/layout/modern-navbar'
import ModernFooter from '@/components/layout/modern-footer'
import ProfessionalBackground from '@/components/professional-background'
import PageTransition from '@/components/page-transition'
import Breadcrumbs from '@/components/layout/breadcrumbs'

interface AppLayoutProps {
  children: ReactNode
  showNavbar?: boolean
  showFooter?: boolean
  showBreadcrumbs?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  className?: string
}

export default function AppLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  showBreadcrumbs = true,
  maxWidth = '7xl',
  className = ''
}: AppLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden performance-optimized smooth-scroll no-lag">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <ProfessionalBackground />
      </div>
      
      {/* Navbar */}
      {showNavbar && (
        <div className="fixed top-0 left-0 right-0 z-[99999]">
          <ModernNavbar />
        </div>
      )}

      {/* Main Content */}
      <main className={`relative z-10 min-h-screen flex flex-col ${showNavbar ? 'pt-16 sm:pt-16' : ''}`}>
        {/* Breadcrumbs */}
        {showBreadcrumbs && !isHomePage && showNavbar && (
          <div className="border-b border-border/50 bg-black/20 backdrop-blur-sm">
            <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-3 ${maxWidthClasses[maxWidth]}`}>
              <Breadcrumbs />
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          <PageTransition>
            <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
              {children}
            </div>
          </PageTransition>
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <div className="relative z-10">
          <ModernFooter />
        </div>
      )}
    </div>
  )
}