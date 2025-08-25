"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Edit, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ModernReadmeOutput from '@/components/modern-readme-output'
import LayoutWrapper from '@/components/layout-wrapper'
import { useAuth, authenticatedFetch } from '@/lib/auth'

interface ReadmeData {
  id: string
  repository_url: string
  repository_name: string
  project_name?: string
  readme_content: string
  generation_params?: any
  created_at: string
  updated_at: string
}

export default function ReadmePage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [readmeData, setReadmeData] = useState<ReadmeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReadmeData = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        
        // Check for URL parameters first (direct sharing)
        const urlParams = new URLSearchParams(window.location.search)
        const content = urlParams.get('content')
        const repoUrl = urlParams.get('repo')
        const projectName = urlParams.get('project')
        
        if (content && repoUrl) {
          // Direct sharing via URL parameters
          setReadmeData({
            id: params.id as string,
            repository_url: decodeURIComponent(repoUrl),
            repository_name: decodeURIComponent(repoUrl).split('/').pop() || 'Unknown',
            project_name: projectName ? decodeURIComponent(projectName) : undefined,
            readme_content: decodeURIComponent(content),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          setLoading(false)
          return
        }

        // Try to fetch from history if user is authenticated
        if (isAuthenticated) {
          try {
            const response = await authenticatedFetch(`/api/history/${params.id}`)
            if (response.ok) {
              const data = await response.json()
              setReadmeData(data.item)
            } else {
              setError('README not found or access denied')
            }
          } catch (err) {
            setError('Failed to load README from history')
          }
        } else {
          setError('Authentication required to view saved READMEs')
        }
      } catch (err) {
        setError('Failed to load README data')
      } finally {
        setLoading(false)
      }
    }

    fetchReadmeData()
  }, [params.id, isAuthenticated])

  const handleGoBack = () => {
    router.back()
  }

  const handleEditMode = () => {
    if (readmeData) {
      // Navigate to editor with pre-filled data
      const searchParams = new URLSearchParams({
        repo: readmeData.repository_url,
        project: readmeData.project_name || '',
        content: readmeData.readme_content
      })
      router.push(`/generate?${searchParams.toString()}`)
    }
  }

  const handleShare = async () => {
    if (!readmeData) return

    const shareUrl = new URL(window.location.href)
    shareUrl.searchParams.set('content', encodeURIComponent(readmeData.readme_content))
    shareUrl.searchParams.set('repo', encodeURIComponent(readmeData.repository_url))
    if (readmeData.project_name) {
      shareUrl.searchParams.set('project', encodeURIComponent(readmeData.project_name))
    }

    try {
      await navigator.clipboard.writeText(shareUrl.toString())
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy share URL:', err)
    }
  }

  if (loading) {
    return (
      <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-black animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading README...</h2>
            <p className="text-gray-400">Please wait while we fetch your documentation</p>
          </motion.div>
        </div>
      </LayoutWrapper>
    )
  }

  if (error || !readmeData) {
    return (
      <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">README Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The requested README could not be loaded'}</p>
            <Button onClick={handleGoBack} variant="outline" className="border-green-400/20 text-green-400 hover:bg-green-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
      <div className="min-h-screen relative">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-green-400/20"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGoBack}
                  variant="ghost"
                  size="sm"
                  className="bg-gray-900/50 border border-green-400/20 hover:border-green-400/40 hover:bg-green-400/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <div>
                  <h1 className="font-semibold text-white">
                    {readmeData.project_name || readmeData.repository_name}
                  </h1>
                  <p className="text-sm text-gray-400">README Documentation</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleShare}
                  variant="ghost"
                  size="sm"
                  className="bg-gray-900/50 border border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-400/10"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  onClick={handleEditMode}
                  variant="ghost"
                  size="sm"
                  className="bg-gray-900/50 border border-green-400/20 hover:border-green-400/40 hover:bg-green-400/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* README Content */}
        <ModernReadmeOutput
          content={readmeData.readme_content}
          repositoryUrl={readmeData.repository_url}
          projectName={readmeData.project_name}
          generationParams={readmeData.generation_params}
          historyView={false}
          disableAutoSave={true} // Prevent duplicate saves
        />
      </div>
    </LayoutWrapper>
  )
}
