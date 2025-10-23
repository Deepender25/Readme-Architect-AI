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
  const [numVideos, setNumVideos] = useState(0);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
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

  const normalizeGitHubUrl = (url: string) => {
    // Remove trailing slash and .git suffix for consistent processing
    let normalizedUrl = url.trim();
    if (normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    if (normalizedUrl.endsWith('.git')) {
      normalizedUrl = normalizedUrl.slice(0, -4);
    }
    return normalizedUrl;
  };

  const validateGitHubUrl = (url: string) => {
    // More comprehensive regex that accepts .git suffix and various formats
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+(\.git)?\/?$/;
    return githubRegex.test(url.trim());
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
    
    // Normalize the URL for consistent processing
    const normalizedUrl = normalizeGitHubUrl(repositoryUrl);
    setRepositoryUrl(normalizedUrl);
    
    setError('');
    setErrorDetails('');
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
          setErrorDetails(event.details || '');
          setCurrentStep('url');
        }
      }
    );
  };

  const handleBack = () => {
    setError('');
    setErrorDetails('');
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
      className="max-w-lg mx-auto"
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
            className="relative"
          >
            <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-400/10 rounded-xl border border-green-400/20 flex items-center justify-center">
                  <Github className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Repository URL</h3>
                  <p className="text-sm text-gray-400">Enter your GitHub repository URL</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg text-white transition-all duration-300 hover:border-white/20 focus:outline-none focus:bg-black/80 focus:border-green-400 min-h-[44px]"
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <p className="text-red-400 text-sm font-medium mb-1">{error}</p>
                    {errorDetails && (
                      <p className="text-red-300 text-xs">{errorDetails}</p>
                    )}
                  </motion.div>
                )}
                
                <Button
                  onClick={handleUrlSubmit}
                  className="w-full"
                  size="lg"
                  disabled={!repositoryUrl.trim()}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
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
            className="relative"
          >
            <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-400/10 rounded-xl border border-green-400/20 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Project Name</h3>
                  <p className="text-sm text-gray-400">Give your project a custom name (optional)</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="My Awesome Project (leave empty for auto-generation)"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg text-white transition-all duration-300 hover:border-white/20 focus:outline-none focus:bg-black/80 focus:border-green-400 min-h-[44px]"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span>Back</span>
                  </Button>
                  <Button
                    onClick={handleNameSubmit}
                    size="lg"
                    className="flex-1"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
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
            className="relative"
          >
            <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-400/10 rounded-xl border border-green-400/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Demo Section</h3>
                  <p className="text-sm text-gray-400">Add placeholders for screenshots and videos</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Compact toggle section */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Include demo section with placeholders</span>
                    <ToggleSwitch
                      checked={includeDemo}
                      onChange={setIncludeDemo}
                    />
                  </div>
                  
                  {/* Responsive demo options - vertical on mobile, horizontal on desktop */}
                  {includeDemo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-8 mt-3 pt-3 border-t border-white/10"
                    >
                      <div className="flex items-center justify-between md:justify-start gap-2">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300 font-medium">Screenshots:</span>
                        </div>
                        <NumberInput
                          value={numScreenshots}
                          onChange={setNumScreenshots}
                          min={1}
                          max={10}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-start gap-2">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300 font-medium">Videos:</span>
                        </div>
                        <NumberInput
                          value={numVideos}
                          onChange={setNumVideos}
                          min={0}
                          max={10}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Action buttons - matching Project Name page exactly */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleBack}
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span>Back</span>
                  </Button>
                  <Button
                    onClick={handleDemoSubmit}
                    size="lg"
                    className="flex-1"
                  >
                    <span>Generate</span>
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
            className="relative"
          >
            <div className="text-center">
              <LoadingAnimation 
                message={generationStatus || "🤖 AI is analyzing your repository and generating professional documentation..."}
                size="lg"
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm font-medium mb-1">{error}</p>
                {errorDetails && (
                  <p className="text-red-300 text-xs mb-2">{errorDetails}</p>
                )}
                <Button
                  onClick={() => setCurrentStep('url')}
                  variant="ghost"
                  className="mt-2 text-red-400 hover:text-red-300"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollAnimatedDiv>
  );
}