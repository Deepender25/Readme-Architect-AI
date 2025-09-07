"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LayoutWrapper from '@/components/layout-wrapper';
import GitHubReadmeEditor from '@/components/github-readme-editor';
import PageHeader from '@/components/layout/page-header';
import ContentSection from '@/components/layout/content-section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [repoName, setRepoName] = useState('');

  useEffect(() => {
    // Get repository URL from query params
    const url = searchParams.get('repo');
    const name = searchParams.get('name');
    
    if (url) {
      setRepoUrl(decodeURIComponent(url));
      setRepoName(name ? decodeURIComponent(name) : '');
    } else {
      // If no repo URL, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  const handleBackToRepos = () => {
    router.push('/repositories');
  };

  const handleGenerationComplete = (readmeContent: string) => {
    // Auto-save to history is handled in the GitHubReadmeEditor component
    console.log('README generation completed and saved to history');
  };

  if (!repoUrl) {
    return (
      <LayoutWrapper>
        <ContentSection background="glass" className="text-center py-20">
          <Github className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">No Repository Selected</h2>
          <p className="text-gray-400 mb-8">Please select a repository to generate documentation for.</p>
          <Button 
            onClick={() => router.push('/')} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          >
            Go to Home
          </Button>
        </ContentSection>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper maxWidth="full" className="px-0">
      <PageHeader
        title="Generate Your README"
        description="Transform your repository into professional documentation with AI-powered generation."
        badge="README Generator"
        icon={Github}
      />

      <ContentSection background="gradient" className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Github className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {repoName || 'Repository'}
              </h2>
              <p className="text-gray-300 truncate text-lg">{repoUrl}</p>
              <div className="mt-2 text-sm text-green-400 font-medium">
                Ready for AI-powered documentation generation
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open(repoUrl, '_blank');
                }
              }}
              className="border-green-400/30 text-gray-300 hover:border-blue-400/50 hover:text-blue-400"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
            
            <Button
              variant="outline"
              onClick={handleBackToRepos}
              className="border-green-400/50 text-green-400 hover:bg-green-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Repository
            </Button>
          </div>
        </div>
      </ContentSection>

      <div className="px-4 sm:px-6 lg:px-8">
        <GitHubReadmeEditor
          initialRepoUrl={repoUrl}
          onGenerationComplete={handleGenerationComplete}
          autoSaveToHistory={true}
        />
      </div>
    </LayoutWrapper>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <LayoutWrapper>
        <ContentSection background="glass" className="text-center py-20">
          <div className="cube-loading-container">
            <div className="flex flex-col items-center">
              <div className="cube-loader-global">
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
                <div className="cube-global"></div>
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Loading Generator</h2>
                <p className="text-gray-400">Preparing your README generation experience...</p>
              </div>
            </div>
          </div>
        </ContentSection>
      </LayoutWrapper>
    }>
      <GenerateContent />
    </Suspense>
  );
}
