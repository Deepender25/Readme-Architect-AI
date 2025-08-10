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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar';
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
      }, 300);
      
      // Reset success state
      setTimeout(() => setCopySuccess(false), 2500);
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
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Optionally show success message with commit URL
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
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>

      {/* Navbar - positioned above background, always visible */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Secondary Header - positioned below navbar */}
      <motion.header
        className="sticky top-16 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-cyan-400/60"
          style={{ width: `${scrollProgress * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <motion.div
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-lg blur opacity-50" />
                  <div className="relative bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    README Generated
                  </h1>
                  <p className="text-xs text-gray-400">Your documentation is ready</p>
                </div>
              </motion.div>

              {/* View Mode Toggle */}
              <motion.div
                className="flex items-center bg-black/30 backdrop-blur-md rounded-lg p-1 border border-white/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'preview'
                      ? 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white shadow-lg backdrop-blur-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'raw'
                      ? 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white shadow-lg backdrop-blur-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                  className={`relative group transition-all duration-300 backdrop-blur-md ${
                    copySuccess 
                      ? 'bg-blue-500/20 border-blue-400/60 text-blue-400' 
                      : 'bg-black/30 border-white/20 hover:border-blue-400/40 hover:bg-blue-400/10'
                  }`}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-lg blur transition-opacity duration-300 ${
                    copySuccess ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
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
                          <Check className="w-4 h-4 text-blue-400" />
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
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-lg"
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
                    className="relative group bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white hover:from-purple-600/80 hover:to-pink-600/80 font-medium backdrop-blur-md"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
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
                  className="relative group bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white hover:from-cyan-600/80 hover:to-blue-600/80 font-medium backdrop-blur-md"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
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
                    className="bg-black/30 backdrop-blur-md border border-white/20 hover:border-purple-400/40 hover:bg-purple-400/10"
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
                    className="bg-black/30 backdrop-blur-md border border-white/20 hover:border-red-400/40 hover:bg-red-400/10 text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area - Flex layout to push footer to bottom */}
      <div className="relative z-10 min-h-screen pt-16 flex flex-col">
        {/* Content Section */}
        <main className="flex-1 px-6 py-8">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Content Container with Enhanced Blur */}
              <div className="relative bg-black/20 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-400/5">
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-2xl blur-lg opacity-30" />
                
                <div 
                  ref={contentRef}
                  className="relative max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent"
                >
                  <AnimatePresence mode="wait">
                    {viewMode === 'preview' ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-8"
                      >
                        <div 
                          ref={previewRef}
                          className="prose prose-invert prose-green max-w-none modern-readme-preview"
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
                        className="p-8"
                      >
                        <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {content}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Save Error Message */}
              {saveError && (
                <motion.div
                  className="absolute -bottom-16 left-4 right-4 bg-red-500/10 backdrop-blur-md border border-red-400/30 rounded-lg p-3"
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
              {!isAuthenticated && repositoryUrl && (
                <motion.div
                  className="absolute -bottom-12 left-4 right-4 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-lg p-3"
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
              {isAuthenticated && repositoryUrl && !canSaveToRepo() && (
                <motion.div
                  className="absolute -bottom-12 left-4 right-4 bg-amber-500/10 backdrop-blur-md border border-amber-400/30 rounded-lg p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>You can only save README files to your own repositories</span>
                  </div>
                </motion.div>
              )}

              {/* Auto-save Status */}
              {isAuthenticated && autoSaved && (
                <motion.div
                  className="absolute -bottom-12 left-4 bg-emerald-500/10 backdrop-blur-md border border-emerald-400/30 rounded-lg px-3 py-2"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
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
                className="absolute -bottom-6 right-4 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-blue-400/30 border border-white/10"
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
          border-bottom: 2px solid rgba(96, 165, 250, 0.6);
          background: linear-gradient(135deg, #f0f6fc 0%, #60a5fa 50%, #a78bfa 100%);
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
          border-bottom: 1px solid rgba(96, 165, 250, 0.4);
          position: relative;
        }
        
        .modern-readme-preview h2::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, rgba(96, 165, 250, 0.6), transparent);
        }
        
        .modern-readme-preview h3 {
          color: #60a5fa;
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
          border-left: 4px solid rgba(96, 165, 250, 0.6);
          margin: 20px 0;
          background: rgba(96, 165, 250, 0.05);
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
          color: #60a5fa;
        }
        
        .modern-readme-preview code {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(168, 139, 250, 0.05));
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.9em;
          color: #60a5fa;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
          border: 1px solid rgba(96, 165, 250, 0.2);
        }
        
        .modern-readme-preview pre {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(17, 17, 17, 0.6));
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 20px 0;
          border: 1px solid rgba(96, 165, 250, 0.2);
          position: relative;
        }
        
        .modern-readme-preview pre::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), transparent);
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
          border: 1px solid rgba(96, 165, 250, 0.2);
          backdrop-filter: blur(5px);
        }
        
        .modern-readme-preview th, 
        .modern-readme-preview td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(96, 165, 250, 0.1);
        }
        
        .modern-readme-preview th {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(168, 139, 250, 0.05));
          font-weight: 600;
          color: #60a5fa;
        }
        
        .modern-readme-preview td {
          color: #e6edf3;
        }
        
        .modern-readme-preview a {
          color: #60a5fa;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }
        
        .modern-readme-preview a:hover {
          border-bottom-color: #60a5fa;
          text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }
        
        .modern-readme-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 16px 0;
          border: 1px solid rgba(96, 165, 250, 0.2);
        }
        
        .modern-readme-preview hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), transparent);
          margin: 32px 0;
        }
        
        .modern-readme-preview strong {
          color: #60a5fa;
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
        
        .scrollbar-thumb-green-400\/30::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(96, 165, 250, 0.4), rgba(168, 139, 250, 0.2));
          border-radius: 6px;
          border: 1px solid rgba(96, 165, 250, 0.1);
        }
        
        .scrollbar-thumb-green-400\/30::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(96, 165, 250, 0.6), rgba(168, 139, 250, 0.3));
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-corner {
          background: transparent;
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