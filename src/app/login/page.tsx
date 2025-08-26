'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, RefreshCw, Play } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import LoadingPage from '@/components/ui/loading-page';
import ProfessionalBackground from '@/components/professional-background';

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
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      <ProfessionalBackground />
      
      <div className="relative isolate px-6 pt-0 lg:px-8 min-h-screen">
        <div className="relative z-30 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header matching main site exactly */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-8"
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(0, 255, 136, 0.3)',
                    '0 0 20px rgba(0, 255, 136, 0.5)',
                    '0 0 10px rgba(0, 255, 136, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Github className="w-4 h-4" />
                GitHub Authentication
              </motion.div>
              
              <motion.h1
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4 relative z-10"
                style={{ 
                  textShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.2)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))'
                }}
              >
                Welcome to
                <br />
                <span className="text-green-400">AutoDoc AI</span>
              </motion.h1>
              
              <p className="text-xl font-medium text-gray-300 max-w-md mx-auto leading-relaxed">
                Connect your GitHub account to start generating professional READMEs
              </p>
            </motion.div>

            {/* Login Card matching main site style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-green-400/20 rounded-3xl p-8 hover:border-green-400/50 hover:bg-black/60 transition-all duration-300 shadow-xl shadow-green-400/20">
                
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-300 text-center font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {previousAccount ? (
                    <>
                      {/* Previous Account with Profile Picture */}
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
                        <p className="text-gray-400">Continue with your GitHub account</p>
                      </div>
                      
                      <div className="bg-green-400/10 border border-green-400/30 rounded-2xl p-6 text-center">
                        <img
                          src={previousAccount.avatar_url}
                          alt={previousAccount.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-green-400/50 shadow-lg shadow-green-400/30"
                        />
                        <h3 className="text-xl font-semibold text-white mb-1">{previousAccount.name}</h3>
                        <p className="text-green-400 mb-6">@{previousAccount.username}</p>
                        
                        <div className="relative group/btn">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 group-hover/btn:opacity-50 transition-opacity" />
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleContinueWithPrevious}
                            disabled={isRedirecting}
                            className="relative w-full px-6 py-4 bg-green-500 text-black font-bold rounded-xl transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                            style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)' }}
                          >
                            {isRedirecting ? (
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <Play className="w-5 h-5" />
                                Continue as {previousAccount.name}
                                <ArrowRight className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-green-400/20"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-4 bg-black/40 text-gray-400 text-sm">or</span>
                        </div>
                      </div>

                      {/* Switch Account */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLoginWithDifferentAccount}
                        className="w-full px-6 py-4 bg-transparent border border-green-400/30 text-green-400 font-semibold rounded-xl hover:bg-green-400/10 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <Github className="w-5 h-5" />
                        Use Different Account
                      </motion.button>
                    </>
                  ) : (
                    <>
                      {/* First Time Login */}
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-3">Get Started</h2>
                        <p className="text-gray-400">Connect your GitHub account to begin</p>
                      </div>

                      <div className="relative group/btn">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 group-hover/btn:opacity-50 transition-opacity" />
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDirectLogin}
                          disabled={isRedirecting}
                          className="relative w-full px-8 py-4 bg-green-500 text-black font-bold rounded-xl transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                          style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)' }}
                        >
                          {isRedirecting ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              Sign in with GitHub
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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