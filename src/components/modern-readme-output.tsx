"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Eye, 
  Code, 
  Sparkles,
  FileText,
  Zap,
  Github,
  GitBranch,
  Star,
  Save,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

import MinimalGridBackground from '@/components/minimal-geometric-background';
import { useAuth, authenticatedFetch } from '@/lib/auth';

interface ModernReadmeOutputProps {
  content: string;
  repositoryUrl?: string;
  projectName?: string;
  generationParams?: any;
  onClose?: () => void;
  onEdit?: () => void;
}

export default function ModernReadmeOutput({ 
  content, 
  repositoryUrl,
  projectName,
  generationParams,
  onClose,
  onEdit 
}: ModernReadmeOutputProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [autoSaved, setAutoSaved] = useState(false);
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [githubSaveResult, setGithubSaveResult] = useState<{
    success: boolean;
    message: string;
    commitUrl?: string;
    fileUrl?: string;
    isUpdate?: boolean;
  } | null>(null);
  const [showGithubPopup, setShowGithubPopup] = useState(false);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated } = useAuth();

  // Handle scroll progress for the animated progress bar
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
  }, []);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Auto-save to database when component mounts
  useEffect(() => {
    const autoSaveToDatabase = async () => {
      if (!isAuthenticated || !user || !repositoryUrl || autoSaved) return;

      try {
        const repositoryName = repositoryUrl.split('/').pop()?.replace('.git', '') || 'Unknown';
        
        // Use regular fetch instead of authenticatedFetch to avoid automatic redirects
        const response = await fetch('/api/save-history', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repository_url: repositoryUrl,
            repository_name: repositoryName,
            project_name: projectName || repositoryName,
            readme_content: content,
            generation_params: generationParams || {}
          })
        });

        if (response.ok) {
          setAutoSaved(true);
          console.log('README automatically saved to history');
        } else {
          // Don't trigger redirects for auto-save failures
          console.warn('Failed to auto-save to history:', response.status);
        }
      } catch (error) {
        // Silently handle auto-save errors to avoid disrupting user experience
        console.warn('Auto-save error (non-critical):', error);
      }
    };

    // Delay auto-save slightly to ensure component is fully mounted
    const timer = setTimeout(autoSaveToDatabase, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, repositoryUrl, content, projectName, generationParams, autoSaved]);

  const handleCopy = async () => {
    try {
      setCopyAnimation(true);
      await navigator.clipboard.writeText(content);
      
      // Trigger success animation
      setTimeout(() => {
        setCopySuccess(true);
        setCopyAnimation(false);
        setShowCopyPopup(true);
      }, 300);
      
      // Reset success state and hide popup
      setTimeout(() => {
        setCopySuccess(false);
        setShowCopyPopup(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyAnimation(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    
    setIsDownloading(false);
    setShowDownloadPopup(true);
    
    // Hide download popup after 3 seconds
    setTimeout(() => setShowDownloadPopup(false), 3000);
  };

  const handleSaveToGitHub = async () => {
    if (!isAuthenticated || !user) {
      setSaveError('Please sign in to save to GitHub');
      return;
    }

    if (!repositoryUrl) {
      setSaveError('Repository URL is required to save to GitHub');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await authenticatedFetch('/api/save-readme', {
        method: 'POST',
        body: JSON.stringify({
          repositoryUrl,
          readmeContent: content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save README');
      }

      const result = await response.json();
      setSaveSuccess(true);
      
      // Set detailed GitHub save result
      setGithubSaveResult({
        success: true,
        message: result.message || 'README saved successfully',
        commitUrl: result.commit_url,
        fileUrl: result.file_url,
        isUpdate: result.message?.includes('updated')
      });
      
      // Show GitHub popup
      setShowGithubPopup(true);
      
      // Reset success state after longer duration to show the detailed message
      setTimeout(() => {
        setSaveSuccess(false);
        setGithubSaveResult(null);
        setShowGithubPopup(false);
      }, 8000);
      
      console.log('README saved successfully:', result);
      
    } catch (error) {
      console.error('Error saving README:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save README to GitHub');
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if user owns the repository
  const canSaveToRepo = () => {
    if (!isAuthenticated || !user || !repositoryUrl) return false;
    
    const urlMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!urlMatch) return false;
    
    const [, owner] = urlMatch;
    return owner === user.username;
  };

  const processedContent = marked(content) as string;
  const sanitizedContent = DOMPurify.sanitize(processedContent);

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden performance-optimized smooth-scroll no-lag">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>

      {/* Main Header - positioned at top */}
      <motion.header
        className="sticky top-0 z-50 glass-navbar border-b border-green-400/20 no-lag"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600"
          style={{ width: `${scrollProgress * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              {/* Back Button */}
              <motion.button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-green-400/10"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>

              <motion.div
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-30" />
                  <div className="relative bg-black p-2 rounded-lg">
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                    README Generated
                  </h1>
                  <p className="text-xs text-gray-400">Your documentation is ready</p>
                </div>
              </motion.div>

              {/* View Mode Toggle */}
              <motion.div
                className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-green-400/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'preview'
                      ? 'bg-green-400 text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'raw'
                      ? 'bg-green-400 text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Raw
                </button>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Copy Button */}
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className={`relative group transition-all duration-300 ${
                    copySuccess 
                      ? 'bg-green-500/20 border-green-400/60 text-green-400' 
                      : 'bg-gray-900/50 border-green-400/20 hover:border-green-400/40 hover:bg-green-400/10'
                  }`}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur transition-opacity duration-300 ${
                    copySuccess ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                  }`} />
                  <div className="relative flex items-center gap-2">
                    <AnimatePresence mode="wait">
                      {copyAnimation ? (
                        <motion.div
                          key="copying"
                          initial={{ scale: 0.8, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0.8, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.div>
                        </motion.div>
                      ) : copySuccess ? (
                        <motion.div
                          key="success"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          <Check className="w-4 h-4 text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.span
                      key={copySuccess ? 'copied' : 'copy'}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </motion.span>
                  </div>
                  
                  {/* Success ripple effect */}
                  {copySuccess && (
                    <motion.div
                      className="absolute inset-0 bg-green-400/20 rounded-lg"
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                </Button>

                {/* Save to GitHub Button */}
                {canSaveToRepo() && (
                  <Button
                    onClick={handleSaveToGitHub}
                    disabled={isSaving}
                    size="sm"
                    className="relative group bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative flex items-center gap-2">
                      {isSaving ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="w-4 h-4" />
                        </motion.div>
                      ) : saveSuccess ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to GitHub'}
                    </div>
                  </Button>
                )}

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  size="sm"
                  className="relative group bg-green-400 text-black hover:bg-green-300 font-medium"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative flex items-center gap-2">
                    {isDownloading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </div>
                </Button>

                {/* Edit Button */}
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="ghost"
                    size="sm"
                    className="bg-gray-900/50 border border-green-400/20 hover:border-green-400/40 hover:bg-green-400/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}

                {/* Close Button */}
                {onClose && (
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="bg-gray-900/50 border border-red-400/20 hover:border-red-400/40 hover:bg-red-400/10 text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pb-32">
        {/* Content Section */}
        <main className="px-4 sm:px-6 py-6">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Content Container with Enhanced Glass Effect */}
              <div className="relative glass rounded-3xl overflow-hidden shadow-glass-lg shadow-green-400/20 no-lag min-h-[calc(100vh-200px)]">
                {/* Multi-layered Glass Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-3xl blur-xl opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.08)] via-transparent to-[rgba(0,255,100,0.05)] rounded-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,100,0.1),transparent_50%)]" />
                
                <div 
                  ref={contentRef}
                  className="relative h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-green scroll-smooth gpu-accelerated"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <AnimatePresence mode="wait">
                    {viewMode === 'preview' ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 lg:p-12"
                      >
                        <div 
                          ref={previewRef}
                          className="prose prose-invert prose-green max-w-none modern-readme-preview prose-lg"
                          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="raw"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 sm:p-8 lg:p-12"
                      >
                        <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                          {content}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* GitHub Save Success Message */}
              {githubSaveResult && githubSaveResult.success && (
                <motion.div
                  className="absolute -bottom-20 left-4 right-4 bg-[rgba(0,255,100,0.08)] backdrop-blur-xl border border-[rgba(0,255,100,0.3)] rounded-2xl p-4 shadow-lg shadow-green-400/20"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: 2 }}
                      className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-green-400 font-medium text-sm mb-1">
                        {githubSaveResult.isUpdate ? '📝 README Updated!' : '✨ README Created!'}
                      </h4>
                      <p className="text-gray-300 text-xs mb-2">{githubSaveResult.message}</p>
                      <div className="flex gap-2">
                        {githubSaveResult.commitUrl && (
                          <a
                            href={githubSaveResult.commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded text-xs text-green-400 transition-colors"
                          >
                            <GitBranch className="w-3 h-3" />
                            View Commit
                          </a>
                        )}
                        {githubSaveResult.fileUrl && (
                          <a
                            href={githubSaveResult.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded text-xs text-green-400 transition-colors"
                          >
                            <Github className="w-3 h-3" />
                            View File
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Save Error Message */}
              {saveError && (
                <motion.div
                  className="absolute -bottom-16 left-4 right-4 bg-[rgba(255,0,0,0.08)] backdrop-blur-xl border border-[rgba(255,0,0,0.3)] rounded-2xl p-3 shadow-lg shadow-red-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                </motion.div>
              )}

              {/* Authentication Notice */}
              {!isAuthenticated && repositoryUrl && !githubSaveResult && (
                <motion.div
                  className="absolute -bottom-12 left-4 right-4 bg-[rgba(0,100,255,0.08)] backdrop-blur-xl border border-[rgba(0,100,255,0.25)] rounded-2xl p-3 shadow-lg shadow-blue-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <Github className="w-4 h-4 flex-shrink-0" />
                    <span>Sign in to save README directly to your GitHub repository</span>
                  </div>
                </motion.div>
              )}

              {/* Repository Ownership Notice */}
              {isAuthenticated && repositoryUrl && !canSaveToRepo() && !githubSaveResult && (
                <motion.div
                  className="absolute -bottom-12 left-4 right-4 bg-[rgba(255,200,0,0.08)] backdrop-blur-xl border border-[rgba(255,200,0,0.25)] rounded-2xl p-3 shadow-lg shadow-yellow-400/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>You can only save README files to your own repositories</span>
                  </div>
                </motion.div>
              )}

              {/* Auto-save Status */}
              {isAuthenticated && autoSaved && !githubSaveResult && (
                <motion.div
                  className="absolute -bottom-12 left-4 bg-[rgba(0,255,100,0.15)] backdrop-blur-xl border border-[rgba(0,255,100,0.4)] rounded-2xl px-3 py-2 shadow-lg shadow-green-400/25"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                    <span>Automatically saved to history</span>
                  </div>
                </motion.div>
              )}

              {/* Floating Action Hint */}
              <motion.div
                className="absolute -bottom-6 right-4 bg-green-400 text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-green-400/50"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  README ready to use!
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Popup Notifications */}
      <AnimatePresence>
        {/* GitHub Save Success Popup */}
        {showGithubPopup && githubSaveResult && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-20 right-6 z-[100] max-w-md w-full"
          >
            <div className="relative bg-[rgba(15,15,15,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.2)] rounded-2xl p-4 shadow-2xl shadow-green-400/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.1)] via-transparent to-[rgba(0,255,100,0.08)] rounded-2xl pointer-events-none" />
              <div className="relative flex items-start gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                >
                  <Github className="w-4 h-4 text-green-400" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-green-400 mb-1">
                    {githubSaveResult.isUpdate ? 'README Updated!' : 'README Created!'}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">{githubSaveResult.message}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {githubSaveResult.commitUrl && (
                  <a
                    href={githubSaveResult.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg px-2 py-1.5 text-center text-xs text-green-400 transition-colors"
                  >
                    View Commit
                  </a>
                )}
                {githubSaveResult.fileUrl && (
                  <a
                    href={githubSaveResult.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg px-2 py-1.5 text-center text-xs text-green-400 transition-colors"
                  >
                    View File
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Copy Success Popup */}
        {showCopyPopup && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed right-6 z-[100] max-w-sm w-full ${
              showGithubPopup ? 'top-44' : 'top-20'
            }`}
          >
            <div className="relative bg-[rgba(15,15,15,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.2)] rounded-2xl p-4 shadow-2xl shadow-green-400/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.1)] via-transparent to-[rgba(0,255,100,0.08)] rounded-2xl pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Copy className="w-4 h-4 text-green-400" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-green-400 mb-1">Copied to Clipboard!</h3>
                  <p className="text-gray-300 text-xs">README content copied successfully</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Download Success Popup */}
        {showDownloadPopup && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed right-6 z-[100] max-w-sm w-full ${
              showGithubPopup && showCopyPopup ? 'top-68' : 
              showGithubPopup || showCopyPopup ? 'top-44' : 'top-20'
            }`}
          >
            <div className="relative bg-[rgba(15,15,15,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.2)] rounded-2xl p-4 shadow-2xl shadow-green-400/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.1)] via-transparent to-[rgba(0,255,100,0.08)] rounded-2xl pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <Download className="w-4 h-4 text-green-400" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-green-400 mb-1">Download Complete!</h3>
                  <p className="text-gray-300 text-xs">README.md downloaded to your device</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx global>{`
        .modern-readme-preview {
          color: #e6edf3;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .modern-readme-preview h1 {
          color: #f0f6fc;
          font-size: 2.5em;
          font-weight: 700;
          margin-bottom: 24px;
          padding-bottom: 0.3em;
          border-bottom: 2px solid #00ff88;
          background: linear-gradient(135deg, #f0f6fc 0%, #00ff88 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }
        
        .modern-readme-preview h2 {
          color: #f0f6fc;
          font-size: 1.8em;
          font-weight: 600;
          margin-top: 32px;
          margin-bottom: 20px;
          padding-bottom: 0.3em;
          border-bottom: 1px solid #00ff88;
          position: relative;
        }
        
        .modern-readme-preview h2::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #00ff88, transparent);
        }
        
        .modern-readme-preview h3 {
          color: #00ff88;
          font-size: 1.4em;
          font-weight: 600;
          margin-top: 28px;
          margin-bottom: 16px;
        }
        
        .modern-readme-preview h4, 
        .modern-readme-preview h5, 
        .modern-readme-preview h6 {
          color: #f0f6fc;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        
        .modern-readme-preview p {
          margin-bottom: 16px;
          color: #e6edf3;
          line-height: 1.7;
        }
        
        .modern-readme-preview blockquote {
          padding: 16px 20px;
          color: #8d96a0;
          border-left: 4px solid #00ff88;
          margin: 20px 0;
          background: rgba(0, 255, 136, 0.05);
          border-radius: 0 8px 8px 0;
        }
        
        .modern-readme-preview ul, 
        .modern-readme-preview ol {
          padding-left: 2em;
          margin-bottom: 16px;
        }
        
        .modern-readme-preview li {
          margin-bottom: 8px;
          color: #e6edf3;
          line-height: 1.6;
        }
        
        .modern-readme-preview li::marker {
          color: #00ff88;
        }
        
        .modern-readme-preview code {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.9em;
          color: #00ff88;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .modern-readme-preview pre {
          background: linear-gradient(135deg, #0a0a0a, #111111);
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 20px 0;
          border: 1px solid rgba(0, 255, 136, 0.2);
          position: relative;
        }
        
        .modern-readme-preview pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ff88, transparent);
        }
        
        .modern-readme-preview pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
          color: #f0f6fc;
          border: none;
        }
        
        .modern-readme-preview table {
          border-collapse: collapse;
          margin: 20px 0;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .modern-readme-preview th, 
        .modern-readme-preview td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(0, 255, 136, 0.1);
        }
        
        .modern-readme-preview th {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
          font-weight: 600;
          color: #00ff88;
        }
        
        .modern-readme-preview td {
          color: #e6edf3;
        }
        
        .modern-readme-preview a {
          color: #00ff88;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }
        
        .modern-readme-preview a:hover {
          border-bottom-color: #00ff88;
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }
        
        .modern-readme-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 16px 0;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .modern-readme-preview hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ff88, transparent);
          margin: 32px 0;
        }
        
        .modern-readme-preview strong {
          color: #00ff88;
          font-weight: 600;
        }
        
        .modern-readme-preview em {
          color: #e6edf3;
          font-style: italic;
        }

        /* Badge Styling */
        .modern-readme-preview img[alt*="badge" i],
        .modern-readme-preview img[src*="shields.io"],
        .modern-readme-preview img[src*="badge"] {
          display: inline-block;
          margin: 4px;
          border-radius: 4px;
          border: none;
        }

        /* Center aligned content */
        .modern-readme-preview p[align="center"],
        .modern-readme-preview div[align="center"] {
          text-align: center;
        }

        /* Enhanced Scrollbar Styling */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-green-400\/40::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(0, 255, 136, 0.5), rgba(0, 255, 136, 0.3));
          border-radius: 8px;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .scrollbar-thumb-green-400\/40::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(0, 255, 136, 0.7), rgba(0, 255, 136, 0.4));
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        }
        
        .scrollbar-track-green-900\/20::-webkit-scrollbar-track {
          background: rgba(20, 83, 45, 0.2);
          border-radius: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Smooth Scrolling */
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        html {
          scroll-behavior: smooth;
        }

        /* Enhanced backdrop blur support */
        @supports (backdrop-filter: blur(20px)) {
          .backdrop-blur-2xl {
            backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </div>
  );
}