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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar';
import MinimalGridBackground from '@/components/minimal-geometric-background';

interface ModernReadmeEditorProps {
  content: string;
  onClose?: () => void;
  onEdit?: () => void;
}

export default function ModernReadmeEditor({ 
  content: initialContent,
  onClose,
  onEdit 
}: ModernReadmeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<'preview' | 'split' | 'raw'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const generateLineNumbers = useCallback((text: string) => {
    const count = text.split('\n').length;
    return Array.from({ length: count }, (_, i) => (i + 1).toString());
  }, []);

  useEffect(() => {
    setLineNumbers(generateLineNumbers(content));
  }, [content, generateLineNumbers]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

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



  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !splitContainerRef.current) return;
    
    const containerRect = splitContainerRef.current.getBoundingClientRect();
    const newRatio = (e.clientX - containerRect.left) / containerRect.width;
    
    setSplitRatio(Math.max(0.2, Math.min(0.8, newRatio)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const processedContent = marked(content) as string;
  const sanitizedContent = DOMPurify.sanitize(processedContent);

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Editor Header */}
      <motion.header
        className="sticky top-16 z-40 backdrop-blur-xl bg-black/60 border-b border-green-400/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
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
                    <Code className="w-4 h-4 text-green-400" />
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
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'split'
                      ? 'bg-green-400 text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Split
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
                {/* Edit Button */}
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    size="sm"
                    className="relative group bg-green-400 text-black hover:bg-green-300 font-medium"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Edit
                    </div>
                  </Button>
                )}

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
                  variant="ghost"
                  size="sm"
                  className="bg-gray-900/50 border border-green-400/20 hover:border-green-400/40 hover:bg-green-400/10"
                >
                  <div className="flex items-center gap-2">
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

      {/* Main Editor Area */}
      <div className="relative z-10 min-h-screen pt-16">
        <main className="px-6 py-8 min-h-[calc(100vh-64px)]">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              className="relative h-[calc(100vh-160px)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {viewMode === 'preview' ? (
                  /* Preview Only View */
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-2xl shadow-green-400/10"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                    <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent p-8">
                      <div 
                        ref={previewRef}
                        className="prose prose-invert prose-green max-w-none modern-readme-preview"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                      />
                    </div>
                  </motion.div>
                ) : viewMode === 'split' ? (
                  /* Split View */
                  <motion.div
                    key="split"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    ref={splitContainerRef} 
                    className="flex h-full gap-4"
                  >
                    {/* Editor Panel */}
                    <div style={{ width: `${splitRatio * 100}%` }} className="relative">
                      <div className="h-full bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-2xl shadow-green-400/10">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                        <div className="relative h-full flex">
                          {/* Line Numbers */}
                          <div className="bg-black/20 text-gray-500 text-right pr-4 pl-4 py-4 font-mono text-sm select-none border-r border-green-400/20">
                            <AnimatePresence mode="sync">
                              {lineNumbers.map((num, index) => (
                                <motion.div
                                  key={num}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 0.5, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  transition={{ duration: 0.2, delay: index * 0.01 }}
                                  className="leading-6"
                                >
                                  {num}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                          
                          {/* Editor */}
                          <div className="flex-1 relative">
                            <textarea
                              ref={editorRef}
                              value={content}
                              onChange={handleContentChange}
                              className="w-full h-full bg-transparent text-white font-mono text-sm p-4 resize-none focus:outline-none leading-6 placeholder-gray-500"
                              placeholder="# Your README.md content here..."
                              spellCheck={false}
                              style={{
                                tabSize: 2,
                                MozTabSize: 2
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resizer */}
                    <div 
                      className="w-1 bg-green-400/20 cursor-col-resize hover:bg-green-400/40 transition-colors rounded-full"
                      onMouseDown={handleMouseDown}
                      style={{ cursor: isDragging ? 'col-resize' : 'default' }}
                    />
                    
                    {/* Preview Panel */}
                    <div style={{ width: `${(1 - splitRatio) * 100}%` }}>
                      <div className="h-full bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-2xl shadow-green-400/10">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                        <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent p-8">
                          <div 
                            ref={previewRef}
                            className="prose prose-invert prose-green max-w-none modern-readme-preview"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Raw View */
                  <motion.div
                    key="raw"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-2xl shadow-green-400/10"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
                    <div className="relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/30 scrollbar-track-transparent p-8">
                      <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {content}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          .backdrop-blur-xl {
            backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </div>
  );
}