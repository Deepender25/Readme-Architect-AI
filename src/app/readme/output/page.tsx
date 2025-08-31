"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const [error, setError] = useState<string | null>(null)

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

    // No data available
    setError('No README data available. Please generate a new README.')
    setIsLoading(false)
  }, [searchParams, router])

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full blur-lg" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading README</h2>
          <p className="text-gray-400">Preparing your generated documentation...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !readmeData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-full blur-lg" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error || 'README data not found'}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-green-500 text-black hover:bg-green-400 font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Generate New README
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="border-green-400/20 text-green-400 hover:bg-green-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[99999]">
        <ModernNavbar />
      </div>

      {/* Main Content */}
      <div className="pt-16">
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
      <ModernFooter />
    </div>
  )
}

export default function ReadmeOutputPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <p className="text-green-400">Loading README output...</p>
        </div>
      </div>
    }>
      <ReadmeOutputContent />
    </Suspense>
  )
}
