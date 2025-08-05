"use client"

import { useState, useEffect, Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import SimpleCentered from '@/components/blocks/heros/simple-centered'
import GitHubReadmeEditor from '@/components/github-readme-editor'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { CenteredWithLogo } from '@/components/blocks/footers/centered-with-logo'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

function HomeContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [user, setUser] = useState({ name: 'Dev User', avatar: 'https://github.com/shadcn.png' })
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Check if we should show the editor based on URL parameter
    const shouldShowEditor = searchParams.get('editor') === 'true'
    setShowEditor(shouldShowEditor)
  }, [searchParams])

  const handleAuthAction = () => {
    // Simulate GitHub OAuth login
    console.log('Authenticating with GitHub...')
    setIsAuthenticated(!isAuthenticated)
    // In a real app, you'd handle actual OAuth flow and set user data
    if (!isAuthenticated) {
      setUser({ name: 'Authenticated User', avatar: 'https://avatars.githubusercontent.com/u/59146197?v=4' })
      setShowEditor(true)
    } else {
      setShowEditor(false)
    }
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setIsAuthenticated(false)
    // Remove the editor parameter from URL
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background - positioned behind everything */}
      <div className="absolute inset-0 z-0">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar - positioned above background, always visible */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar 
          isAuthenticated={isAuthenticated} 
          user={user}
          onAuthAction={handleAuthAction} 
        />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen pt-16">
        <AnimatePresence mode="wait">
          {!showEditor ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SimpleCentered />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen pt-4"
            >
              <GitHubReadmeEditor onClose={handleEditorClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - positioned at bottom */}
      <div className="relative z-10">
        <CenteredWithLogo />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}