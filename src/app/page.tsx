"use client"

import { useState, Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import SimpleCentered from '@/components/blocks/heros/simple-centered'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { CenteredWithLogo } from '@/components/blocks/footers/centered-with-logo'
import { motion } from 'framer-motion'

function HomeContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState({ name: 'Dev User', avatar: 'https://github.com/shadcn.png' })

  const handleAuthAction = () => {
    // Simulate GitHub OAuth login
    console.log('Authenticating with GitHub...')
    setIsAuthenticated(!isAuthenticated)
    // In a real app, you'd handle actual OAuth flow and set user data
    if (!isAuthenticated) {
      setUser({ name: 'Authenticated User', avatar: 'https://avatars.githubusercontent.com/u/59146197?v=4' })
    }
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background - positioned behind everything, covering full viewport */}
      <div className="fixed inset-0 z-0 w-full h-full">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SimpleCentered />
        </motion.div>
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