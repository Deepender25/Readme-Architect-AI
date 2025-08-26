'use client';

import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';
import { Github, LogOut, User } from 'lucide-react';

export default function TestLoginPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Login Flow Test</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => login()}
              className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors mx-auto"
            >
              <Github className="w-5 h-5" />
              Test Login Flow
            </motion.button>
            
            <p className="text-gray-400 text-sm mt-4">
              This should redirect to the professional login page
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 p-4 bg-green-900/20 rounded-lg">
              <img
                src={user?.avatar_url}
                alt={user?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-gray-400">@{user?.username}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors mx-auto"
            >
              <LogOut className="w-5 h-5" />
              Test Logout Flow
            </motion.button>
            
            <p className="text-gray-400 text-sm">
              This should show the logout modal and then redirect to login page on next login attempt
            </p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Click "Test Login Flow" - should go to /login page</li>
            <li>On login page, should see professional UI with GitHub button</li>
            <li>After login, should return here with user info</li>
            <li>Click "Test Logout Flow" - should show confirmation modal</li>
            <li>After logout, click login again - should show account selection</li>
          </ol>
        </div>
      </div>
    </div>
  );
}