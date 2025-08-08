"use client"

import { useState, Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { motion } from 'framer-motion'
import RepositoriesList from '@/components/repositories-list'

function RepositoriesContent() {
  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background - positioned behind everything, covering full viewport */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar - positioned above background, always visible */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-4">
                My Repositories
              </h1>
              <p className="text-gray-400 text-lg">
                Browse and generate READMEs for your GitHub repositories
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
              <div className="relative">
                <RepositoriesList />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function RepositoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RepositoriesContent />
    </Suspense>
  )
}