'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, User, ArrowRight, X, Check } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{
              boxShadow: [
                '0 0 8px rgba(0, 255, 136, 0.4)',
                '0 0 16px rgba(0, 255, 136, 0.8)',
                '0 0 8px rgba(0, 255, 136, 0.4)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Github className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Choose Your Account</h1>
          <p className="text-gray-400">How would you like to proceed with GitHub authentication?</p>
        </div>

        <div className="space-y-4">
          {/* Continue with previous account option */}
          {previousAccount && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueWithPrevious}
              className="w-full p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={previousAccount.avatar_url}
                  alt={previousAccount.name}
                  className="w-12 h-12 rounded-full border-2 border-green-500/60"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{previousAccount.name}</h3>
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm">@{previousAccount.username}</p>
                  <p className="text-green-400 text-xs mt-1">Continue with this account</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
            </motion.button>
          )}

          {/* Use different account option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUseDifferentAccount}
            className="w-full p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Use Different Account</h3>
                <p className="text-gray-400 text-sm">Sign in with a different GitHub account</p>
                <p className="text-blue-400 text-xs mt-1">Full authentication required</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
          </motion.button>
        </div>

        {/* Cancel option */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <button
            onClick={handleCancel}
            className="w-full text-gray-400 hover:text-white transition-colors text-sm py-2"
          >
            Cancel and return to homepage
          </button>
        </div>

        {/* Info note */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-200 text-xs text-center">
            💡 We remember your previous account to make login faster and more convenient
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
