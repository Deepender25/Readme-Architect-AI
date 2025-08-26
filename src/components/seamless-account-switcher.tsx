'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SeamlessAccountSwitcherProps {
  returnTo?: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export default function SeamlessAccountSwitcher({ 
  returnTo = '/', 
  onComplete, 
  onError 
}: SeamlessAccountSwitcherProps) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('Preparing account switch...');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    startSeamlessSwitch();
  }, []);

  const startSeamlessSwitch = async () => {
    try {
      // Step 1: Clear current session
      setStep(1);
      setStatus('Clearing current session...');
      
      // Clear local auth data
      document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('previous_github_account');
      localStorage.removeItem('show_account_selection');
      
      // Store return URL
      try {
        sessionStorage.setItem('oauth_return_to', returnTo);
      } catch (error) {
        console.error('Failed to store return URL:', error);
      }
      
      await delay(1000);
      
      // Step 2: Attempt GitHub logout
      setStep(2);
      setStatus('Signing out of GitHub...');
      
      const logoutSuccess = await attemptGitHubLogout();
      
      await delay(1000);
      
      // Step 3: Redirect to fresh OAuth
      setStep(3);
      setStatus('Redirecting to GitHub...');
      
      await delay(1500);
      
      // Final redirect
      window.location.href = '/api/auth/github?force_account_selection=true';
      
    } catch (error) {
      console.error('Seamless switch failed:', error);
      setStatus('Switch failed, trying alternative method...');
      
      // Fallback: Direct OAuth attempt
      setTimeout(() => {
        window.location.href = '/api/auth/github?force_account_selection=true';
      }, 2000);
    }
  };

  const attemptGitHubLogout = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Method 1: Try invisible iframe logout
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'https://github.com/logout';
      
      let resolved = false;
      
      iframe.onload = () => {
        if (!resolved) {
          resolved = true;
          document.body.removeChild(iframe);
          resolve(true);
        }
      };
      
      iframe.onerror = () => {
        if (!resolved) {
          resolved = true;
          document.body.removeChild(iframe);
          resolve(false);
        }
      };
      
      document.body.appendChild(iframe);
      
      // Timeout fallback
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try {
            document.body.removeChild(iframe);
          } catch (e) {
            // Iframe might already be removed
          }
          resolve(false);
        }
      }, 3000);
    });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
      <div className="text-center space-y-6">
        {/* Header */}
        <div>
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Github className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Switching GitHub Account</h2>
          <p className="text-gray-400">Please wait while we prepare your account switch...</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
            step >= 1 ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-gray-800/30 border border-gray-700/30'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step > 1 ? 'bg-green-600' : step === 1 ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {step > 1 ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : step === 1 ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : (
                <span className="text-white text-sm font-bold">1</span>
              )}
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${step >= 1 ? 'text-white' : 'text-gray-400'}`}>
                Clear Current Session
              </h3>
              <p className={`text-sm ${step >= 1 ? 'text-gray-300' : 'text-gray-500'}`}>
                Removing existing authentication data
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
            step >= 2 ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-gray-800/30 border border-gray-700/30'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step > 2 ? 'bg-green-600' : step === 2 ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {step > 2 ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : step === 2 ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : (
                <span className="text-white text-sm font-bold">2</span>
              )}
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${step >= 2 ? 'text-white' : 'text-gray-400'}`}>
                GitHub Logout
              </h3>
              <p className={`text-sm ${step >= 2 ? 'text-gray-300' : 'text-gray-500'}`}>
                Signing out of current GitHub session
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
            step >= 3 ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-gray-800/30 border border-gray-700/30'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step > 3 ? 'bg-green-600' : step === 3 ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {step > 3 ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : step === 3 ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : (
                <span className="text-white text-sm font-bold">3</span>
              )}
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${step >= 3 ? 'text-white' : 'text-gray-400'}`}>
                Fresh Authentication
              </h3>
              <p className={`text-sm ${step >= 3 ? 'text-gray-300' : 'text-gray-500'}`}>
                Redirecting to GitHub for account selection
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-sm text-gray-300">{status}</p>
        </div>

        {/* Note */}
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-yellow-200 mb-1">
                <strong>Almost there!</strong>
              </p>
              <p className="text-xs text-yellow-300">
                GitHub will show you account selection or login form. This process is automatic and should complete in a few seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}