'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, ExternalLink, CheckCircle, UserX, RefreshCw, ArrowLeft } from 'lucide-react';
import LoadingPage from '@/components/ui/loading-page';
import EnhancedGridBackground from '@/components/enhanced-grid-background';

function SwitchAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Clear any existing auth state when component mounts
    document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('previous_github_account');
    localStorage.removeItem('show_account_selection');
  }, []);

  const handleStartLogout = () => {
    // Store the return URL for after the OAuth process
    const returnTo = searchParams.get('returnTo') || '/';
    try {
      sessionStorage.setItem('oauth_return_to', returnTo);
    } catch (error) {
      console.error('Failed to store return URL:', error);
    }

    // Move to step 2 and open GitHub logout
    setCurrentStep(2);
    window.open('https://github.com/logout', '_blank');
    
    // Auto-redirect after a delay
    setTimeout(() => {
      window.location.href = '/api/auth/github?force_account_selection=true';
    }, 3000);
  };

  const handleBackToLogin = () => {
    const returnTo = searchParams.get('returnTo');
    const loginUrl = `/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
    router.push(loginUrl);
  };

  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative flex items-center justify-center">
      {/* Enhanced Grid Background */}
      <EnhancedGridBackground />
      
      <div className="relative z-30 w-full max-w-md mx-auto p-6">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-4"
            animate={{ 
              boxShadow: [
                '0 0 8px rgba(0, 255, 136, 0.2)',
                '0 0 16px rgba(0, 255, 136, 0.4)',
                '0 0 8px rgba(0, 255, 136, 0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <UserX className="w-4 h-4" />
            Account Switching
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Switch Account
          </h1>
          
          <p className="text-gray-400 text-sm">
            Secure 2-step process
          </p>
        </motion.div>

        {/* Compact Process Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-green-400/20"
        >
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep >= 1 ? 'bg-green-500 text-black' : 'bg-gray-600 text-white'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentStep >= 2 ? 'bg-green-500' : 'bg-gray-600'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep >= 2 ? 'bg-green-500 text-black' : 'bg-gray-600 text-white'
              }`}>
                2
              </div>
            </div>
            <span className="text-xs text-gray-400">Step {currentStep} of 2</span>
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">Sign Out Current Account</h3>
                  <p className="text-gray-400 text-sm">We'll open GitHub logout in a new tab</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-xl transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open GitHub Logout
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">Choose New Account</h3>
                  <p className="text-gray-400 text-sm">Redirecting to GitHub login...</p>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"
                  />
                  <span className="text-green-300 font-medium text-sm">Redirecting...</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Back Button */}
          {currentStep === 1 && (
            <div className="mt-6 pt-4 border-t border-green-400/10">
              <motion.button
                whileHover={{ scale: 1.01, x: -2 }}
                onClick={handleBackToLogin}
                className="w-full text-gray-400 hover:text-green-400 font-medium py-2 rounded-lg hover:bg-gray-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-xs">
            This process ensures secure account switching by clearing your current session
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SwitchAccountPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading account switching..." />}>
      <SwitchAccountContent />
    </Suspense>
  );
}