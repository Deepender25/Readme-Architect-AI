"use client"

import { Suspense } from 'react'
import SimpleCentered from '@/components/blocks/heros/simple-centered'
import LayoutWrapper from '@/components/layout-wrapper'

function HomeContent() {
  return (
    <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
      <SimpleCentered />
    </LayoutWrapper>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <p className="text-green-400">Loading AutoDoc AI...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}