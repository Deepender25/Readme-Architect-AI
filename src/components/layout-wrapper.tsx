"use client"

import { ReactNode } from 'react'
import AppLayout from '@/components/layout/app-layout'

interface LayoutWrapperProps {
  children: ReactNode
  showNavbar?: boolean
  showFooter?: boolean
  showBreadcrumbs?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  className?: string
}

export default function LayoutWrapper({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  showBreadcrumbs = true,
  maxWidth = '7xl',
  className = ''
}: LayoutWrapperProps) {
  return (
    <AppLayout
      showNavbar={showNavbar}
      showFooter={showFooter}
      showBreadcrumbs={showBreadcrumbs}
      maxWidth={maxWidth}
      className={className}
    >
      {children}
    </AppLayout>
  )
}