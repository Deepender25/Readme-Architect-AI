"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, GitBranch, BrainCircuit, Bot, Wand2, Code, Sparkles, Zap, FileText, Star, ArrowRight, Play } from 'lucide-react';
import ReadmeGeneratorFlow from '@/components/readme-generator-flow';
import ModernReadmeOutput from '@/components/modern-readme-output';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: any, 
  title: string, 
  description: string, 
  delay: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: Math.min(delay * 0.05, 0.2) }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative bg-black/20 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all duration-300">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 bg-green-400/10 rounded-lg">
          <Icon className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const StatCard = ({ number, label, delay }: { number: string, label: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: Math.min(delay * 0.05, 0.15) }}
    className="text-center"
  >
    <motion.div
      className="text-3xl font-bold text-green-400 mb-2"
      animate={{ 
        textShadow: [
          '0 0 10px rgba(0, 255, 136, 0.5)',
          '0 0 20px rgba(0, 255, 136, 0.8)',
          '0 0 10px rgba(0, 255, 136, 0.5)'
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {number}
    </motion.div>
    <div className="text-gray-400 text-sm">{label}</div>
  </motion.div>
);

export default function SimpleCentered() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [generationParams, setGenerationParams] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const repoParam = urlParams.get('repo');
      if (repoParam) {
        setShowGenerator(true);
      }
    }
  }, []);

  const handleStartGeneration = () => setShowGenerator(true);

  const handleGenerationComplete = async (readme: string, repoUrl: string, projName: string, genParams: any) => {
    setGeneratedReadme(readme);
    setRepositoryUrl(repoUrl);
    setProjectName(projName);
    setGenerationParams(genParams);
    setShowEditor(true);
    
    // Auto-save to history for authenticated users
    try {
      console.log('💾 Auto-saving README to history...');
      
      const response = await fetch('/api/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository_url: repoUrl,
          repository_name: projName || repoUrl.split('/').pop() || 'Unknown',
          project_name: projName,
          readme_content: readme,
          generation_params: genParams,
        }),
      });

      if (response.ok) {
        console.log('✅ README auto-saved to history successfully');
      } else {
        const errorData = await response.json();
        console.warn('⚠️ Failed to auto-save README to history:', errorData.error);
      }
    } catch (error) {
      console.error('❌ Error auto-saving to history:', error);
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setShowGenerator(false);
    setGeneratedReadme('');
    setRepositoryUrl('');
    setProjectName('');
    setGenerationParams({});
  };

  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative">
      <div className="relative isolate px-6 pt-0 lg:px-8 min-h-screen">
        <AnimatePresence mode="wait">
          {showEditor ? (
            <motion.div
              key="editor-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg"
            >
              <ModernReadmeOutput 
                content={generatedReadme}
                repositoryUrl={repositoryUrl}
                projectName={projectName}
                generationParams={generationParams}
                onClose={handleEditorClose}
              />
            </motion.div>
          ) : (
            <motion.div
              key="hero-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {/* Hero Section */}
              <div className="mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
                <div className="text-center mb-16">
                  <ScrollAnimatedDiv delay={0} duration={0.4} yOffset={30}>
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
                      <Sparkles className="w-4 h-4" />
                      AI-Powered Documentation
                    </motion.div>
                  </ScrollAnimatedDiv>
                  
                  <ScrollAnimatedDiv delay={0.05} duration={0.4} yOffset={30}>
                    <motion.h1
                      className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl mb-6"
                      style={{ 
                        textShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.2)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
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
                    {!showGenerator ? (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                        <div className="relative group w-full sm:w-auto">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-4 bg-transparent border border-green-400/30 text-green-400 font-semibold rounded-xl hover:bg-green-400/10 hover:border-green-400/50 transition-all duration-300 flex items-center gap-2"
                        >
                          <Github className="w-5 h-5" />
                          View Examples
                        </motion.button>
                      </div>
                    ) : (
                      <ReadmeGeneratorFlow onComplete={handleGenerationComplete} />
                    )}
                  </ScrollAnimatedDiv>
                </div>

                {/* Stats Section */}
                <ScrollAnimatedDiv delay={0.2} duration={0.4} yOffset={20}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    <StatCard number="10K+" label="READMEs Generated" delay={1} />
                    <StatCard number="99%" label="Accuracy Rate" delay={2} />
                    <StatCard number="< 30s" label="Average Time" delay={3} />
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
                      title="Professional Templates"
                      description="Choose from multiple professionally designed templates that suit your project type"
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
                      Join thousands of developers who have already improved their project documentation with our AI-powered generator.
                    </p>
                    {!showGenerator && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartGeneration}
                        className="px-8 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all duration-300 flex items-center gap-3 mx-auto"
                      >
                        <Wand2 className="w-5 h-5" />
                        Get Started Now
                      </motion.button>
                    )}
                  </div>
                </ScrollAnimatedDiv>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}