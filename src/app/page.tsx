"use client"

import { Suspense } from 'react'
import SimpleCentered from '@/components/blocks/heros/simple-centered'
import LayoutWrapper from '@/components/layout-wrapper'

function HomeContent() {
  return (
    <LayoutWrapper>
      <SimpleCentered />
    </LayoutWrapper>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}