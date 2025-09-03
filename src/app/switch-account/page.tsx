'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ArrowRight, UserX, ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingPage from '@/components/ui/loading-page';
import EnhancedGridBackground from '@/components/enhanced-grid-background';

function SwitchAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
    // Clear any existing auth state when component mounts
    document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('previous_github_account');
    localStorage.removeItem('show_account_selection');
  }, []);

  const handleSwitchAccount = async () => {
    setIsProcessing(true);
    setProcessingStep('Clearing session...');
    
    // Store the return URL for after the OAuth process
    const returnTo = searchParams.get('returnTo') || '/';
    try {
      sessionStorage.setItem('oauth_return_to', returnTo);
    } catch (error) {
      console.error('Failed to store return URL:', error);
    }

    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear all client-side auth data
    document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.removeItem('github_user');
    sessionStorage.removeItem('auth_token');
    
    setProcessingStep('Opening GitHub logout...');
    
    // Try to open GitHub logout in a popup to clear GitHub session
    const logoutPopup = window.open(
      'https://github.com/logout', 
      'github_logout', 
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
    
    // Check if popup was blocked
    if (!logoutPopup || logoutPopup.closed || typeof logoutPopup.closed === 'undefined') {
      setProcessingStep('Popup blocked, using fallback...');
      // Popup blocked - redirect directly with a longer delay
      setTimeout(() => {
        const timestamp = Date.now();
        window.location.href = `/api/auth/github?force_account_selection=true&t=${timestamp}&returnTo=${encodeURIComponent(returnTo)}`;
      }, 3000);
    } else {
      setProcessingStep('Logout window will close automatically...');
      
      // Auto-close popup after logout completes and redirect
      setTimeout(() => {
        setProcessingStep('Closing logout window...');
        
        // Close the popup automatically
        if (!logoutPopup.closed) {
          logoutPopup.close();
        }
        
        // Small delay to ensure logout is processed, then redirect
        setTimeout(() => {
          setProcessingStep('Redirecting to account selection...');
          const timestamp = Date.now();
          window.location.href = `/api/auth/github?force_account_selection=true&t=${timestamp}&returnTo=${encodeURIComponent(returnTo)}`;
        }, 500);
      }, 3000); // Wait 3 seconds for logout to complete, then auto-close
      
      // Also monitor if user manually closes popup
      const checkClosed = setInterval(() => {
        if (logoutPopup.closed) {
          clearInterval(checkClosed);
          setProcessingStep('Redirecting to account selection...');
          // User closed popup manually, redirect immediately
          const timestamp = Date.now();
          window.location.href = `/api/auth/github?force_account_selection=true&t=${timestamp}&returnTo=${encodeURIComponent(returnTo)}`;
        }
      }, 500);
      
      // Clear the interval when auto-close happens
      setTimeout(() => {
        clearInterval(checkClosed);
      }, 4000);
    }
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
            Quick & secure account switching
          </p>
        </motion.div>

        {/* Simplified Process Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-green-400/20"
        >
          {!isProcessing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Github className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Ready to Switch?</h3>
                <p className="text-gray-400 text-sm">
                  We'll clear your current session and redirect you to GitHub to select a new account.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSwitchAccount}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-xl transition-all duration-300"
              >
                <UserX className="w-5 h-5" />
                Switch GitHub Account
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Switching Account...</h3>
                <p className="text-gray-400 text-sm">
                  {processingStep || 'Preparing account switch...'}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <RefreshCw className="w-4 h-4 text-green-400 animate-spin" />
                <span className="text-green-300 font-medium text-sm">Processing...</span>
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          {!isProcessing && (
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
            Your current session will be cleared and you'll be redirected to GitHub
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