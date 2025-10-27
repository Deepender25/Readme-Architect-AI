"use client"

import { Suspense } from 'react'
import Head from 'next/head'
import SimpleCentered from '@/components/blocks/heros/simple-centered'
import LayoutWrapper from '@/components/layout-wrapper'
import { faqSchema, howToSchema, serviceSchema } from '@/lib/structured-data'

function HomeContent() {
  return (
    <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
      <SimpleCentered />
    </LayoutWrapper>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        {/* Additional structured data for homepage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </Head>
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="cube-loading-container">
            <div className="flex flex-col items-center">
              <div className="cube-loader-global cube-loader-lg">
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-green-400 text-lg font-medium">Loading ReadmeForge...</p>
              </div>
            </div>
          </div>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </>
  )
}