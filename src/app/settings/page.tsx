"use client"

import { Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { motion } from 'framer-motion'
import { 
  User, 
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

function SettingsContent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-foreground relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 z-0 w-full h-full">
          <MinimalGridBackground />
        </div>
        <div className="fixed top-0 left-0 right-0 z-50">
          <GitHubOAuthNavbar />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-4">
                Settings
              </h1>
              <p className="text-gray-400 text-lg">
                Customize your AutoDoc AI experience
              </p>
            </motion.div>

            {/* Settings Sections */}
            <div className="space-y-8">
              
              {/* Profile Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Profile</h2>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar_url}
                      alt={user?.name}
                      className="w-16 h-16 rounded-full border-2 border-green-400/50"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                      <p className="text-gray-400">@{user?.username}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <LogOut className="w-6 h-6 text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Account</h2>
                  </div>
                  
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="flex items-center gap-2 border-red-400/50 text-red-400 hover:bg-red-400/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>


    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  )
}