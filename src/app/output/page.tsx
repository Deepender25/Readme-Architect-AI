"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ModernReadmeOutput from '@/components/modern-readme-output'
import ModernNavbar from '@/components/layout/modern-navbar'
import ModernFooter from '@/components/layout/modern-footer'

interface ReadmeData {
  content: string;
  repositoryUrl: string;
  projectName: string;
  generationParams: any;
  createdAt: string;
}

function ReadmeOutputContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [readmeData, setReadmeData] = useState<ReadmeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Try to get data from sessionStorage first
    const sessionData = sessionStorage.getItem('readme-output-data')
    if (sessionData) {
      try {
        const data = JSON.parse(sessionData)
        setReadmeData(data)
        setIsLoading(false)
        // Clear the session data after loading
        sessionStorage.removeItem('readme-output-data')
        return
      } catch (err) {
        console.warn('Failed to parse session data:', err)
      }
    }

    // If no session data, check if we have URL parameters for a history item
    const historyId = searchParams.get('id')
    if (historyId) {
      // Redirect to the existing history page
      router.replace(`/output/${historyId}`)
      return
    }

    // No data available - redirect to generator page
    console.log('No README data found, redirecting to generator page...')
    router.push('/generator')
  }, [searchParams, router])

  const handleGoBack = () => {
    router.push('/generator')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="cube-loading-container">
            <div className="flex flex-col items-center">
              <div className="cube-loader-global">
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Loading README</h2>
                <p className="text-gray-400">Preparing your generated documentation...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // If no readmeData, the useEffect will handle redirect to generator
  if (!readmeData) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="cube-loading-container">
            <div className="flex flex-col items-center">
              <div className="cube-loader-global">
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Redirecting...</h2>
                <p className="text-gray-400">Taking you to the generator...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[99999]">
        <ModernNavbar />
      </div>

      {/* Main Content */}
      <div className="pt-16 relative z-10">
        <ModernReadmeOutput
          content={readmeData.content}
          repositoryUrl={readmeData.repositoryUrl}
          projectName={readmeData.projectName}
          generationParams={readmeData.generationParams}
          createdAt={readmeData.createdAt}
          onClose={() => handleGoBack()}
        />
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <ModernFooter />
      </div>
    </div>
  )
}

export default function ReadmeOutputPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center relative z-10">
        <div className="cube-loading-container">
          <div className="flex flex-col items-center">
            <div className="cube-loader-global">
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-400 text-lg font-medium">Loading README output...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ReadmeOutputContent />
    </Suspense>
  )
}
