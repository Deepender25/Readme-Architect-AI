'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, ExternalLink, CheckCircle, LogOut, Play } from 'lucide-react';
import LoadingPage from '@/components/ui/loading-page';
import ProfessionalBackground from '@/components/professional-background';

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
      <ProfessionalBackground />
      
      <div className="relative isolate px-6 pt-0 lg:px-8 min-h-screen">
        <div className="relative z-30 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Header matching main site */}
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
                <LogOut className="w-4 h-4" />
                Account Switching
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
                Switch
                <br />
                <span className="text-green-400">GitHub Account</span>
              </motion.h1>
              
              <p className="text-xl font-medium text-gray-300 max-w-md mx-auto leading-relaxed">
                Quick 2-step process to use a different GitHub account
              </p>
            </motion.div>

            {/* 2-Step Process matching main site style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-green-400/20 rounded-3xl p-8 hover:border-green-400/50 hover:bg-black/60 transition-all duration-300 shadow-xl shadow-green-400/20">
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Step 1: Sign Out */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`relative group/step cursor-pointer ${
                      currentStep === 1 ? 'ring-2 ring-green-400/50' : ''
                    }`}
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur transition-all duration-300 ${
                      currentStep === 1 
                        ? 'from-green-400/30 to-green-600/30 opacity-50' 
                        : currentStep > 1 
                        ? 'from-green-400/20 to-green-600/20 opacity-30'
                        : 'from-gray-400/10 to-gray-600/10 opacity-20'
                    }`} />
                    <div className={`relative rounded-2xl p-6 transition-all duration-300 ${
                      currentStep === 1 
                        ? 'bg-green-400/10 border border-green-400/30' 
                        : currentStep > 1 
                        ? 'bg-green-400/5 border border-green-400/20'
                        : 'bg-black/20 border border-gray-400/20'
                    }`}>
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                          currentStep === 1 
                            ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/30' 
                            : currentStep > 1 
                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                            : 'bg-gray-600'
                        }`}>
                          {currentStep > 1 ? (
                            <CheckCircle className="w-8 h-8 text-white" />
                          ) : (
                            <ExternalLink className="w-8 h-8 text-white" />
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">Step 1: Sign Out</h3>
                        <p className="text-gray-400 text-sm mb-6">Open GitHub logout page</p>
                        
                        {currentStep === 1 && (
                          <div className="relative group/btn">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 group-hover/btn:opacity-50 transition-opacity" />
                            <motion.button
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleStartLogout}
                              className="relative w-full px-6 py-3 bg-green-500 text-black font-bold rounded-xl transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center gap-3"
                              style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)' }}
                            >
                              <Play className="w-4 h-4" />
                              Open Logout
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                        
                        {currentStep > 1 && (
                          <div className="text-green-400 font-medium">✓ Completed</div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 2: Login with New Account */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`relative group/step ${
                      currentStep === 2 ? 'ring-2 ring-green-400/50' : ''
                    }`}
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur transition-all duration-300 ${
                      currentStep === 2 
                        ? 'from-green-400/30 to-green-600/30 opacity-50' 
                        : 'from-gray-400/10 to-gray-600/10 opacity-20'
                    }`} />
                    <div className={`relative rounded-2xl p-6 transition-all duration-300 ${
                      currentStep === 2 
                        ? 'bg-green-400/10 border border-green-400/30' 
                        : 'bg-black/20 border border-gray-400/20'
                    }`}>
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                          currentStep === 2 
                            ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/30' 
                            : 'bg-gray-600'
                        }`}>
                          <Github className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">Step 2: Login</h3>
                        <p className="text-gray-400 text-sm mb-6">Choose your new account</p>
                        
                        {currentStep === 2 && (
                          <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-4">
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-green-300 font-medium">Redirecting to GitHub...</span>
                            </div>
                          </div>
                        )}
                        
                        {currentStep < 2 && (
                          <div className="text-gray-500 font-medium">Waiting...</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Back Button */}
                {currentStep === 1 && (
                  <div className="text-center mt-8 pt-6 border-t border-green-400/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBackToLogin}
                      className="px-6 py-3 bg-transparent border border-green-400/30 text-green-400 font-semibold rounded-xl hover:bg-green-400/10 hover:border-green-400/50 transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      ← Back to Login
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
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