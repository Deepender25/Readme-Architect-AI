'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, RefreshCw } from 'lucide-react';
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
      if (stored) {
        const account = JSON.parse(stored);
        setPreviousAccount(account);
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
    
    window.location.href = '/api/auth/github';
  };

  const handleLoginWithDifferentAccount = () => {
    // Redirect to the dedicated account switching page
    const returnToParam = searchParams.get('returnTo');
    const switchUrl = `/switch-account${returnToParam ? `?returnTo=${encodeURIComponent(returnToParam)}` : ''}`;
    router.push(switchUrl);
  };

  const handleDirectLogin = () => {
    setIsRedirecting(true);
    
    // Store the return URL in sessionStorage
    const returnToParam = searchParams.get('returnTo');
    const returnTo = (returnToParam && typeof returnToParam === 'string') ? returnToParam : '/';
    
    try {
      sessionStorage.setItem('oauth_return_to', returnTo);
    } catch (error) {
      console.error('Failed to store return URL:', error);
    }
    
    // Direct redirect to GitHub OAuth
    window.location.href = '/api/auth/github';
  };

  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Github className="w-6 h-6 text-black" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            AutoDoc AI
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to continue
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {previousAccount ? (
              <>
                {/* Previous Account */}
                <div className="text-center mb-4">
                  <img
                    src={previousAccount.avatar_url}
                    alt={previousAccount.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-700"
                  />
                  <h3 className="font-medium text-white">{previousAccount.name}</h3>
                  <p className="text-gray-400 text-sm">@{previousAccount.username}</p>
                </div>
                
                <button
                  onClick={handleContinueWithPrevious}
                  disabled={isRedirecting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isRedirecting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue as {previousAccount.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-gray-900 text-gray-500">or</span>
                  </div>
                </div>

                <button
                  onClick={handleLoginWithDifferentAccount}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Use Different Account</span>
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-lg font-medium text-white mb-1">Get Started</h2>
                  <p className="text-gray-400 text-sm">Connect your GitHub account</p>
                </div>

                <button
                  onClick={handleDirectLogin}
                  disabled={isRedirecting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isRedirecting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>Sign in with GitHub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
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