"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Copy, GitBranch, Loader2, Check, X, AlertCircle, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { useAuth } from '@/lib/auth-client';
import RepositoriesList from '@/components/repositories-list';
import HistoryList from '@/components/history-list';
import ModernReadmeOutput from '@/components/modern-readme-output';
import ModernReadmeEditor from '@/components/modern-readme-editor';

interface GitHubReadmeEditorProps {
  initialContent?: string;
  onClose?: () => void;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

const templates: Template[] = [
  {
    id: 'standard',
    name: 'Standard Project',
    content: `# Project Name

A brief description of your project goes here.

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

### Prerequisites

List what needs to be installed before running the project.

### Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

Describe how to use your project with code examples.

## Contributing

We welcome contributions! Please read our contributing guidelines.

## License

This project is licensed under the MIT License.`
  },
  {
    id: 'web',
    name: 'Web Application',
    content: `# Web Application Name

Build modern web applications with this template.

## 🚀 Features

- Responsive design
- Modern tech stack
- SEO optimized
- PWA ready

## 📋 Requirements

- Node.js 16+
- Modern browser

## 🛠️ Installation

\`\`\`bash
git clone repository-url
cd project-name
npm install
\`\`\`

## 🎯 Usage

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

## 🏗️ Build

\`\`\`bash
npm run build
\`\`\`

## 📄 Scripts

- \`npm run dev\` - Development server
- \`npm run build\` - Production build
- \`npm test\` - Run tests`

  }
];

export default function GitHubReadmeEditor({ 
  initialContent = templates[0].content, 
  onClose 
}: GitHubReadmeEditorProps) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [generationStatus, setGenerationStatus] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [includeDemo, setIncludeDemo] = useState(false);
  const [numScreenshots, setNumScreenshots] = useState(0);
  const [numVideos, setNumVideos] = useState(0);
  const [error, setError] = useState('');
  const [showRepositories, setShowRepositories] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showModernOutput, setShowModernOutput] = useState(false);
  const [showModernEditor, setShowModernEditor] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const generateLineNumbers = useCallback((text: string) => {
    const count = text.split('\n').length;
    return Array.from({ length: count }, (_, i) => (i + 1).toString());
  }, []);

  useEffect(() => {
    setLineNumbers(generateLineNumbers(content));
  }, [content, generateLineNumbers]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
    setContent(template.content);
  };

  const handleGenerateFromRepo = async () => {
    if (!repositoryUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationStatus('Starting generation...');

    try {
      // Use the streaming API for real-time updates
      const { createStreamingGenerator } = await import('@/lib/readme-generator');
      
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
            setContent(event.readme);
            setGenerationStatus('README generated successfully!');
            setTimeout(() => setGenerationStatus(''), 3000);
            
            // History will be auto-saved by the output component to prevent duplicate saves
            
            // Call completion callback
            if (onGenerationComplete) {
              onGenerationComplete(event.readme);
            }
          } else if (event.error) {
            setError(event.error);
            setGenerationStatus('');
          }
        }
      );

      // Store abort function for cleanup
      const cleanup = () => {
        abortStream();
        setIsGenerating(false);
      };

      // Cleanup on component unmount or new generation
      return cleanup;
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate README');
      setGenerationStatus('');
      setIsGenerating(false);
    }
  };



  const handleSelectRepository = (repoUrl: string, repoName: string) => {
    setRepositoryUrl(repoUrl);
    setProjectName(repoName);
    setShowRepositories(false);
  };

  const handleSelectHistory = (item: any) => {
    setContent(item.readme_content);
    setRepositoryUrl(item.repository_url);
    setProjectName(item.project_name || item.repository_name);
    setIncludeDemo(item.generation_params.include_demo);
    setNumScreenshots(item.generation_params.num_screenshots);
    setNumVideos(item.generation_params.num_videos);
    setShowHistory(false);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
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

  // Show modern output if requested
  if (showModernOutput) {
    return (
      <ModernReadmeOutput
        content={content}
        repositoryUrl={repositoryUrl}
        projectName={projectName}
        generationParams={{
          include_demo: includeDemo,
          num_screenshots: numScreenshots,
          num_videos: numVideos
        }}
        onClose={() => setShowModernOutput(false)}
        onEdit={() => {
          setShowModernOutput(false);
          setShowModernEditor(true);
        }}
      />
    );
  }

  // Show modern editor if requested
  if (showModernEditor) {
    return (
      <ModernReadmeEditor
        initialContent={content}
        onClose={() => setShowModernEditor(false)}
        onSave={(newContent) => {
          setContent(newContent);
          setShowModernEditor(false);
          setShowModernOutput(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Header */}
      <motion.div 
        className="border-b border-border backdrop-blur-md bg-surface/80"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold font-sans leading-normal">GitHub README Editor</h1>
              <div className="relative">
                <select 
                  value={selectedTemplate.id}
                  onChange={(e) => {
                    const template = templates.find(t => t.id === e.target.value);
                    if (template) handleTemplateChange(template);
                  }}
                  className="appearance-none bg-surface border border-border rounded-md px-3 py-1.5 text-sm font-sans cursor-pointer hover:bg-primary/10 transition-colors leading-normal"
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setShowModernOutput(true)}
                className="gap-2 h-8 text-sm bg-green-600 hover:bg-green-700 text-white"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Modern View
              </Button>
              <Button 
                onClick={() => setShowModernEditor(true)}
                variant="outline"
                className="gap-2 h-8 text-sm border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Modern Editor
              </Button>
              <Button 
                onClick={handleCopy}
                variant="ghost"
                className="gap-2 h-8 text-sm"
              >
                {copySuccess ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy
              </Button>
              <Button 
                onClick={handleDownload}
                variant="ghost"
                className="gap-2 h-8 text-sm"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              {onClose && (
                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="gap-2 h-8 text-sm"
                >
                  <X className="h-3.5 w-3.5" />
                  Close
                </Button>
              )}
            </div>
          </div>

          {/* AI Generation Controls */}
          <div className="flex flex-col gap-4 p-4 bg-surface/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-green-400">AI README Generation</h3>
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    {showHistory ? 'Hide' : 'Show'} History
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRepositories(!showRepositories)}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    {showRepositories ? 'Hide' : 'Show'} Repositories
                  </Button>
                </div>
              )}
            </div>

            {/* History List */}
            {isAuthenticated && showHistory && (
              <div className="border border-border rounded-lg p-4 bg-surface/30">
                <HistoryList onSelectHistory={handleSelectHistory} />
              </div>
            )}

            {/* Repositories List */}
            {isAuthenticated && showRepositories && (
              <div className="border border-border rounded-lg p-4 bg-surface/30">
                <RepositoriesList onSelectRepository={handleSelectRepository} />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Repository URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {isAuthenticated && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRepositories(!showRepositories)}
                        className="h-6 px-2 text-xs text-green-400 hover:bg-green-500/10"
                      >
                        Browse
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Project Name (Optional)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeDemo}
                  onChange={(e) => setIncludeDemo(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Include Demo Section
              </label>
              
              {includeDemo && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Screenshots:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={numScreenshots}
                      onChange={(e) => setNumScreenshots(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-input border border-border rounded text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Videos:</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={numVideos}
                      onChange={(e) => setNumVideos(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-input border border-border rounded text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button 
                onClick={handleGenerateFromRepo}
                disabled={isGenerating || !repositoryUrl.trim()}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {isGenerating ? (
                  <div className="cube-loader-global cube-loader-inline">
                    <div className="cube-global"></div>
                    <div className="cube-global"></div>
                    <div className="cube-global"></div>
                    <div className="cube-global"></div>
                  </div>
                ) : (
                  <GitBranch className="h-4 w-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate from Repository'}
              </Button>
              
              {(generationStatus || error) && (
                <div className="flex items-center gap-2 text-sm">
                  {error ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">{error}</span>
                    </>
                  ) : (
                    <span className="text-green-400">{generationStatus}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Split View */}
      <div ref={splitContainerRef} className="flex h-[calc(100vh-200px)]">
        {/* Editor Panel */}
        <div style={{ width: `${splitRatio * 100}%` }} className="relative">
          <motion.div 
            className="h-full backdrop-blur-sm bg-surface/70 border-r border-border overflow-hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex h-full">
              {/* Line Numbers */}
              <div className="bg-surface text-muted-foreground text-right pr-4 pl-4 py-4 font-mono text-sm select-none">
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
                  className="w-full h-full bg-transparent text-foreground font-mono text-sm p-4 resize-none focus:outline-none leading-6"
                  spellCheck={false}
                  style={{
                    tabSize: 2,
                    MozTabSize: 2
                  }}
                />
                
                {/* Glowing Cursor Indicator */}
                <motion.div
                  ref={cursorRef}
                  className="absolute w-0.5 bg-green-400 pointer-events-none"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scaleY: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Resizer */}
        <motion.div 
          className="w-1 bg-border cursor-col-resize hover:bg-green-500/50 transition-colors"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'col-resize' : 'default' }}
          animate={{
            scaleX: isDragging ? 1.5 : 1
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Preview Panel */}
        <div style={{ width: `${(1 - splitRatio) * 100}%` }}>
          <motion.div 
            className="h-full backdrop-blur-sm bg-surface/70 overflow-y-auto"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8">
              <div className="prose prose-invert max-w-none github-readme-preview">
                <div 
                  ref={previewRef}
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              </div>
              
              <style jsx global>{`
                .github-readme-preview {
                  color: #e6edf3;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.6;
                }
                
                .github-readme-preview h1 {
                  color: #f0f6fc;
                  font-size: 2em;
                  font-weight: 600;
                  margin-bottom: 16px;
                  padding-bottom: 0.3em;
                  border-bottom: 1px solid #30363d;
                }
                
                .github-readme-preview h2 {
                  color: #f0f6fc;
                  font-size: 1.5em;
                  font-weight: 600;
                  margin-top: 24px;
                  margin-bottom: 16px;
                  padding-bottom: 0.3em;
                  border-bottom: 1px solid #30363d;
                }
                
                .github-readme-preview h3 {
                  color: #f0f6fc;
                  font-size: 1.25em;
                  font-weight: 600;
                  margin-top: 24px;
                  margin-bottom: 16px;
                }
                
                .github-readme-preview h4, .github-readme-preview h5, .github-readme-preview h6 {
                  color: #f0f6fc;
                  font-weight: 600;
                  margin-top: 24px;
                  margin-bottom: 16px;
                }
                
                .github-readme-preview p {
                  margin-bottom: 16px;
                  color: #e6edf3;
                }
                
                .github-readme-preview blockquote {
                  padding: 0 1em;
                  color: #8d96a0;
                  border-left: 0.25em solid #30363d;
                  margin: 0 0 16px 0;
                }
                
                .github-readme-preview ul, .github-readme-preview ol {
                  padding-left: 2em;
                  margin-bottom: 16px;
                }
                
                .github-readme-preview li {
                  margin-bottom: 0.25em;
                  color: #e6edf3;
                }
                
                .github-readme-preview code {
                  background-color: rgba(110, 118, 129, 0.4);
                  padding: 0.2em 0.4em;
                  border-radius: 6px;
                  font-size: 85%;
                  color: #f0f6fc;
                  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
                }
                
                .github-readme-preview pre {
                  background-color: #161b22;
                  padding: 16px;
                  border-radius: 6px;
                  overflow: auto;
                  margin-bottom: 16px;
                  border: 1px solid #30363d;
                }
                
                .github-readme-preview pre code {
                  background-color: transparent;
                  padding: 0;
                  border-radius: 0;
                  color: #f0f6fc;
                }
                
                .github-readme-preview table {
                  border-collapse: collapse;
                  margin-bottom: 16px;
                  width: 100%;
                }
                
                .github-readme-preview th, .github-readme-preview td {
                  padding: 6px 13px;
                  border: 1px solid #30363d;
                  text-align: left;
                }
                
                .github-readme-preview th {
                  background-color: #21262d;
                  font-weight: 600;
                  color: #f0f6fc;
                }
                
                .github-readme-preview td {
                  color: #e6edf3;
                }
                
                .github-readme-preview a {
                  color: #58a6ff;
                  text-decoration: none;
                }
                
                .github-readme-preview a:hover {
                  text-decoration: underline;
                }
                
                .github-readme-preview img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 6px;
                  margin: 8px 0;
                }
                
                .github-readme-preview hr {
                  border: none;
                  border-top: 1px solid #30363d;
                  margin: 24px 0;
                }
                
                .github-readme-preview strong {
                  color: #f0f6fc;
                  font-weight: 600;
                }
                
                .github-readme-preview em {
                  color: #e6edf3;
                  font-style: italic;
                }
              `}</style>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}