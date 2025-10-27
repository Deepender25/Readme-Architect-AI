"use client"

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  FileText, 
  Star, 
  GitBranch, 
  Eye, 
  Download,
  Zap,
  Sparkles,
  ArrowRight,
  Copy,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import LayoutWrapper from '@/components/layout-wrapper'
import PageHeader from '@/components/layout/page-header'
import ContentSection from '@/components/layout/content-section'

function ExamplesContent() {
  const examples = [
    {
      title: "CursorViaCam",
      description: "AI-powered head tracking mouse control system for hands-free computer interaction — designed to assist users with motor impairments.",
      language: "Python",
      stars: "1",
      forks: "0",
      color: "from-green-400 to-green-600",
      repo: "CursorViaCam",
      author: "Deepender25",
      company: "Open Source",
      generatedIn: "32s",
      githubUrl: "https://github.com/Deepender25/CursorViaCam",
      features: ["Advanced Real-Time Smoothing", "Target-Aware Button Sticking", "Adaptive Speed Control", "Profile Management", "Visual Cursor Feedback"],
      preview: `<h1 align="center"> Cursor Via Cam </h1>
<p align="center"> Control Your Digital World Hands-Free with Vision-Based Cursor Tracking. </p>

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

#### ✨ **Advanced Real-Time Cursor Smoothing**
The core engine employs proprietary smoothing techniques to eliminate the jitter and noise inherent in webcam feeds.

#### 🎯 **Target-Aware "Button Sticking" (Windows Only)**
When the cursor approaches a known clickable UI element, the system intelligently applies a temporary "sticking" force.

#### 🚀 **Adaptive Speed and Acceleration**
The system intelligently analyzes the user's current movement velocity to dynamically adjust cursor acceleration.`
    }
  ];

  return (
    <LayoutWrapper>
      <PageHeader
        title="Real Project Showcase"
        description="See how ReadmeArchitect transformed a real open-source project. This README was generated for CursorViaCam, an AI-powered accessibility tool, showcasing the quality and professionalism our AI can achieve."
        badge="Generated with ReadmeArchitect"
        icon={Sparkles}
      />

      <ContentSection background="none" padding="none">
        <div className="grid gap-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 group"
            >
              <div className="mb-4 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                <p className="text-sm text-green-400 font-medium">
                  ✨ This is a real project! CursorViaCam's README was generated using ReadmeArchitect and is actively used in production.
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${example.color} rounded-xl flex items-center justify-center`}>
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{example.title}</h3>
                      <p className="text-sm text-gray-400">{example.language}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {example.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">{example.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-semibold">{example.forks}</span>
                      </div>
                      <div className="text-green-400 font-semibold">
                        Generated in {example.generatedIn}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {example.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium border border-green-400/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="glass-button border-none text-green-400 hover:bg-green-400/20"
                        onClick={() => window.open(example.githubUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View on GitHub
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass-button border-none text-blue-400 hover:bg-blue-400/20"
                        onClick={() => {
                          navigator.clipboard.writeText(example.preview);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy README
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <div className="glass-card bg-gray-900/50 p-6 rounded-xl border border-green-400/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">README.md</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-gray-300 whitespace-pre-wrap">
                        {example.preview}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ContentSection>

      <ContentSection background="gradient" className="text-center">
        <div className="relative">
          <Heart className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Create Professional READMEs Like This
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The CursorViaCam README above was generated in just 32 seconds. Transform your project documentation with the same AI-powered quality and professionalism.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Creating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => window.location.href = '/features'}
              variant="outline"
              className="border-green-400/50 text-green-400 hover:bg-green-400/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:border-green-400"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              View Features
            </Button>
          </div>
        </div>
      </ContentSection>
    </LayoutWrapper>
  );
}

export default function ExamplesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamplesContent />
    </Suspense>
  );
}