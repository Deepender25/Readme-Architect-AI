"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Code, GitBranch, Star, Zap, BrainCircuit, Bot, Wand2 } from 'lucide-react';
import ReadmeGeneratorFlow from '@/components/readme-generator-flow';
import ModernReadmeOutput from '@/components/modern-readme-output';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

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

  const handleGenerationComplete = (readme: string, repoUrl: string, projName: string, genParams: any) => {
    setGeneratedReadme(readme);
    setRepositoryUrl(repoUrl);
    setProjectName(projName);
    setGenerationParams(genParams);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setShowGenerator(false);
    setGeneratedReadme('');
    setRepositoryUrl('');
    setProjectName('');
    setGenerationParams({});
  };

  const features = [
    {
      icon: <BrainCircuit size={28} className="text-green-400" />,
      title: 'AI-Powered Analysis',
      description: 'Our AI delves deep into your codebase to understand its structure, dependencies, and purpose.',
    },
    {
      icon: <Bot size={28} className="text-green-400" />,
      title: 'Automated Generation',
      description: 'Generate a complete, professional README.md file in seconds, saving you time and effort.',
    },
    {
      icon: <Wand2 size={28} className="text-green-400" />,
      title: 'Glassmorphism UI',
      description: 'A beautiful, modern interface with a glassmorphism design that is both intuitive and visually stunning.',
    },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white">
      <div className="fixed inset-0 -z-20 h-full w-full bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-b from-black via-transparent to-black"></div>
      
      <div className="relative isolate px-6 pt-0 lg:px-8 overflow-hidden min-h-screen">
        <div className="mx-auto max-w-4xl py-12 sm:py-16 lg:py-20">
          <AnimatePresence mode="wait">
            {showEditor ? (
              <motion.div
                key="editor-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg"
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
                className="text-center"
              >
                <ScrollAnimatedDiv delay={0} duration={0.8} yOffset={60}>
                  <motion.h1
                    className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
                    style={{ textShadow: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.2)' }}
                  >
                    Generate Perfect READMEs in Seconds
                  </motion.h1>
                </ScrollAnimatedDiv>
                
                <ScrollAnimatedDiv delay={0.2} duration={0.8} yOffset={40}>
                  <motion.p className="mt-6 text-lg font-medium text-gray-300 sm:text-xl/8 max-w-2xl mx-auto">
                    Transform your repositories with AI-powered README generation. Just paste your GitHub URL and watch the magic happen.
                  </motion.p>
                </ScrollAnimatedDiv>
                
                <ScrollAnimatedDiv delay={0.4} duration={0.8} yOffset={30} className="mt-10">
                  {!showGenerator ? (
                    <div className="max-w-md mx-auto">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartGeneration}
                            className="w-full px-6 py-4 bg-green-500 text-black font-semibold rounded-lg transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black text-lg"
                            style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}
                          >
                            Start README Generation
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <ReadmeGeneratorFlow onComplete={handleGenerationComplete} />
                    </div>
                  )}
                </ScrollAnimatedDiv>

                {!showGenerator && (
                  <ScrollAnimatedDiv delay={0.6} duration={0.8} yOffset={50} className="mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-left"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10 mb-4">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollAnimatedDiv>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}