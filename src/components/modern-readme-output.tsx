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
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar';
import { CenteredWithLogo } from '@/components/blocks/footers/centered-with-logo';

interface ModernReadmeOutputProps {
  content: string;
  onClose?: () => void;
  onEdit?: () => void;
}

export default function ModernReadmeOutput({ 
  content, 
  onClose,
  onEdit 
}: ModernReadmeOutputProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
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

  const processedContent = marked(content) as string;
  const sanitizedContent = DOMPurify.sanitize(processedContent);

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white relative overflow-hidden">
      {/* Exact Same Background as Landing Page */}
      <div className="fixed inset-0 -z-10 overflow-hidden w-full h-full" style={{ minHeight: '100vh', minWidth: '100vw' }}>
        {/* Animated Geometric Grid */}
        <div className="absolute inset-0">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`h-line-${i}`}
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                style={{ top: `${i * 5}%` }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleX: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`v-line-${i}`}
                className="absolute h-full w-px bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
                style={{ left: `${i * 5}%` }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleY: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15
                }}
              />
            ))}
          </div>

          {/* Geometric Shapes */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`hexagon-${i}`}
              className="absolute w-16 h-16 border border-green-400/30"
              style={{
                left: `${15 + i * 12}%`,
                top: `${20 + i * 8}%`,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 12 + (i * 2),
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Floating Code Elements */}
          {[
            { text: "const readme = '🚀 README.md'", top: '10%', left: '15%', delay: 0 },
            { text: "function generate() { return magic }", top: '25%', left: '70%', delay: 1 },
            { text: "export default Component", top: '60%', left: '20%', delay: 2 },
            { text: "import { AI } from '@readme/gen'", top: '75%', left: '75%', delay: 3 },
            { text: "// Powered by Gemini", top: '40%', left: '85%', delay: 1.5 },
            { text: "README.md ✨", top: '85%', left: '40%', delay: 2.5 }
          ].map((item, index) => (
            <motion.div
              key={`code-${index}`}
              className="absolute font-mono text-sm"
              style={{ top: item.top, left: item.left }}
              animate={{
                y: [0, -15, 0],
                x: [0, 5, 0],
                opacity: [0.3, 0.7, 0.3],
                filter: [
                  `drop-shadow(0 0 2px rgba(0, 255, 136, 0.3))`,
                  `drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))`,
                  `drop-shadow(0 0 2px rgba(0, 255, 136, 0.3))`
                ]
              }}
              transition={{
                duration: 4 + (index % 2),
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay
              }}
            >
              <span className="text-green-400/50">{item.text}</span>
            </motion.div>
          ))}

          {/* Floating Icons */}
          {[
            { icon: Github, size: 24, top: '15%', left: '85%', delay: 0 },
            { icon: Code, size: 20, top: '35%', left: '10%', delay: 1 },
            { icon: GitBranch, size: 22, top: '65%', left: '90%', delay: 2 },
            { icon: Star, size: 18, top: '80%', left: '15%', delay: 1.5 },
            { icon: Zap, size: 16, top: '50%', left: '50%', delay: 0.5 }
          ].map((item, index) => (
            <motion.div
              key={`icon-${index}`}
              className="absolute"
              style={{ top: item.top, left: item.left }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 8 + (index * 2),
                repeat: Infinity,
                ease: "linear",
                delay: item.delay
              }}
            >
              <item.icon 
                className="text-green-400/40" 
                size={item.size}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.5))'
                }}
              />
            </motion.div>
          ))}

          {/* Reactive Energy Nodes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`node-${i}`}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`
              }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.1, 1, 0.1],
                boxShadow: [
                  '0 0 5px rgba(0, 255, 136, 0.5)',
                  '0 0 20px rgba(0, 255, 136, 1)',
                  '0 0 5px rgba(0, 255, 136, 0.5)'
                ]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}

          {/* Central Geometric Mandala */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="absolute inset-0 border border-green-400/20 rounded-full" />
            <div className="absolute inset-4 border border-green-400/30 rounded-full rotate-45" />
            <div className="absolute inset-8 border border-green-400/40 rounded-full -rotate-45" />
            <div className="absolute inset-12 border border-green-400/50 rounded-full" />
          </motion.div>

          {/* Enhanced Glow Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [-20, 20, -20],
              y: [-10, 10, -10]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-green-400/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.2, 0.05],
              x: [20, -20, 20],
              y: [10, -10, 10]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Navbar - positioned above background, always visible */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Secondary Header - positioned below navbar */}
      <motion.header
        className="sticky top-16 z-40 backdrop-blur-xl bg-black/60 border-b border-green-400/20"
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
                  className="relative group bg-gray-900/50 border border-green-400/20 hover:border-green-400/40 hover:bg-green-400/10"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="relative flex items-center gap-2">
                    {copySuccess ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </div>
                </Button>

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
              <div className="relative bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-2xl shadow-green-400/10">
                {/* Enhanced Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                
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

        {/* Footer - positioned at bottom naturally */}
        <footer className="relative z-10 mt-auto">
          <CenteredWithLogo />
        </footer>
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
        
        .scrollbar-thumb-green-400\/30::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(0, 255, 136, 0.4), rgba(0, 255, 136, 0.2));
          border-radius: 6px;
          border: 1px solid rgba(0, 255, 136, 0.1);
        }
        
        .scrollbar-thumb-green-400\/30::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(0, 255, 136, 0.6), rgba(0, 255, 136, 0.3));
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