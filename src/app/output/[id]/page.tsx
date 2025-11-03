"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, AlertCircle, Loader2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernReadmeOutput from '@/components/modern-readme-output';
import { authenticatedFetch, useAuth } from '@/lib/auth-client';
import LayoutWrapper from '@/components/layout-wrapper';

interface HistoryItem {
  id: string;
  repository_name: string;
  repository_url: string;
  project_name: string | null;
  created_at: string;
  updated_at: string;
  readme_content: string;
  generation_params: {
    include_demo: boolean;
    num_screenshots: number;
    num_videos: number;
  };
}

export default function OutputPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const historyId = params?.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (historyId) {
      fetchHistoryItem(historyId);
    }
  }, [historyId, isAuthenticated, router]);

  const fetchHistoryItem = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authenticatedFetch(`/api/history/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('README not found or you don\'t have access to it.');
        } else {
          setError('Failed to load README. Please try again.');
        }
        return;
      }
      
      const data = await response.json();
      setHistoryItem(data.item);
    } catch (err) {
      setError('Failed to load README. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/history');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleCopy = async () => {
    if (!historyItem) return;
    try {
      await navigator.clipboard.writeText(historyItem.readme_content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!historyItem) return;
    setIsDownloading(true);
    
    setTimeout(() => {
      const blob = new Blob([historyItem.readme_content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      a.click();
      URL.revokeObjectURL(url);
      
      setIsDownloading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <LayoutWrapper showNavbar={false} showBreadcrumbs={false} maxWidth="full" className="px-0">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative">
              <div className="cube-loading-container">
                <div className="flex flex-col items-center">
                  <div className="cube-loader-global">
                    <div className="cube-global"></div>
                    <div className="cube-global"></div>
                    <div className="cube-global"></div>
                    <div className="cube-global"></div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading README</h2>
            <p className="text-gray-400">Retrieving your generated documentation...</p>
          </motion.div>
        </div>
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper showNavbar={false} showBreadcrumbs={false} maxWidth="full" className="px-0">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-full blur-lg" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => fetchHistoryItem(historyId)}
                className="bg-green-500 text-black hover:bg-green-400 font-medium"
              >
                Try Again
              </Button>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-green-400/20 text-green-400 hover:bg-green-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
            </div>
          </motion.div>
        </div>
      </LayoutWrapper>
    );
  }

  if (!historyItem) {
    return (
      <LayoutWrapper showNavbar={false} showBreadcrumbs={false} maxWidth="full" className="px-0">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <h2 className="text-xl font-semibold text-white mb-2">README Not Found</h2>
            <p className="text-gray-400 mb-6">The requested README could not be found or you don't have access to it.</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleGoHome}
                className="bg-green-500 text-black hover:bg-green-400 font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-green-400/20 text-green-400 hover:bg-green-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
            </div>
          </motion.div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper showNavbar={false} showBreadcrumbs={false} maxWidth="full" className="px-0">
      {/* Navigation Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-green-400/20"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="sm"
                className="border-green-400/20 text-green-400 hover:bg-green-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
              <div className="text-sm text-gray-400">
                <span className="text-green-400 font-medium">
                  {historyItem.project_name || historyItem.repository_name}
                </span>
                <span className="mx-2">•</span>
                <span>Generated README</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className={`${
                  copySuccess 
                    ? 'border-green-400/60 text-green-400' 
                    : 'border-green-400/20 text-green-400 hover:bg-green-400/10'
                }`}
              >
                {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copySuccess ? 'Copied!' : 'Copy'}
              </Button>
              
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="outline"
                size="sm"
                className="border-green-400/20 text-green-400 hover:bg-green-400/10 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                size="sm"
                className="border-gray-400/20 text-gray-400 hover:bg-gray-400/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* README Output */}
      <div className="relative">
        <ModernReadmeOutput
          content={historyItem.readme_content}
          repositoryUrl={historyItem.repository_url}
          projectName={historyItem.project_name || historyItem.repository_name}
          generationParams={historyItem.generation_params}
          disableAutoSave={true}
          historyView={true}
          createdAt={historyItem.created_at}
          updatedAt={historyItem.updated_at}
        />
      </div>
    </LayoutWrapper>
  );
}
