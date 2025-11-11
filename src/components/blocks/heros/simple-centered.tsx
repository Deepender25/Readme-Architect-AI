"use client";

import { motion } from 'framer-motion';
import { Github, GitBranch, BrainCircuit, Bot, Wand2, Code, Sparkles, Zap, FileText, Star, ArrowRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: any, 
  title: string, 
  description: string, 
  delay: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: Math.min(delay * 0.03, 0.15), ease: [0.25, 0.46, 0.45, 0.94] }}
    className="relative group cursor-pointer critical-smooth"
    whileHover={{ y: -2 }}
    whileTap={{ y: 0 }}
    style={{ 
      willChange: 'transform, opacity',
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden' 
    }}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
    <div className="relative bg-black/40 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/50 hover:bg-black/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-green-400/20">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 bg-green-400/10 rounded-lg group-hover:bg-green-400/20 transition-all duration-300">
          <Icon className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  </motion.div>
);

const StatCard = ({ number, label, delay }: { number: string, label: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay: Math.min(delay * 0.03, 0.1), ease: [0.25, 0.46, 0.45, 0.94] }}
    className="text-center critical-smooth"
    style={{ 
      willChange: 'transform, opacity',
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden' 
    }}
  >
    <motion.div
      className="text-3xl font-bold text-green-400 mb-2 text-glow"
      animate={{ 
        textShadow: [
          '0 0 8px rgba(0, 255, 136, 0.4)',
          '0 0 15px rgba(0, 255, 136, 0.6)',
          '0 0 8px rgba(0, 255, 136, 0.4)'
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: 'text-shadow' }}
    >
      {number}
    </motion.div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

export default function SimpleCentered() {
  const router = useRouter();

  const handleStartGeneration = () => {
    // Navigate to the generator page
    router.push('/generator');
  };

  const handleViewExamples = () => {
    router.push('/examples');
  };

  const handleGetStartedNow = () => {
    // Navigate to the generator page
    router.push('/generator');
  };


  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      <div className="relative isolate px-6 pt-0 lg:px-8 min-h-screen">
        <div className="relative z-30">
              {/* Hero Section */}
              <div className="mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
                <div className="text-center mb-16">
                  <ScrollAnimatedDiv delay={0} duration={0.3} yOffset={20}>
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-8 glow-green"
                      animate={{ 
                        boxShadow: [
                          '0 0 8px rgba(0, 255, 136, 0.2)',
                          '0 0 15px rgba(0, 255, 136, 0.4)',
                          '0 0 8px rgba(0, 255, 136, 0.2)'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      style={{ willChange: 'box-shadow' }}
                    >
                      <Sparkles className="w-4 h-4" />
                      AI-Powered Documentation
                    </motion.div>
                  </ScrollAnimatedDiv>
                  
                  <ScrollAnimatedDiv delay={0.05} duration={0.3} yOffset={20}>
                    <motion.h1
                      className="text-5xl font-bold tracking-normal leading-relaxed text-white sm:text-7xl lg:text-8xl mb-6 relative z-10"
                      style={{ 
                        textShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.2)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))'
                      }}
                    >
                      Generate Perfect
                      <br />
                      <span className="text-green-400">READMEs</span> in Seconds
                    </motion.h1>
                  </ScrollAnimatedDiv>
                  
                  <ScrollAnimatedDiv delay={0.1} duration={0.4} yOffset={20}>
                    <motion.p className="mt-6 text-xl font-medium text-gray-300 sm:text-2xl max-w-3xl mx-auto leading-relaxed">
                      Transform your repositories with AI-powered README generation. 
                      <br className="hidden sm:block" />
                      Just paste your GitHub URL and watch the magic happen.
                    </motion.p>
                  </ScrollAnimatedDiv>
                  
                  <ScrollAnimatedDiv delay={0.15} duration={0.4} yOffset={20} className="mt-12">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                      <div className="relative group w-full sm:w-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          onClick={handleStartGeneration}
                          className="relative w-full sm:w-auto px-8 py-4 bg-green-500 text-black font-bold rounded-xl transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black text-lg flex items-center justify-center gap-3"
                          style={{ boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)' }}
                        >
                          <Play className="w-5 h-5" />
                          Start Generation
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                        onClick={handleViewExamples}
                        className="px-6 py-4 bg-transparent border border-green-400/30 text-green-400 font-semibold rounded-xl hover:bg-green-400/10 hover:border-green-400/50 transition-all duration-300 flex items-center gap-2"
                      >
                        <Github className="w-5 h-5" />
                        View Examples
                      </motion.button>
                    </div>
                  </ScrollAnimatedDiv>
                </div>

                {/* Stats Section */}
                <ScrollAnimatedDiv delay={0.2} duration={0.4} yOffset={20}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    <StatCard number="AI" label="Powered Generation" delay={1} />
                    <StatCard number="Free" label="To Use" delay={2} />
                    <StatCard number="< 30s" label="Generation Time" delay={3} />
                    <StatCard number="24/7" label="Available" delay={4} />
                  </div>
                </ScrollAnimatedDiv>

                {/* Features Grid */}
                <ScrollAnimatedDiv delay={0.25} duration={0.4} yOffset={20}>
                  <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Generator?</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                      Powered by advanced AI to create comprehensive, professional documentation
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    <FeatureCard
                      icon={BrainCircuit}
                      title="AI-Powered Analysis"
                      description="Advanced algorithms analyze your codebase to generate contextually relevant documentation"
                      delay={1}
                    />
                    <FeatureCard
                      icon={Zap}
                      title="Lightning Fast"
                      description="Generate comprehensive READMEs in under 30 seconds with our optimized processing"
                      delay={2}
                    />
                    <FeatureCard
                      icon={Github}
                      title="GitHub Integration"
                      description="Seamlessly connect with GitHub repositories and save directly to your projects"
                      delay={3}
                    />
                    <FeatureCard
                      icon={FileText}
                      title="Professional Output"
                      description="Generates clean, well-structured documentation following industry best practices"
                      delay={4}
                    />
                    <FeatureCard
                      icon={Code}
                      title="Code Analysis"
                      description="Automatically detects technologies, dependencies, and project structure"
                      delay={5}
                    />
                    <FeatureCard
                      icon={Star}
                      title="Quality Assured"
                      description="Every generated README follows best practices and industry standards"
                      delay={6}
                    />
                  </div>
                </ScrollAnimatedDiv>

                {/* CTA Section */}
                <ScrollAnimatedDiv delay={0.3} duration={0.4} yOffset={20}>
                  <div className="text-center bg-gradient-to-r from-green-400/10 to-green-600/10 border border-green-400/20 rounded-3xl p-12">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="inline-block mb-6"
                    >
                      <Bot className="w-16 h-16 text-green-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Documentation?</h3>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                      Start creating professional documentation for your projects with our AI-powered generator. Fast, free, and easy to use.
                    </p>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      onClick={handleGetStartedNow}
                      className="px-8 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all duration-300 flex items-center gap-3 mx-auto"
                    >
                      <Wand2 className="w-5 h-5" />
                      Get Started Now
                    </motion.button>
                  </div>
                </ScrollAnimatedDiv>
              </div>
        </div>
      </div>
    </div>
  );
}