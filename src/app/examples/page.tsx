"use client"

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  Code,
  Star,
  GitBranch,
  Eye,
  Zap,
  Sparkles,
  ArrowRight,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReadmePreview } from '@/components/ui/readme-preview'
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
      features: ["Advanced Real-Time Smoothing", "Target-Aware Button Sticking", "Adaptive Speed Control", "Profile Management", "Visual Cursor Feedback"]
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

      <ContentSection background="none" padding="none" maxWidth="full">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            {examples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card p-8 group mx-auto"
              >
              <div className="mb-4 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                <p className="text-sm text-green-400 font-medium">
                  ✨ This is a real project! CursorViaCam's README was generated using ReadmeArchitect and is actively used in production.
                </p>
              </div>

              {/* Centered Project Information */}
              <div className="text-center max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${example.color} rounded-xl flex items-center justify-center`}>
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white">{example.title}</h3>
                    <p className="text-gray-400">{example.language}</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed text-lg max-w-3xl mx-auto">
                  {example.description}
                </p>

                <div className="flex items-center justify-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">{example.stars} stars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-semibold">{example.forks} forks</span>
                  </div>
                  <div className="text-green-400 font-semibold">
                    Generated in {example.generatedIn}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {example.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium border border-green-400/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button
                  className="glass-button border-none text-green-400 hover:bg-green-400/20"
                  onClick={() => window.open(example.githubUrl, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </div>

              {/* Centered README Preview */}
              <div className="w-full max-w-5xl mx-auto">
                <ReadmePreview
                  githubUrl={example.githubUrl}
                  title={example.title}
                  className="w-full"
                />
              </div>
              </motion.div>
            ))}
          </div>
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