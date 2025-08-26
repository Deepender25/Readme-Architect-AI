'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowRight, User, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import LoadingPage from '@/components/ui/loading-page';

interface PreviousAccount {
  username: string;
  name: string;
  avatar_url: string;
  email?: string;
  last_login: string;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [previousAccount, setPreviousAccount] = useState<PreviousAccount | null>(null);
  const [showAccountSelection, setShowAccountSelection] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is already authenticated, redirect to intended page or home
    if (isAuthenticated && user) {
      const returnTo = searchParams.get('returnTo') || '/';
      router.replace(returnTo);
      return;
    }

    // Check for error parameters
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'token_failed':
          setError('Failed to obtain access token. Please try again.');
          break;
        case 'user_failed':
          setError('Failed to get user information. Please try again.');
          break;
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        default:
          setError('An error occurred during login. Please try again.');
      }
    }

    // Load previous account info
    loadPreviousAccount();
  }, [isAuthenticated, user, router, searchParams]);

  const loadPreviousAccount = () => {
    try {
      const stored = localStorage.getItem('previous_github_account');
      const shouldShowSelection = localStorage.getItem('show_account_selection');
      
      if (stored) {
        const account = JSON.parse(stored);
        setPreviousAccount(account);
        
        // Show account selection if flag is set or if explicitly requested
        if (shouldShowSelection === 'true' || searchParams.get('select') === 'true') {
          setShowAccountSelection(true);
          localStorage.removeItem('show_account_selection');
        }
      }
    } catch (error) {
      console.error('Failed to load previous account:', error);
    }
  };

  const handleContinueWithPrevious = () => {
    setIsRedirecting(true);
    
    // Store the return URL in sessionStorage
    const returnToParam = searchParams.get('returnTo');
    const returnTo = (returnToParam && typeof returnToParam === 'string') ? returnToParam : '/';
    
    try {
      sessionStorage.setItem('oauth_return_to', returnTo);
    } catch (error) {
      console.error('Failed to store return URL:', error);
    }
    
    // Clear the show selection flag since user chose to continue
    localStorage.removeItem('show_account_selection');
    window.location.href = '/api/auth/github';
  };

  const handleLoginWithDifferentAccount = () => {
    setIsRedirecting(true);
    
    // Store the return URL in sessionStorage
    const returnToParam = searchParams.get('returnTo');
    const returnTo = (returnToParam && typeof returnToParam === 'string') ? returnToParam : '/';
    
    try {
      sessionStorage.setItem('oauth_return_to', returnTo);
    } catch (error) {
      console.error('Failed to store return URL:', error);
    }
    
    // Clear previous account info
    localStorage.removeItem('previous_github_account');
    localStorage.removeItem('show_account_selection');
    
    // Direct redirect to GitHub OAuth
    window.location.href = '/api/auth/github';
  };

  const handleDirectLogin = () => {
    setIsRedirecting(true);
    
    // Store the return URL in sessionStorage
    const returnToParam = searchParams.get('returnTo');
    const returnTo = (returnToParam && typeof returnToParam === 'string') ? returnToParam : '/';
    
    console.log('Direct login - storing returnTo:', returnTo);
    
    try {
      sessionStorage.setItem('oauth_return_to', returnTo);
    } catch (error) {
      console.error('Failed to store return URL:', error);
    }
    
    // Direct redirect to GitHub OAuth
    window.location.href = '/api/auth/github';
  };

  const formatLastLogin = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
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
          
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to AutoDoc AI</h1>
          <p className="text-gray-400">Sign in with your GitHub account to continue</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl"
          >
            <p className="text-red-300 text-sm text-center">{error}</p>
          </motion.div>
        )}

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {showAccountSelection && previousAccount ? (
              <motion.div
                key="account-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Continue with your account?</h2>
                  <p className="text-gray-400 text-sm">You previously signed in with this GitHub account</p>
                </div>

                {/* Previous Account Card */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={previousAccount.avatar_url}
                      alt={previousAccount.name}
                      className="w-12 h-12 rounded-full border-2 border-green-500/50"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{previousAccount.name}</h3>
                      <p className="text-sm text-gray-400 truncate">@{previousAccount.username}</p>
                      <p className="text-xs text-gray-500">Last login: {formatLastLogin(previousAccount.last_login)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueWithPrevious}
                    disabled={isRedirecting}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRedirecting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <User className="w-5 h-5" />
                        <span>Continue as {previousAccount.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLoginWithDifferentAccount}
                    disabled={isRedirecting}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Github className="w-5 h-5" />
                    <span>Use different GitHub account</span>
                  </motion.button>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Note: If GitHub doesn't show account selection, you may need to{' '}
                      <a 
                        href="https://github.com/logout" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 underline"
                      >
                        sign out of GitHub
                      </a>{' '}
                      first.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowAccountSelection(false)}
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Back to login options
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="direct-login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">Sign in to continue</h2>
                  <p className="text-gray-400 text-sm">Connect your GitHub account to access all features</p>
                </div>

                {/* Direct Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDirectLogin}
                  disabled={isRedirecting}
                  className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-green-500/50 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isRedirecting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Github className="w-5 h-5 group-hover:text-green-400 transition-colors" />
                      <span>Continue with GitHub</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* Previous Account Option */}
                {previousAccount && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900 text-gray-400">or</span>
                    </div>
                  </div>
                )}

                {previousAccount && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAccountSelection(true)}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 text-gray-300 font-medium rounded-xl transition-all"
                  >
                    <img
                      src={previousAccount.avatar_url}
                      alt={previousAccount.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>Continue as {previousAccount.name}</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-green-400 hover:text-green-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-green-400 hover:text-green-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading login page..." />}>
      <LoginPageContent />
    </Suspense>
  );
}