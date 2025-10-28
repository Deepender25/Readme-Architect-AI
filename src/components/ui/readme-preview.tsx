"use client"

import { useState, useEffect } from 'react'
import { MarkdownRenderer } from './markdown-renderer'
import { Button } from './button'
import { Copy, Download, ExternalLink, Loader2 } from 'lucide-react'

interface ReadmePreviewProps {
  githubUrl: string
  title: string
  className?: string
}

export function ReadmePreview({ githubUrl, title, className }: ReadmePreviewProps) {
  const [readmeContent, setReadmeContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Extract owner and repo from GitHub URL
        const urlParts = githubUrl.replace('https://github.com/', '').split('/')
        const owner = urlParts[0]
        const repo = urlParts[1]
        
        // Fetch README from GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw'
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch README')
        }
        
        const content = await response.text()
        setReadmeContent(content)
      } catch (err) {
        console.error('Error fetching README:', err)
        setError('Failed to load README content')
        // Fallback to sample content
        setReadmeContent(getSampleReadme())
      } finally {
        setLoading(false)
      }
    }

    fetchReadme()
  }, [githubUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([readmeContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}-README.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className={`glass-card bg-gray-900/50 p-6 rounded-xl border border-green-400/20 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-3 text-green-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading README...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`glass-card bg-gray-900/50 p-6 rounded-xl border border-red-400/20 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400 text-sm">Showing sample content instead</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`glass-card bg-gray-900/50 rounded-xl border border-green-400/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-400/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-sm font-medium text-green-400">README.md</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={handleCopy}
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={handleDownload}
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => window.open(githubUrl, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            GitHub
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
        <MarkdownRenderer content={readmeContent} />
      </div>
    </div>
  )
}

function getSampleReadme(): string {
  return `# Cursor Via Cam

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.x+-blue?style=for-the-badge&logo=python">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

## ⭐ Overview

**Cursor Via Cam** is a powerful, vision-based application designed to revolutionize how users interact with their computers, providing precise and ergonomic hands-free cursor control through camera tracking technology.

### The Problem
Traditional computer interaction often requires constant use of a mouse, leading to physical strain, repetitive stress injuries (RSI), and significant limitations for users with mobility challenges.

### The Solution
Cursor Via Cam addresses these challenges head-on by leveraging cutting-edge computer vision (OpenCV and MediaPipe) and advanced smoothing algorithms.

## ✨ Key Features

### ✨ **Advanced Real-Time Cursor Smoothing**
The core engine employs proprietary smoothing techniques to eliminate the jitter and noise inherent in webcam feeds.

### 🎯 **Target-Aware "Button Sticking" (Windows Only)**
When the cursor approaches a known clickable UI element, the system intelligently applies a temporary "sticking" force.

### 🚀 **Adaptive Speed and Acceleration**
The system intelligently analyzes the user's current movement velocity to dynamically adjust cursor acceleration.

## 🛠️ Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/Deepender25/CursorViaCam.git

# Navigate to the project directory
cd CursorViaCam

# Install dependencies
pip install -r requirements.txt
\`\`\`

## 🚀 Usage

\`\`\`python
python main.py
\`\`\`

## 📋 Requirements

- Python 3.x+
- OpenCV
- MediaPipe
- NumPy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenCV community for computer vision tools
- MediaPipe team for face detection capabilities
- All contributors and users who provide feedback`
}