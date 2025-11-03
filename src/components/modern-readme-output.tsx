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
  Save,
  AlertCircle,
  Calendar,
  Clock,
  BarChart3,
  Home,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { useAuth, authenticatedFetch } from '@/lib/auth-client';

interface ModernReadmeOutputProps {
  content: string;
  repositoryUrl?: string;
  projectName?: string;
  generationParams?: any;
  onClose?: () => void;
  onEdit?: () => void;
  disableAutoSave?: boolean;
  historyView?: boolean;
  createdAt?: string;
}

export default function ModernReadmeOutput({ 
  content, 
  repositoryUrl,
  projectName,
  generationParams,
  onClose,
  onEdit,
  disableAutoSave = false,
  historyView = false,
  createdAt
}: ModernReadmeOutputProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);
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
  
  const { user, isAuthenticated } = useAuth();

  // Format date helper function (from individual README view)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Navigation helpers
  const goBack = () => {
    if (onClose) {
      onClose();
    }
  };

  const goHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Auto-save to database when component mounts
  useEffect(() => {
    const autoSaveToDatabase = async () => {
      if (disableAutoSave || !isAuthenticated || !user || !repositoryUrl || autoSaved) return;
      
      // Check if this is a fresh generation from /readme/output page
      // If so, skip auto-save as it's already saved by the generation process
      if (typeof window !== 'undefined' && window.location.pathname === '/readme/output') {
        console.log('Skipping auto-save for fresh generation (already saved by generation process)');
        return;
      }

      try {
        const repositoryName = repositoryUrl.split('/').pop()?.replace('.git', '') || 'Unknown';
        
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
          console.warn('Failed to auto-save to history:', response.status);
        }
      } catch (error) {
        console.warn('Auto-save error (non-critical):', error);
      }
    };

    const timer = setTimeout(autoSaveToDatabase, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, repositoryUrl, content, projectName, generationParams, autoSaved, disableAutoSave]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setShowCopyPopup(true);
      
      setTimeout(() => {
        setCopySuccess(false);
        setShowCopyPopup(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
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
      
      setGithubSaveResult({
        success: true,
        message: result.message || 'README saved successfully',
        commitUrl: result.commit_url,
        fileUrl: result.file_url,
        isUpdate: result.message?.includes('updated')
      });
      
      setShowGithubPopup(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
        setGithubSaveResult(null);
        setShowGithubPopup(false);
      }, 8000);
      
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
    <div className="min-h-screen bg-transparent relative"
         style={{
           transform: 'translate3d(0, 0, 0)',
           willChange: 'auto',
           backfaceVisibility: 'hidden'
         }}>
        {/* Enhanced Navigation Header - Fixed at top - Only show if not in history view */}
        {!historyView && (
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-[99998] backdrop-blur-2xl border-b border-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent) 1',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16">
            {/* Desktop Layout - Hidden on mobile */}
            <div className="hidden sm:flex items-center justify-between py-5">
              {/* Far Left - Back Button */}
              <div className="flex-shrink-0">
                {onClose && (
                  <Button
                    onClick={goBack}
                    variant="outline"
                    size="sm"
                    className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10 h-10 px-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>

              {/* Center - Title and Action Buttons */}
              <div className="flex items-center gap-4 min-w-0 flex-1 justify-center mx-8">
                {/* Project Icon and Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-xl border border-green-400/20 flex-shrink-0 shadow-lg">
                    <FileText className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-xl font-bold text-white leading-relaxed">
                      {projectName || 'Generated README'}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-green-400 font-medium">Live Preview</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                  {/* View Mode Toggle */}
                  {!historyView && (
                    <div className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-green-400/20">
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
                    </div>
                  )}

                  {/* Copy Button */}
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className={`glass-button ${
                      copySuccess 
                        ? 'border-green-400/60 text-green-400' 
                        : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                    }`}
                  >
                    {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </Button>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    variant="outline"
                    size="sm"
                    className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10"
                  >
                    {isDownloading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 mr-2"
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </Button>

                  {/* Save to GitHub Button */}
                  {canSaveToRepo() && (
                    <Button
                      onClick={handleSaveToGitHub}
                      disabled={isSaving}
                      variant="outline"
                      size="sm"
                      className="glass-button border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                    >
                      {isSaving ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 mr-2"
                        >
                          <Zap className="w-4 h-4" />
                        </motion.div>
                      ) : saveSuccess ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to GitHub'}
                    </Button>
                  )}

                  {/* Edit Button */}
                  {onEdit && (
                    <Button
                      onClick={onEdit}
                      variant="outline"
                      size="sm"
                      className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Far Right - Home Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={goHome}
                  variant="outline" 
                  size="sm"
                  className="glass-button border-blue-400/20 text-blue-400 hover:bg-blue-400/10 h-10 px-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

            {/* Mobile Layout - Only visible on mobile */}
            <div className="sm:hidden py-4">
              {/* Mobile Header Row */}
              <div className="flex items-center justify-between mb-4">
                {onClose && (
                  <Button
                    onClick={goBack}
                    variant="outline"
                    size="sm"
                    className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10 h-9 px-3"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="text-xs">Back</span>
                  </Button>
                )}

                <Button
                  onClick={goHome}
                  variant="outline" 
                  size="sm"
                  className="glass-button border-blue-400/20 text-blue-400 hover:bg-blue-400/10 h-9 px-3"
                >
                  <Home className="w-4 h-4 mr-1" />
                  <span className="text-xs">Home</span>
                </Button>
              </div>

              {/* Mobile Title Section */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-lg border border-green-400/20 shadow-lg">
                    <FileText className="w-5 h-5 text-green-400" />
                  </div>
                  <h1 className="text-lg font-bold text-white leading-relaxed">
                    {projectName || 'Generated README'}
                  </h1>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-green-400 font-medium">Live Preview</p>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* View Mode Toggle */}
                {!historyView && (
                  <div className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-green-400/20">
                    <button
                      onClick={() => setViewMode('preview')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        viewMode === 'preview'
                          ? 'bg-green-400 text-black shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </button>
                    <button
                      onClick={() => setViewMode('raw')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        viewMode === 'raw'
                          ? 'bg-green-400 text-black shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      Raw
                    </button>
                  </div>
                )}

                {/* Copy Button */}
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className={`glass-button text-xs h-8 px-3 ${
                    copySuccess 
                      ? 'border-green-400/60 text-green-400' 
                      : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                  }`}
                >
                  {copySuccess ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  variant="outline"
                  size="sm"
                  className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10 text-xs h-8 px-3"
                >
                  {isDownloading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 mr-1"
                    >
                      <Zap className="w-3 h-3" />
                    </motion.div>
                  ) : (
                    <Download className="w-3 h-3 mr-1" />
                  )}
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>

                {/* Save to GitHub Button */}
                {canSaveToRepo() && (
                  <Button
                    onClick={handleSaveToGitHub}
                    disabled={isSaving}
                    variant="outline"
                    size="sm"
                    className="glass-button border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs h-8 px-3"
                  >
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 mr-1"
                      >
                        <Zap className="w-3 h-3" />
                      </motion.div>
                    ) : saveSuccess ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to GitHub'}
                  </Button>
                )}

                {/* Edit Button */}
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10 text-xs h-8 px-3"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Tablet Action Buttons Row - Only visible on tablet screens */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:block lg:hidden border-t border-gray-700/20 pt-4 pb-3"
            >
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* View Mode Toggle */}
                {!historyView && (
                  <div className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-green-400/20">
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
                  </div>
                )}

                {/* Copy Button */}
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className={`glass-button ${
                    copySuccess 
                      ? 'border-green-400/60 text-green-400' 
                      : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                  }`}
                >
                  {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>

                {/* Download Button */}
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  variant="outline"
                  size="sm"
                  className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10"
                >
                  {isDownloading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>

                {/* Save to GitHub Button */}
                {canSaveToRepo() && (
                  <Button
                    onClick={handleSaveToGitHub}
                    disabled={isSaving}
                    variant="outline"
                    size="sm"
                    className="glass-button border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                  >
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 mr-2"
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                    ) : saveSuccess ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to GitHub'}
                  </Button>
                )}

                {/* Edit Button */}
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="glass-button border-green-400/30 text-green-400 hover:bg-green-400/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.header>
        )}

        {/* Spacer to prevent overlap - Different heights for mobile vs desktop */}
        <div className={`${historyView ? 'h-4' : 'h-80 sm:h-48 lg:h-32'}`}></div>

        {/* README Content - Uses main page scroll for continuous scrolling */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="pb-8"
        >
          <div className="w-full px-2 sm:container sm:mx-auto sm:px-6 lg:px-8">
            <div className="sm:max-w-6xl sm:mx-auto">
              <div className="glass rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-6 lg:p-10 xl:p-12">
                {historyView || viewMode === 'preview' ? (
                  <div 
                    className="prose prose-invert prose-green max-w-none modern-readme-preview prose-sm sm:prose-base overflow-x-auto"
                    style={{ wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  />
                ) : (
                  <pre className="font-mono text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {content}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </motion.main>

        {/* Notification Popups */}
        <AnimatePresence>
          {/* GitHub Save Success Message */}
          {githubSaveResult && githubSaveResult.success && (
            <motion.div
              className="fixed bottom-4 left-4 right-4 z-[100] bg-[rgba(0,255,100,0.08)] backdrop-blur-xl border border-[rgba(0,255,100,0.3)] rounded-2xl p-4 shadow-lg shadow-green-400/20"
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
              className="fixed bottom-4 left-4 right-4 z-[100] bg-[rgba(255,0,0,0.08)] backdrop-blur-xl border border-[rgba(255,0,0,0.3)] rounded-2xl p-3 shadow-lg shadow-red-400/20"
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

          {/* Copy Success Popup */}
          {showCopyPopup && (
            <motion.div
              className="fixed bottom-4 left-4 right-4 z-[100] bg-[rgba(0,255,100,0.08)] backdrop-blur-xl border border-[rgba(0,255,100,0.3)] rounded-2xl p-3 shadow-lg shadow-green-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>README copied to clipboard!</span>
              </div>
            </motion.div>
          )}

          {/* Download Success Popup */}
          {showDownloadPopup && (
            <motion.div
              className="fixed bottom-4 left-4 right-4 z-[100] bg-[rgba(0,255,100,0.08)] backdrop-blur-xl border border-[rgba(0,255,100,0.3)] rounded-2xl p-3 shadow-lg shadow-green-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Download className="w-4 h-4 flex-shrink-0" />
                <span>README.md downloaded successfully!</span>
              </div>
            </motion.div>
          )}

          {/* Authentication Notice */}
          {!isAuthenticated && repositoryUrl && !githubSaveResult && (
            <motion.div
              className="fixed bottom-4 left-4 right-4 z-[100] bg-[rgba(0,100,255,0.08)] backdrop-blur-xl border border-[rgba(0,100,255,0.25)] rounded-2xl p-3 shadow-lg shadow-blue-400/20"
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
        </AnimatePresence>
      </div>
  );
}
