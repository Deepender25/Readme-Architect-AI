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
  ArrowLeft,
  Sparkles,
  BrainCircuit,
  Bot,
  Star
} from 'lucide-react';
import EnhancedGridBackground from '@/components/enhanced-grid-background';

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
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      {/* Enhanced Grid Background */}
      <EnhancedGridBackground />
      
      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-5xl w-full">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="mb-12 flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="text-center lg:text-left">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-8 shadow-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0, 255, 136, 0.4)',
                      '0 0 40px rgba(0, 255, 136, 0.7)',
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
                  <BrainCircuit className="w-12 h-12 text-white" />
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
                  AI-Powered Documentation
                </motion.div>
                
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-normal"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.3))'
                  }}
                >
                  Welcome to
                  <span className="block text-green-400">ReadmeArchitect</span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  Transform your GitHub repositories with AI-powered README generation. 
                  Create professional, comprehensive documentation in seconds.
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-green-400 mb-1">10K+</div>
                    <div className="text-gray-400 text-sm">READMEs Generated</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-green-400 mb-1">&lt;30s</div>
                    <div className="text-gray-400 text-sm">Average Time</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-green-400 mb-1">99%</div>
                    <div className="text-gray-400 text-sm">Accuracy Rate</div>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Benefits */}
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-white text-center lg:text-left">
                  Unlock Premium Features
                </h2>
                
                <div className="grid gap-5">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="relative flex items-start gap-4 p-5 bg-black/40 backdrop-blur-xl border border-green-400/10 rounded-2xl hover:border-green-400/30 transition-all duration-300 group-hover:bg-black/60">
                        <div className="p-3 bg-green-400/10 rounded-xl group-hover:bg-green-400/20 transition-all duration-300">
                          {benefit.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-2 group-hover:text-green-300 transition-colors">{benefit.title}</h3>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Enhanced Login Process */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-3xl p-10 shadow-2xl hover:border-green-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-3xl" />
                {/* Enhanced Login Process Steps */}
                <div className="relative mb-10">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                  >
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Get Started in 3 Steps
                    </h3>
                    <p className="text-gray-400">Simple, secure, and lightning fast</p>
                  </motion.div>
                  
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <div className="relative flex items-center gap-5 p-4 bg-green-400/5 rounded-xl border border-green-400/10 group-hover:border-green-400/30 transition-all duration-300">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {step.step}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {step.icon}
                              <h4 className="font-bold text-white text-lg">{step.title}</h4>
                            </div>
                            <p className="text-gray-400 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Sign In Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGitHubLogin}
                  disabled={isLoading}
                  className="relative w-full group overflow-hidden mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="relative flex items-center justify-center gap-4 px-8 py-5 text-black font-bold text-lg rounded-2xl transition-all duration-300 disabled:opacity-70"
                    style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)' }}
                  >
                    <Github className="w-6 h-6" />
                    <span>
                      {isLoading ? 'Redirecting to GitHub...' : 'Continue with GitHub'}
                    </span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* Enhanced Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="relative p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-2xl" />
                  <div className="relative flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-blue-200 font-semibold mb-2">
                        🔒 Your Privacy is Our Priority
                      </p>
                      <p className="text-blue-300/90 text-sm leading-relaxed">
                        We only request read-only access to your public repositories. 
                        Your code remains secure on GitHub, and we never store sensitive data.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Alternative Option */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="relative text-center pt-6 border-t border-green-400/20"
                >
                  <p className="text-gray-400 mb-3">
                    Don't have a GitHub account?
                  </p>
                  <motion.a
                    href="https://github.com/join"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-xl text-green-400 hover:text-green-300 hover:bg-green-400/15 font-semibold transition-all duration-300"
                  >
                    <Star className="w-4 h-4" />
                    Create one for free
                    <ChevronRight className="w-4 h-4" />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
