"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Download, Copy, GitBranch, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

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
  const [content, setContent] = useState(initialContent);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  
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

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
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

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <motion.div 
        className="border-b border-border backdrop-blur-md bg-surface/80"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-sans leading-none">GitHub README Editor</h1>
            <div className="relative">
              <select 
                value={selectedTemplate.id}
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  if (template) handleTemplateChange(template);
                }}
                className="appearance-none bg-surface border border-border rounded-md px-3 py-1.5 text-sm font-sans cursor-pointer hover:bg-primary/10 transition-colors leading-none"
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
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2 h-8 text-sm bg-green-600 hover:bg-green-700 text-white group relative overflow-hidden"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <GitBranch className="h-3.5 w-3.5" />
              )}
              Export
              <motion.div 
                className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity"
                animate={isExporting ? { 
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360] 
                } : {}}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Split View */}
      <div ref={splitContainerRef} className="flex h-[calc(100vh-81px)]">
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
              <div className="prose prose-invert max-w-none">
                <div 
                  ref={previewRef}
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}