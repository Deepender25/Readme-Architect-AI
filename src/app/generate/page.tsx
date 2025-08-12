"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LayoutWrapper from '@/components/layout-wrapper';
import GitHubReadmeEditor from '@/components/github-readme-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No repository selected</p>
            <Button onClick={() => router.push('/')} variant="outline">
              Go to Home
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        {/* Repository Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/50 border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Github className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {repoName || 'Repository'}
                </h2>
                <p className="text-muted-foreground">{repoUrl}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(repoUrl, '_blank')}
                className="border-border hover:border-green-500/50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToRepos}
                className="border-border hover:border-green-500/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Repository
              </Button>
            </div>
          </div>
        </motion.div>

        {/* README Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GitHubReadmeEditor
            initialRepoUrl={repoUrl}
            onGenerationComplete={handleGenerationComplete}
            autoSaveToHistory={true}
          />
        </motion.div>
      </div>
    </LayoutWrapper>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateContent />
    </Suspense>
  );
}