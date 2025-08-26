'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import LoadingPage from '@/components/ui/loading-page';

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            Switch Account
          </h1>
          <p className="text-gray-400 text-sm">
            Quick 2-step process
          </p>
        </motion.div>

        {/* 2-Step Process */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
        >
          <div className="space-y-4">
            {/* Step 1: Sign Out */}
            <div className={`p-4 rounded-lg border transition-colors ${
              currentStep === 1 
                ? 'border-green-500 bg-green-500/10' 
                : currentStep > 1 
                ? 'border-green-600 bg-green-600/10'
                : 'border-gray-700 bg-gray-800/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 1 
                    ? 'bg-green-500 text-black' 
                    : currentStep > 1 
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}>
                  {currentStep > 1 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold text-sm">1</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">Sign Out</h3>
                  <p className="text-gray-400 text-sm">Open GitHub logout</p>
                </div>
              </div>
              
              {currentStep === 1 && (
                <button
                  onClick={handleStartLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Logout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              
              {currentStep > 1 && (
                <div className="text-green-400 text-sm font-medium">✓ Completed</div>
              )}
            </div>

            {/* Step 2: Login */}
            <div className={`p-4 rounded-lg border transition-colors ${
              currentStep === 2 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-gray-700 bg-gray-800/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 2 
                    ? 'bg-green-500 text-black' 
                    : 'bg-gray-600 text-white'
                }`}>
                  <span className="font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">Login</h3>
                  <p className="text-gray-400 text-sm">Choose new account</p>
                </div>
              </div>
              
              {currentStep === 2 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-green-400 text-sm font-medium">Redirecting to GitHub...</span>
                  </div>
                </div>
              )}
              
              {currentStep < 2 && (
                <div className="text-gray-500 text-sm font-medium">Waiting...</div>
              )}
            </div>
          </div>

          {/* Back Button */}
          {currentStep === 1 && (
            <div className="text-center mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={handleBackToLogin}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          )}
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