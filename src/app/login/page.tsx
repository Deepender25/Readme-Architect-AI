'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, RefreshCw, Sparkles, Bot, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import LoadingPage from '@/components/ui/loading-page';
import EnhancedGridBackground from '@/components/enhanced-grid-background';

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
      {/* Enhanced Grid Background */}
      <EnhancedGridBackground />
      
      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="text-center mb-16 hardware-accelerated"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-white leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.3))'
                  }}
                >
                  AutoDoc AI
                </h1>
                
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium"
                  animate={{ 
                    boxShadow: [
                      '0 0 5px rgba(0, 255, 136, 0.3)',
                      '0 0 15px rgba(0, 255, 136, 0.4)',
                      '0 0 5px rgba(0, 255, 136, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                  AI-Powered README Generator
                </motion.div>
              </div>
              
              <p className="text-gray-300 text-xl font-light max-w-md mx-auto leading-relaxed">
                Sign in to continue your journey
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative bg-black/60 backdrop-blur-xl border border-green-400/20 rounded-2xl p-8 shadow-2xl hover:border-green-400/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-2xl" />
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent rounded-xl" />
                  <p className="relative text-red-300 text-sm text-center font-medium">{error}</p>
                </motion.div>
              )}

              <div className="relative space-y-6">
                {previousAccount ? (
                  <>
                    {/* Previous Account - Enhanced */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center mb-6"
                    >
                      <div className="relative inline-block mb-4">
                        <img
                          src={previousAccount.avatar_url}
                          alt={previousAccount.name}
                          className="w-20 h-20 rounded-2xl mx-auto border-2 border-green-400/50 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                          <Bot className="w-3 h-3 text-black" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">{previousAccount.name || 'GitHub User'}</h3>
                      <p className="text-green-400 font-medium">
                        {previousAccount.username ? `@${previousAccount.username}` : 'GitHub Account'}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">Welcome back! Continue where you left off</p>
                    </motion.div>
                    
                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinueWithPrevious}
                      disabled={isRedirecting}
                      className="relative w-full group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-xl" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-black font-bold rounded-xl transition-all duration-300 disabled:opacity-50">
                        {isRedirecting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>Continue as {previousAccount.name || previousAccount.username || 'Previous User'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </motion.button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-green-400/20"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-black/60 text-gray-400 font-medium">or</span>
                      </div>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLoginWithDifferentAccount}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-green-400/30 hover:border-green-400/50 hover:bg-green-400/5 text-green-400 hover:text-green-300 font-semibold rounded-xl transition-all duration-300"
                    >
                      <Github className="w-5 h-5" />
                      <span>Use Different Account</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    {/* First Time Login - Enhanced */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center mb-8"
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
                      <p className="text-gray-400 leading-relaxed">Connect your GitHub account to unlock AI-powered README generation</p>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDirectLogin}
                      disabled={isRedirecting}
                      className="relative w-full group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-xl" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-black font-bold rounded-xl transition-all duration-300 disabled:opacity-50">
                        {isRedirecting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Github className="w-5 h-5" />
                            <span>Sign in with GitHub</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </motion.button>
                    
                    {/* Additional Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 p-4 bg-green-400/5 border border-green-400/20 rounded-xl"
                    >
                      <p className="text-green-300 text-sm text-center font-medium mb-2">✨ What you'll get:</p>
                      <ul className="text-gray-300 text-sm space-y-1 text-center">
                        <li>• AI-powered README generation</li>
                        <li>• Project history &amp; management</li>
                        <li>• Secure GitHub integration</li>
                      </ul>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
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