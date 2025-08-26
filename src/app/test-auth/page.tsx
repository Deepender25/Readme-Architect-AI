'use client';

import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Github, LogOut, User, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, login, logout, refreshAuth } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<{
    previousAccount: string | null;
    showAccountSelection: string | null;
  }>({ previousAccount: null, showAccountSelection: null });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setLocalStorageData({
        previousAccount: localStorage.getItem('previous_github_account'),
        showAccountSelection: localStorage.getItem('show_account_selection')
      });
    }
  }, []);

  const handleTestLogin = () => {
    login('/test-auth');
  };

  const handleTestLogout = () => {
    logout();
  };

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('previous_github_account');
      localStorage.removeItem('show_account_selection');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Authentication Test Page</h1>
          
          {/* Current State */}
          <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Current Authentication State</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="font-medium">Loading:</span> {isLoading ? 'Yes' : 'No'}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Authenticated:</span> {isAuthenticated ? 'Yes' : 'No'}
              </p>
              {user && (
                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="font-medium text-white mb-2">User Information:</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-green-500/50"
                    />
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400">@{user.username}</p>
                      {user.email && <p className="text-gray-500 text-sm">{user.email}</p>}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">GitHub ID: {user.github_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Local Storage State */}
          <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Local Storage State</h2>
            {isClient ? (
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <span className="font-medium">Previous Account:</span>{' '}
                  {localStorageData.previousAccount ? 'Stored' : 'None'}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Show Account Selection:</span>{' '}
                  {localStorageData.showAccountSelection || 'false'}
                </p>
                {localStorageData.previousAccount && (
                  <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Previous Account Data:</h3>
                    <pre className="text-xs text-gray-400 overflow-auto">
                      {JSON.stringify(
                        JSON.parse(localStorageData.previousAccount || '{}'),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Loading client data...</p>
            )}
          </div>

          {/* Test Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Test Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTestLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Github className="w-5 h-5" />
                  )}
                  Test Login
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTestLogout}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Test Logout
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearLocalStorage}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Clear Local Storage
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refreshAuth}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Auth Status
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('show_account_selection', 'true');
                    window.location.reload();
                  }
                }}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <User className="w-5 h-5" />
                Force Account Selection
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/login?select=true'}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
              >
                <Github className="w-5 h-5" />
                Go to Login Page (Select)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/login'}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                <Github className="w-5 h-5" />
                Go to Login Page
              </motion.button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700/50 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Test Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-200">
              <li>First, test a fresh login (clear local storage first)</li>
              <li>After logging in, test logout</li>
              <li>Try logging in again - should show account selection</li>
              <li>Test "Continue as [user]" option</li>
              <li>Test "Use different GitHub account" option</li>
              <li>Verify the login page shows proper UI states</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}