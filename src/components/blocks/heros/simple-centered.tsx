"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Github, Code, GitBranch, Star, Zap } from 'lucide-react';
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white">
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 bg-green-400/30 rounded-full blur-3xl pointer-events-none"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      />
      <div className="relative isolate px-6 pt-0 lg:px-8 overflow-hidden min-h-screen">
        <div className="fixed inset-0 -z-10 overflow-hidden w-full h-full">
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`h-line-${i}`}
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                style={{ top: `${i * 5}%` }}
                animate={{ opacity: [0.1, 0.3, 0.1], scaleX: [0.8, 1, 0.8] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`v-line-${i}`}
                className="absolute h-full w-px bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
                style={{ left: `${i * 5}%` }}
                animate={{ opacity: [0.1, 0.3, 0.1], scaleY: [0.8, 1, 0.8] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl py-8 sm:py-12 lg:py-16">
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
                    <ReadmeGeneratorFlow onComplete={handleGenerationComplete} />
                  )}
                </ScrollAnimatedDiv>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}