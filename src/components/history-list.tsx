"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Github, Trash2, Eye, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authenticatedFetch } from '@/lib/auth-client';

interface HistoryItem {
  id: string;
  repository_name: string;
  repository_url: string;
  project_name: string | null;
  created_at: string;
  readme_content: string;
  generation_params: {
    include_demo: boolean;
    num_screenshots: number;
    num_videos: number;
  };
}

interface HistoryListProps {
  onSelectHistory: (item: HistoryItem) => void;
}

export default function HistoryList({ onSelectHistory }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);


  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async (forceReauth = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await retryWithAuth(async () => {
        const response = await authenticatedFetch('/api/history');
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Authentication required');
          }
          throw new Error('Failed to fetch history');
        }
        
        const data = await response.json();
        setHistory(data.history || []);
      }, { 
        maxRetries: 2, 
        retryDelay: 1000,
        forceReauth 
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      setDeletingId(id);
      
      const response = await authenticatedFetch(`/api/history/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }
      
      // Remove from local state
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const downloadReadme = (item: HistoryItem) => {
    const blob = new Blob([item.readme_content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.project_name || item.repository_name}-README.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="cube-loading-container">
          <div className="flex flex-col items-center">
            <div className="cube-loader-global">
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
            </div>
            <div className="mt-4 text-center text-green-400 text-sm font-medium">
              Loading your history...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <div className="flex flex-col gap-2 items-center">
          <Button onClick={() => fetchHistory(false)} variant="outline" className="border-green-500/50 text-green-400">
            Try Again
          </Button>
          <Button onClick={() => fetchHistory(true)} variant="outline" className="border-blue-500/50 text-blue-400">
            Re-authenticate & Try Again
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          If you're logged in on multiple devices, try re-authenticating.
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No README generation history found</p>
        <p className="text-sm mt-2">Generate your first README to see it here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-400">Generation History</h3>
        <span className="text-sm text-muted-foreground">{history.length} items</span>
      </div>
      
      <div className="grid gap-4 max-h-96 overflow-y-auto scroll-container scrollbar-thin scrollbar-green smooth-scroll content-scroll hardware-accelerated">
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className="group relative p-4 bg-surface/50 border border-border rounded-lg hover:border-green-500/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Github className="w-4 h-4 text-green-400" />
                    <h4 className="font-medium text-foreground truncate">
                      {item.project_name || item.repository_name}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 truncate">
                    {item.repository_url}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    
                    {item.generation_params.include_demo && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                        With Demo
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadReadme(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity border-border hover:border-green-500/50"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectHistory(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity border-border hover:border-green-500/50"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteHistoryItem(item.id)}
                    disabled={deletingId === item.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    {deletingId === item.id ? (
                      <div className="cube-loader-global cube-loader-inline">
                        <div className="cube-global"></div>
                        <div className="cube-global"></div>
                        <div className="cube-global"></div>
                        <div className="cube-global"></div>
                      </div>
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}