"use client"

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernReadmeOutput from '@/components/modern-readme-output';
import { authenticatedFetch, useAuth } from '@/lib/auth';
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

  if (isLoading) {
    return (
      <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full blur-lg" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-black animate-spin" />
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
      <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
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
      <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
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
    <LayoutWrapper showBreadcrumbs={false} maxWidth="full" className="px-0">
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
      </motion.div>

      {/* README Output */}
      <div className="relative">
        <ModernReadmeOutput
          content={historyItem.readme_content}
          repositoryUrl={historyItem.repository_url}
          projectName={historyItem.project_name || historyItem.repository_name}
          generationParams={historyItem.generation_params}
          disableAutoSave={true}
        />
      </div>
    </LayoutWrapper>
  );
}
