'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Github, 
  Shield, 
  FileText, 
  History, 
  Zap, 
  ChevronRight, 
  Lock, 
  Eye,
  ArrowLeft
} from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGitHubLogin = () => {
    setIsLoading(true);
    // Redirect to GitHub OAuth
    window.location.href = '/auth/github';
  };

  const handleBack = () => {
    router.push('/');
  };

  const benefits = [
    {
      icon: <FileText className="w-6 h-6 text-green-400" />,
      title: 'AI-Powered README Generation',
      description: 'Generate professional README files using advanced AI that analyzes your code structure and dependencies.',
    },
    {
      icon: <History className="w-6 h-6 text-blue-400" />,
      title: 'Save & Manage History',
      description: 'Keep track of all your generated READMEs with automatic saving and easy access to your history.',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: 'Real-time Streaming',
      description: 'Watch as your README is generated in real-time with live progress updates and instant previews.',
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: 'Private & Secure',
      description: 'Your data is stored securely in your own GitHub repository. You maintain complete control.',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Secure Authentication',
      description: 'Sign in safely with your GitHub account using OAuth 2.0',
      icon: <Lock className="w-5 h-5 text-green-400" />,
    },
    {
      step: '2',
      title: 'Repository Access',
      description: 'Grant read-only access to analyze your public repositories',
      icon: <Eye className="w-5 h-5 text-blue-400" />,
    },
    {
      step: '3',
      title: 'Start Creating',
      description: 'Begin generating professional READMEs for your projects',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg shadow-green-500/30"
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
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 text-center lg:text-left">
                Sign in to
                <span className="block text-green-400">AutoDoc AI</span>
              </h1>
              
              <p className="text-xl text-gray-300 text-center lg:text-left leading-relaxed">
                Create professional README files for your GitHub repositories with the power of artificial intelligence.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white text-center lg:text-left">
                What you'll get access to:
              </h2>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="p-2 bg-gray-800/50 rounded-lg shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Login Process */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 shadow-2xl shadow-green-500/10"
          >
            {/* Login Process Steps */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Simple & Secure Process
              </h3>
              
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {step.icon}
                        <h4 className="font-semibold text-white">{step.title}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <Github className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                {isLoading ? 'Redirecting to GitHub...' : 'Continue with GitHub'}
              </span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-1">
                    Your privacy is protected
                  </p>
                  <p className="text-blue-300/80 text-xs leading-relaxed">
                    We only request read-only access to your public repositories. 
                    Your code stays on GitHub, and we never store your personal data.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Alternative Option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 pt-6 border-t border-gray-700/50 text-center"
            >
              <p className="text-gray-400 text-sm mb-2">
                Don't have a GitHub account?
              </p>
              <a
                href="https://github.com/join"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors underline"
              >
                Create one for free →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
