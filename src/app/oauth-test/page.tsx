'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export default function OAuthTestPage() {
  const clientId = 'Ov23liJqlWzXgWeeX0NZ';
  const redirectUri = 'https://autodocai.vercel.app/api/auth/callback';
  const scope = 'repo';
  const state = 'oauth_login';

  const directOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  const testSteps = [
    {
      step: 1,
      title: 'Check GitHub OAuth App Settings',
      description: 'Verify your GitHub OAuth app has the correct callback URL',
      action: 'Visit GitHub Settings',
      url: 'https://github.com/settings/developers',
      status: 'manual'
    },
    {
      step: 2,
      title: 'Test Direct OAuth URL',
      description: 'Click this link to test GitHub OAuth directly',
      action: 'Test OAuth',
      url: directOAuthUrl,
      status: 'test'
    },
    {
      step: 3,
      title: 'Test App Login Flow',
      description: 'Test the complete login flow through your app',
      action: 'Go to Login',
      url: '/login',
      status: 'test'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 136, 0.3)',
                  '0 0 40px rgba(0, 255, 136, 0.5)',
                  '0 0 20px rgba(0, 255, 136, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Github className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">GitHub OAuth Test</h1>
            <p className="text-gray-400">Debug and test your GitHub OAuth configuration</p>
          </div>

          {/* Current Configuration */}
          <div className="mb-8 p-6 bg-gray-800/50 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Current Configuration</h2>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 w-32">Client ID:</span>
                <span className="text-green-400">{clientId}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 w-32">Redirect URI:</span>
                <span className="text-blue-400">{redirectUri}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 w-32">Scope:</span>
                <span className="text-yellow-400">{scope}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 w-32">State:</span>
                <span className="text-purple-400">{state}</span>
              </div>
            </div>
          </div>

          {/* Test Steps */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Test Steps</h2>
            
            {testSteps.map((test, index) => (
              <motion.div
                key={test.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {test.step}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{test.title}</h3>
                    <p className="text-gray-400 mb-4">{test.description}</p>
                    
                    <motion.a
                      href={test.url}
                      target={test.status === 'manual' ? '_blank' : '_self'}
                      rel={test.status === 'manual' ? 'noopener noreferrer' : undefined}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {test.status === 'manual' ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <Github className="w-4 h-4" />
                      )}
                      {test.action}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expected Results */}
          <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700/50 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-300 mb-4">Expected Results</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-blue-200">Step 1: GitHub OAuth app should show callback URL: <code className="text-blue-300">{redirectUri}</code></span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-blue-200">Step 2: Should redirect to GitHub OAuth, then back to your app with success</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-blue-200">Step 3: Should show professional login page and complete OAuth flow</span>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-8 p-6 bg-red-900/20 border border-red-700/50 rounded-xl">
            <h2 className="text-xl font-semibold text-red-300 mb-4">Common Issues</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <span className="text-red-200 font-medium">GitHub Error: "redirect_uri mismatch"</span>
                  <p className="text-red-300 text-sm mt-1">Your GitHub OAuth app callback URL doesn't match. Update it to: <code>{redirectUri}</code></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <span className="text-red-200 font-medium">404 Not Found</span>
                  <p className="text-red-300 text-sm mt-1">Your Vercel deployment might not be working or the API routes are not deployed correctly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <span className="text-red-200 font-medium">Application Misconfigured</span>
                  <p className="text-red-300 text-sm mt-1">Check your Client ID and Client Secret in the environment variables.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}