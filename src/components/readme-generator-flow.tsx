"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Github, Settings, Image, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { NumberInput } from '@/components/ui/number-input';
import { createStreamingGenerator } from '@/lib/readme-generator';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

interface ReadmeGeneratorFlowProps {
  onComplete: (readme: string, repositoryUrl: string, projectName: string, generationParams: any) => void;
}

type Step = 'url' | 'name' | 'demo' | 'generating' | 'complete';

export default function ReadmeGeneratorFlow({ onComplete }: ReadmeGeneratorFlowProps) {
  // Check for URL parameters on component mount
  const getInitialValues = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const repoParam = urlParams.get('repo');
      const nameParam = urlParams.get('name');
      
      // Debug logging
      console.log('URL Parameters:', { repoParam, nameParam });
      console.log('Current URL:', window.location.href);
      
      return {
        repositoryUrl: repoParam || '',
        projectName: nameParam || '',
        // If we have a repo URL from parameters, skip to the name step
        initialStep: repoParam ? 'name' as Step : 'url' as Step
      };
    }
    return {
      repositoryUrl: '',
      projectName: '',
      initialStep: 'url' as Step
    };
  };

  const initialValues = getInitialValues();
  
  const [currentStep, setCurrentStep] = useState<Step>(initialValues.initialStep);
  const [repositoryUrl, setRepositoryUrl] = useState(initialValues.repositoryUrl);
  const [projectName, setProjectName] = useState(initialValues.projectName);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [numScreenshots, setNumScreenshots] = useState(2);
  const [numVideos, setNumVideos] = useState(1);
  const [error, setError] = useState('');
  const [generationStatus, setGenerationStatus] = useState('');

  // Debug effect to monitor component state
  useEffect(() => {
    console.log('ReadmeGeneratorFlow mounted with:', {
      currentStep,
      repositoryUrl,
      projectName,
      initialValues
    });
  }, []);

  // Clear URL parameters after they're used to avoid confusion
  useEffect(() => {
    if (typeof window !== 'undefined' && (initialValues.repositoryUrl || initialValues.projectName)) {
      console.log('Clearing URL parameters...');
      const url = new URL(window.location.href);
      url.searchParams.delete('repo');
      url.searchParams.delete('name');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initialValues.repositoryUrl, initialValues.projectName]);

  const validateGitHubUrl = (url: string) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubRegex.test(url);
  };

  const handleUrlSubmit = () => {
    if (!repositoryUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }
    
    if (!validateGitHubUrl(repositoryUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    setError('');
    setCurrentStep('name');
  };

  const handleNameSubmit = () => {
    setCurrentStep('demo');
  };

  const handleDemoSubmit = () => {
    setCurrentStep('generating');
    startGeneration();
  };

  const startGeneration = () => {
    setGenerationStatus('Initializing...');
    
    const abortStream = createStreamingGenerator(
      {
        repoUrl: repositoryUrl,
        projectName: projectName || undefined,
        includeDemo,
        numScreenshots,
        numVideos,
      },
      (event) => {
        if (event.status) {
          setGenerationStatus(event.status);
        } else if (event.readme) {
          setCurrentStep('complete');
          const generationParams = {
            include_demo: includeDemo,
            num_screenshots: numScreenshots,
            num_videos: numVideos
          };
          onComplete(event.readme, repositoryUrl, projectName, generationParams);
        } else if (event.error) {
          setError(event.error);
          setCurrentStep('url');
        }
      }
    );
  };

  const handleBack = () => {
    setError('');
    switch (currentStep) {
      case 'name':
        setCurrentStep('url');
        break;
      case 'demo':
        setCurrentStep('name');
        break;
      case 'generating':
        setCurrentStep('demo');
        break;
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 50, scale: 0.95 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.95 }
  };

  return (
    <ScrollAnimatedDiv
      delay={0.6}
      duration={0.8}
      yOffset={40}
      className="max-w-md mx-auto"
    >
      <AnimatePresence mode="wait">
        {/* Step 1: Repository URL */}
        {currentStep === 'url' && (
          <motion.div
            key="url-step"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Repository URL</h3>
                  <p className="text-sm text-gray-400">Enter your GitHub repository URL</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-500 text-sm transition-all focus:outline-none focus:border-green-400 focus:bg-[rgba(255,255,255,0.08)]"
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
                
                <Button
                  onClick={handleUrlSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                  disabled={!repositoryUrl.trim()}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Project Name */}
        {currentStep === 'name' && (
          <motion.div
            key="name-step"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Project Name</h3>
                  <p className="text-sm text-gray-400">Give your project a custom name (optional)</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="My Awesome Project (leave empty for auto-generation)"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-500 text-sm transition-all focus:outline-none focus:border-green-400 focus:bg-[rgba(255,255,255,0.08)]"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="flex-1 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNameSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Demo Options */}
        {currentStep === 'demo' && (
          <motion.div
            key="demo-step"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Demo Section</h3>
                  <p className="text-sm text-gray-400">Add placeholders for screenshots and videos</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-[rgba(255,255,255,0.1)] hover:border-green-400/50 transition-colors">
                  <span className="text-white text-sm">Include demo section with placeholders</span>
                  <div className="flex-shrink-0">
                    <ToggleSwitch
                      checked={includeDemo}
                      onChange={setIncludeDemo}
                    />
                  </div>
                </div>
                
                {includeDemo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pl-4 border-l-2 border-green-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-gray-300">Screenshots:</span>
                      </div>
                      <NumberInput
                        value={numScreenshots}
                        onChange={setNumScreenshots}
                        min={1}
                        max={10}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-gray-300">Videos:</span>
                      </div>
                      <NumberInput
                        value={numVideos}
                        onChange={setNumVideos}
                        min={1}
                        max={10}
                      />
                    </div>
                  </motion.div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="flex-1 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleDemoSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    Generate README
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Generating */}
        {currentStep === 'generating' && (
          <motion.div
            key="generating-step"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
              <LoadingAnimation message={generationStatus} />
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                  <Button
                    onClick={() => setCurrentStep('url')}
                    variant="ghost"
                    className="mt-2 text-red-400 hover:text-red-300"
                  >
                    Try Again
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollAnimatedDiv>
  );
}