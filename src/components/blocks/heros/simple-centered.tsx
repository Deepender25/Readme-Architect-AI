"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, GitBranch, BrainCircuit, Bot, Wand2, Code } from 'lucide-react';
import ReadmeGeneratorFlow from '@/components/readme-generator-flow';
import ModernReadmeOutput from '@/components/modern-readme-output';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

const TechLogo = ({ icon, initialAngle, radius }: { icon: React.ReactNode, initialAngle: number, radius: number }) => {
  const [angle, setAngle] = useState(initialAngle);

  useEffect(() => {
    const animate = () => {
      setAngle(prevAngle => prevAngle + 0.005);
      requestAnimationFrame(animate);
    };
    const animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      style={{ 
        x,
        y,
        color: '#00ff88',
      }}
    >
      {icon}
    </motion.div>
  );
};

const MovingGrid = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%2300ff881a' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          animation: 'moveGrid 120s linear infinite'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center w-64 h-64">
          <TechLogo icon={<Github size={32} />} initialAngle={0} radius={100} />
          <TechLogo icon={<GitBranch size={32} />} initialAngle={Math.PI / 2} radius={100} />
          <TechLogo icon={<Code size={32} />} initialAngle={Math.PI} radius={100} />
          <TechLogo icon={<Bot size={32} />} initialAngle={3 * Math.PI / 2} radius={100} />
        </div>
      </div>
    </div>
  );
};

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

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MovingGrid />
      </div>
      <div className="relative isolate px-6 pt-0 lg:px-8 min-h-screen flex flex-col justify-center">
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