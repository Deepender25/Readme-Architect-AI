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
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import ModernReadmeOutput from '@/components/modern-readme-output'
import withAuth from '@/components/withAuth'
import ModernNavbar from '@/components/layout/modern-navbar'
import ModernFooter from '@/components/layout/modern-footer'

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
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-green-400" />
          <div className="text-lg font-medium text-white mb-2">Loading README...</div>
          <div className="text-sm text-gray-400">Fetching your generated documentation</div>
        </div>
      </div>
    )
  }

  if (error || !historyItem) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
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
    )
  }

  return (
    <div className="min-h-screen bg-black relative"
         style={{
           transform: 'translate3d(0, 0, 0)',
           willChange: 'auto',
           backfaceVisibility: 'hidden'
         }}>
        {/* Top Navbar */}
        <div className="fixed top-0 left-0 right-0 z-[99999]">
          <ModernNavbar />
        </div>
        
        {/* Enhanced Navigation Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-16 left-0 right-0 z-40 glass-navbar border-b border-green-400/20 border-t-0"
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

        {/* README Content - Uses main page scroll for continuous scrolling */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="pt-36 pb-8"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <div className="glass rounded-2xl p-8 lg:p-12">
                <div 
                  className="prose prose-invert prose-green max-w-none modern-readme-preview"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(marked(historyItem.readme_content) as string) 
                  }}
                />
              </div>
            </div>
          </div>
        </motion.main>

        {/* Footer */}
        <ModernFooter />
      </div>
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
