'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, User, ArrowRight, X, Check, Sparkles, BrainCircuit, Bot, Shield } from 'lucide-react';
import EnhancedGridBackground from '@/components/enhanced-grid-background';

interface PreviousAccount {
  username: string;
  name: string;
  avatar_url: string;
  email?: string;
}

// Component that uses useSearchParams
function SelectAccountContent() {
  const [previousAccount, setPreviousAccount] = useState<PreviousAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get previous account info from localStorage
    const storedAccount = localStorage.getItem('previous_github_account');
    if (storedAccount) {
      try {
        const accountData = JSON.parse(storedAccount);
        setPreviousAccount(accountData);
      } catch (error) {
        console.error('Error parsing stored account data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleContinueWithPrevious = () => {
    // Redirect to GitHub OAuth without force_reauth parameter
    window.location.href = '/api/auth/github';
  };

  const handleUseDifferentAccount = () => {
    // Clear any existing auth data
    localStorage.removeItem('previous_github_account');
    localStorage.removeItem('show_account_selection');
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('🔄 Switching to different GitHub account...');
    
    // Redirect to GitHub OAuth with force_reauth parameter to force account selection
    window.location.href = '/api/auth/github?force_reauth=1';
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen font-sans text-white overflow-hidden relative">
        <EnhancedGridBackground />
        <div className="relative z-30 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-3 border-green-400 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      {/* Enhanced Grid Background */}
      <EnhancedGridBackground />
      
      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group max-w-lg w-full"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-3xl p-10 shadow-2xl hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-3xl" />
            {/* Enhanced Header */}
            <div className="relative text-center mb-10">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 255, 136, 0.4)',
                    '0 0 40px rgba(0, 255, 136, 0.6)',
                    '0 0 20px rgba(0, 255, 136, 0.4)'
                  ],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <BrainCircuit className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-6"
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(0, 255, 136, 0.3)',
                    '0 0 20px rgba(0, 255, 136, 0.5)',
                    '0 0 10px rgba(0, 255, 136, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
                Account Selection
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-3"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.3))'
                }}
              >
                Choose Your Account
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">How would you like to proceed with GitHub authentication?</p>
            </div>

            <div className="relative space-y-6 mb-8">
              {/* Continue with previous account option - Enhanced */}
              {previousAccount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueWithPrevious}
                    className="relative w-full p-6 bg-green-500/10 hover:bg-green-500/15 border border-green-500/30 hover:border-green-500/50 rounded-2xl transition-all duration-300 text-left group/btn"
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img
                          src={previousAccount.avatar_url}
                          alt={previousAccount.name}
                          className="w-16 h-16 rounded-2xl border-2 border-green-500/60 shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-bold text-lg">{previousAccount.name}</h3>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="px-2 py-1 bg-green-500/20 rounded-full"
                          >
                            <Bot className="w-4 h-4 text-green-400" />
                          </motion.div>
                        </div>
                        <p className="text-green-400 font-medium mb-1">@{previousAccount.username}</p>
                        <p className="text-gray-300 text-sm mb-2">Continue with this account</p>
                        <div className="flex items-center gap-2 text-green-300 text-xs">
                          <Shield className="w-3 h-3" />
                          <span>Authenticated & Ready</span>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover/btn:text-green-400 group-hover/btn:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {/* Use different account option - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUseDifferentAccount}
                  className="relative w-full p-6 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/30 hover:border-blue-500/50 rounded-2xl transition-all duration-300 text-left group/btn"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-2">Use Different Account</h3>
                      <p className="text-gray-300 mb-2">Sign in with a different GitHub account</p>
                      <div className="flex items-center gap-2 text-blue-300 text-xs">
                        <Github className="w-3 h-3" />
                        <span>Full authentication required</span>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover/btn:text-blue-400 group-hover/btn:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              </motion.div>
            </div>

            {/* Cancel option - Enhanced */}
            <div className="relative pt-6 border-t border-green-400/20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleCancel}
                className="w-full text-gray-400 hover:text-white transition-colors font-medium py-3 rounded-xl hover:bg-gray-500/10"
              >
                ← Cancel and return to homepage
              </motion.button>
            </div>

            {/* Enhanced Info note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-yellow-400 text-lg">💡</span>
                </div>
                <div>
                  <p className="text-yellow-200 text-sm font-medium mb-1">Smart Account Memory</p>
                  <p className="text-yellow-300/80 text-xs leading-relaxed">
                    We securely remember your previous account to make future logins faster and more convenient
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      <EnhancedGridBackground />
      <div className="relative z-30 flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-green-400 border-t-transparent rounded-full"
        />
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function SelectAccountPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SelectAccountContent />
    </Suspense>
  );
}
