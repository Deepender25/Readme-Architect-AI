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
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="cube-loading-container">
          <div className="flex flex-col items-center">
            <div className="cube-loader-global cube-loader-lg">
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
            </div>
            <div className="mt-6 text-center">
              <div className="text-lg font-medium text-white mb-2">Loading README...</div>
              <div className="text-sm text-gray-400">Fetching your generated documentation</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !historyItem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-red-400" />
          <div className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">README Not Found</div>
          <div className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">{error || 'The requested README could not be found.'}</div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={goBack} variant="outline" className="glass-button border-green-400/20 text-green-400 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            <Button onClick={goHome} variant="outline" className="glass-button border-blue-400/20 text-blue-400 w-full sm:w-auto">
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
        
        {/* Enhanced Navigation Header - Single Line Layout */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-16 left-0 right-0 z-40 glass-navbar border-b border-green-400/20 border-t-0"
        >
          <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
            {/* Single Horizontal Line Layout */}
            <div className="flex items-center justify-between py-5">
              {/* Far Left - Back Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={goBack}
                  variant="outline"
                  size="sm"
                  className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10 h-10 px-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              </div>

              {/* Center - Title, Icon, and Metadata */}
              <div className="flex items-center gap-8 min-w-0 flex-1 justify-center mx-8">
                {/* Project Icon and Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-xl border border-green-400/20 flex-shrink-0 shadow-lg">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-xl font-bold text-white leading-tight">
                      {historyItem.project_name || historyItem.repository_name}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-green-400 font-medium">Generated README</p>
                    </div>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="hidden xl:flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-400/10 rounded-lg text-sm border border-green-400/20">
                    <Github className="w-4 h-4 text-green-400" />
                    <a 
                      href={historyItem.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-medium transition-colors"
                      title={historyItem.repository_url}
                    >
                      {historyItem.repository_url.replace('https://github.com/', '')}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-400/10 rounded-lg text-sm border border-blue-400/20">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium">{formatDate(historyItem.created_at)}</span>
                  </div>

                  {historyItem.updated_at !== historyItem.created_at && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-400/10 rounded-lg text-sm border border-orange-400/20">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-medium">{formatDate(historyItem.updated_at)}</span>
                    </div>
                  )}

                  {historyItem.generation_params.include_demo && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm border border-purple-400/30">
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-medium">Demo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Far Right - Home Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={goHome}
                  variant="outline" 
                  size="sm"
                  className="glass-button border-blue-400/20 text-blue-400 hover:bg-blue-400/10 h-10 px-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

            {/* Mobile/Tablet Metadata Row - Only visible on smaller screens */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="xl:hidden border-t border-gray-700/20 pt-4 pb-3"
            >
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-400/10 rounded-lg text-sm border border-green-400/20">
                  <Github className="w-4 h-4 text-green-400" />
                  <a 
                    href={historyItem.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-medium transition-colors"
                    title={historyItem.repository_url}
                  >
                    {historyItem.repository_url.replace('https://github.com/', '')}
                  </a>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-blue-400/10 rounded-lg text-sm border border-blue-400/20">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">{formatDate(historyItem.created_at)}</span>
                </div>

                {historyItem.generation_params.include_demo && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm border border-purple-400/30">
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">Demo</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Spacer to prevent overlap */}
        <div className="h-32"></div>

        {/* README Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="pb-8"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 xl:p-12">
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
