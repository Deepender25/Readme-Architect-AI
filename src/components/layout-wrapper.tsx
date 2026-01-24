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

import BreadcrumbSchema from '@/components/seo/breadcrumb-schema'

export default function LayoutWrapper({
  children,
  showNavbar = true,
  showFooter = true,
  showBreadcrumbs = true,
  maxWidth = '7xl',
  className = ''
}: LayoutWrapperProps) {
  return (
    <>
      {showBreadcrumbs && <BreadcrumbSchema />}
      <AppLayout
        showNavbar={showNavbar}
        showFooter={showFooter}
        showBreadcrumbs={showBreadcrumbs}
        maxWidth={maxWidth}
        className={className}
      >
        {children}
      </AppLayout>
    </>
  )
}