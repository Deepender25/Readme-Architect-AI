"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Star, GitBranch, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authenticatedFetch } from '@/lib/auth-client';

interface Repository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  private: boolean;
}

interface RepositoriesListProps {
  onSelectRepository: (repoUrl: string, repoName: string) => void;
}

export default function RepositoriesList({ onSelectRepository }: RepositoriesListProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authenticatedFetch('/api/repositories');
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch repositories');
      }
      
      const data = await response.json();
      setRepositories(data.repositories || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load repositories');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
    };
    return colors[language || ''] || '#6b7280';
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
              Loading your repositories...
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
        <div className="flex justify-center">
          <Button onClick={() => fetchRepositories()} variant="outline" className="border-green-500/50 text-green-400">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No repositories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-400">Your Repositories</h3>
        <span className="text-sm text-muted-foreground">{repositories.length} repositories</span>
      </div>
      
      <div className="grid gap-4 max-h-96 overflow-y-auto scroll-container scrollbar-thin scrollbar-green smooth-scroll content-scroll hardware-accelerated">
        <AnimatePresence>
          {repositories.map((repo, index) => (
            <motion.div
              key={repo.full_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative p-4 bg-surface/50 border border-border rounded-lg hover:border-green-500/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground truncate">{repo.name}</h4>
                    {repo.private && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  
                  {repo.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(repo.html_url, '_blank')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity border-border hover:border-green-500/50"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => onSelectRepository(repo.html_url, repo.name)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Generate README
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