"use client"

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  FileText,
  Calendar,
  Clock,
  Github,
  BarChart3,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import ModernReadmeOutput from '@/components/modern-readme-output'
import withAuth from '@/components/withAuth'
import LayoutWrapper from '@/components/layout-wrapper'

interface HistoryItem {
  id: string;
  repository_name: string;
  repository_url: string;
  project_name: string | null;
  created_at: string;
  updated_at: string;
  readme_content: string;
  generation_params: {
    include_demo: boolean;
    num_screenshots: number;
    num_videos: number;
  };
}

function ReadmeViewContent() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const historyId = params.id as string

  useEffect(() => {
    if (isAuthenticated && historyId) {
      fetchHistoryItem()
    }
  }, [isAuthenticated, historyId])

  const fetchHistoryItem = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/history/${historyId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('README not found in your history')
        }
        throw new Error('Failed to load README')
      }
      
      const data = await response.json()
      setHistoryItem(data.item)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load README'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const goBack = () => {
    router.push('/history')
  }

  const goHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-green-400" />
            <div className="text-lg font-medium text-white mb-2">Loading README...</div>
            <div className="text-sm text-gray-400">Fetching your generated documentation</div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (error || !historyItem) {
    return (
      <LayoutWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-400" />
            <div className="text-xl font-bold text-white mb-4">README Not Found</div>
            <div className="text-gray-400 mb-6">{error || 'The requested README could not be found.'}</div>
            <div className="flex gap-3 justify-center">
              <Button onClick={goBack} variant="outline" className="glass-button border-green-400/20 text-green-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
              <Button onClick={goHome} variant="outline" className="glass-button border-blue-400/20 text-blue-400">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-black">
        {/* Enhanced Navigation Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 glass-navbar border-b border-green-400/20"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Navigation & Title */}
              <div className="flex items-center gap-6">
                <Button
                  onClick={goBack}
                  variant="outline"
                  size="sm"
                  className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-400/20 rounded-lg">
                    <FileText className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">
                      {historyItem.project_name || historyItem.repository_name}
                    </h1>
                    <p className="text-sm text-gray-400">Generated README</p>
                  </div>
                </div>
              </div>

              {/* Right Section - Home Button */}
              <Button
                onClick={goHome}
                variant="outline" 
                size="sm"
                className="glass-button border-blue-400/20 text-blue-400 hover:bg-blue-400/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>

            {/* Metadata Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-green-400/10"
            >
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Github className="w-4 h-4 text-green-400" />
                <span className="font-medium">Repository:</span>
                <a 
                  href={historyItem.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  {historyItem.repository_url}
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(historyItem.created_at)}</span>
              </div>

              {historyItem.updated_at !== historyItem.created_at && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="font-medium">Updated:</span>
                  <span>{formatDate(historyItem.updated_at)}</span>
                </div>
              )}

              {historyItem.generation_params.include_demo && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span>Demo Included</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.header>

        {/* README Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ModernReadmeOutput 
            content={historyItem.readme_content}
            repositoryUrl={historyItem.repository_url}
            projectName={historyItem.project_name || historyItem.repository_name}
            generationParams={historyItem.generation_params}
            disableAutoSave={true}
            historyView={false} // Set to false for standalone page
          />
        </motion.main>
      </div>
    </LayoutWrapper>
  )
}

const ReadmeViewPage = withAuth(ReadmeViewContent)

export default function ReadmeViewPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-green-400" />
          <p className="text-green-400">Loading README...</p>
        </div>
      </div>
    }>
      <ReadmeViewPage />
    </Suspense>
  )
}
