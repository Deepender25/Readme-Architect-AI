'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, ExternalLink, CheckCircle, Sparkles, BrainCircuit, UserX, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      {/* Enhanced Grid Background */}
      <EnhancedGridBackground />
      
      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-4"
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(0, 255, 136, 0.3)',
                      '0 0 20px rgba(0, 255, 136, 0.5)',
                      '0 0 10px rgba(0, 255, 136, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <UserX className="w-4 h-4" />
                  Account Switching
                </motion.div>
                
                <h1 className="text-5xl font-bold text-white leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.3))'
                  }}
                >
                  Switch Account
                </h1>
              </div>
              
              <p className="text-gray-300 text-xl font-light max-w-md mx-auto leading-relaxed">
                Quick & secure 2-step process
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced 2-Step Process */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative bg-black/60 backdrop-blur-xl border border-green-400/20 rounded-3xl p-8 shadow-2xl hover:border-green-400/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-3xl" />
              <div className="relative space-y-6 mb-8">
                {/* Step 1: Enhanced Sign Out */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                    currentStep === 1 
                      ? 'border-green-500 bg-green-500/15 shadow-lg shadow-green-500/20' 
                      : currentStep > 1 
                      ? 'border-green-600 bg-green-600/15'
                      : 'border-gray-700/50 bg-gray-800/20'
                  }`}
                >
                  <div className="flex items-center gap-5 mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        currentStep === 1 
                          ? 'bg-green-500 text-black' 
                          : currentStep > 1 
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      animate={currentStep === 1 ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: currentStep === 1 ? Infinity : 0 }}
                    >
                      {currentStep > 1 ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="font-bold text-lg">1</span>
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">Sign Out</h3>
                      <p className="text-gray-400">Open GitHub logout page in new tab</p>
                    </div>
                  </div>
                  
                  {currentStep === 1 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartLogout}
                      className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl transition-all duration-300 shadow-lg"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Open GitHub Logout</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  )}
                  
                  {currentStep > 1 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-green-400 font-semibold"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Step Completed Successfully</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Step 2: Enhanced Login */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                    currentStep === 2 
                      ? 'border-green-500 bg-green-500/15 shadow-lg shadow-green-500/20' 
                      : 'border-gray-700/50 bg-gray-800/20'
                  }`}
                >
                  <div className="flex items-center gap-5 mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        currentStep === 2 
                          ? 'bg-green-500 text-black' 
                          : 'bg-gray-600 text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      animate={currentStep === 2 ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: currentStep === 2 ? Infinity : 0 }}
                    >
                      <span className="font-bold text-lg">2</span>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">New Login</h3>
                      <p className="text-gray-400">Choose your new GitHub account</p>
                    </div>
                  </div>
                  
                  {currentStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative p-4 bg-green-500/15 border border-green-500/30 rounded-xl backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-xl" />
                      <div className="relative flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"
                        />
                        <span className="text-green-300 font-semibold">Redirecting to GitHub...</span>
                      </div>
                    </motion.div>
                  )}
                  
                  {currentStep < 2 && (
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <RefreshCw className="w-4 h-4" />
                      <span>Waiting for step 1...</span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Enhanced Back Button */}
              {currentStep === 1 && (
                <div className="relative pt-6 border-t border-green-400/20">
                  <motion.button
                    whileHover={{ scale: 1.02, x: -2 }}
                    onClick={handleBackToLogin}
                    className="w-full text-gray-400 hover:text-green-400 font-medium py-3 rounded-xl hover:bg-gray-500/10 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    ← Back to Login
                  </motion.button>
                </div>
              )}
              
              {/* Progress indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-2xl" />
                <div className="relative text-center">
                  <p className="text-blue-200 text-sm font-medium mb-2">
                    🔄 Account Switch in Progress
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentStep >= 1 ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                    <div className={`w-8 h-0.5 transition-colors duration-300 ${
                      currentStep >= 2 ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentStep >= 2 ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
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