"use client"

import { useState, useEffect, Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Github, 
  Star, 
  GitBranch, 
  Clock, 
  ExternalLink, 
  Loader2, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Code,
  Eye,
  Lock,
  Unlock,
  RefreshCw,
  FileText,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface Repository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  private: boolean;
  forks_count?: number;
  watchers_count?: number;
  size?: number;
  default_branch?: string;
}

function RepositoriesContent() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'stars' | 'size'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRepositories();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortRepositories();
  }, [repositories, searchTerm, sortBy, sortOrder, filterLanguage, filterVisibility]);

  const fetchRepositories = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        showToast('Refreshing repositories...', 'info');
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await fetch('/api/repositories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const data = await response.json();
      const repos = data.repositories || [];
      setRepositories(repos);
      
      if (refresh) {
        showToast(`Refreshed ${repos.length} repositories successfully!`, 'success');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load repositories';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterAndSortRepositories = () => {
    let filtered = repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesLanguage = filterLanguage === 'all' || repo.language === filterLanguage;
      
      const matchesVisibility = filterVisibility === 'all' || 
                               (filterVisibility === 'private' && repo.private) ||
                               (filterVisibility === 'public' && !repo.private);
      
      return matchesSearch && matchesLanguage && matchesVisibility;
    });

    // Sort repositories
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'stars':
          comparison = a.stargazers_count - b.stargazers_count;
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredRepos(filtered);
  };

  const getUniqueLanguages = () => {
    const languages = repositories
      .map(repo => repo.language)
      .filter(Boolean)
      .filter((lang, index, arr) => arr.indexOf(lang) === index)
      .sort();
    return languages as string[];
  };

  const handleGenerateReadme = (repoUrl: string, repoName: string) => {
    setSelectedRepo(repoName);
    showToast(`Redirecting to generate README for ${repoName}...`, 'info');
    
    // Navigate to main page with repository pre-filled
    const encodedUrl = encodeURIComponent(repoUrl);
    router.push(`/?repo=${encodedUrl}&name=${encodeURIComponent(repoName)}`);
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
      Ruby: '#701516',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
    };
    return colors[language || ''] || '#6b7280';
  };

  const getRepositoryStats = () => {
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const languages = getUniqueLanguages();
    const privateCount = repositories.filter(repo => repo.private).length;
    
    return { totalStars, totalForks, languages: languages.length, privateCount };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-foreground relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 z-0 w-full h-full">
          <MinimalGridBackground />
        </div>
        <div className="fixed top-0 left-0 right-0 z-50">
          <GitHubOAuthNavbar />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400">Please sign in to view your repositories.</p>
        </div>
      </div>
    );
  }

  const stats = getRepositoryStats();

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent mb-4">
                My Repositories
              </h1>
              <p className="text-gray-400 text-lg">
                Browse, filter, and generate READMEs for your GitHub repositories
              </p>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <Github className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{repositories.length}</div>
                    <div className="text-sm text-gray-400">Repositories</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalStars}</div>
                    <div className="text-sm text-gray-400">Total Stars</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <Code className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.languages}</div>
                    <div className="text-sm text-gray-400">Languages</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.privateCount}</div>
                    <div className="text-sm text-gray-400">Private</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400/50"
                    />
                  </div>

                  {/* Language Filter */}
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-green-400/50"
                  >
                    <option value="all">All Languages</option>
                    {getUniqueLanguages().map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>

                  {/* Visibility Filter */}
                  <select
                    value={filterVisibility}
                    onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'public' | 'private')}
                    className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-green-400/50"
                  >
                    <option value="all">All Repositories</option>
                    <option value="public">Public Only</option>
                    <option value="private">Private Only</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  {/* Sort Controls */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'updated' | 'stars' | 'size')}
                    className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-green-400/50"
                  >
                    <option value="updated">Last Updated</option>
                    <option value="name">Name</option>
                    <option value="stars">Stars</option>
                    <option value="size">Size</option>
                  </select>

                  <Button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    variant="outline"
                    size="sm"
                    className="border-[rgba(255,255,255,0.1)] text-gray-300 hover:border-green-400/50"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => fetchRepositories(true)}
                    variant="outline"
                    size="sm"
                    disabled={isRefreshing}
                    className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>Showing {filteredRepos.length} of {repositories.length} repositories</span>
                {searchTerm && <span>• Filtered by: "{searchTerm}"</span>}
                {filterLanguage !== 'all' && <span>• Language: {filterLanguage}</span>}
                {filterVisibility !== 'all' && <span>• Visibility: {filterVisibility}</span>}
              </div>
            </motion.div>

            {/* Repository List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
              <div className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-green-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading your repositories...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <div className="text-red-400 mb-4">{error}</div>
                    <Button 
                      onClick={() => fetchRepositories()} 
                      variant="outline" 
                      className="border-green-500/50 text-green-400"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : filteredRepos.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No repositories found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <AnimatePresence>
                      {filteredRepos.map((repo, index) => (
                        <motion.div
                          key={repo.full_name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-xl hover:border-green-400/30 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="text-xl font-semibold text-white truncate">{repo.name}</h4>
                                {repo.private ? (
                                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                                    <Lock className="w-3 h-3" />
                                    Private
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                                    <Unlock className="w-3 h-3" />
                                    Public
                                  </span>
                                )}
                              </div>
                              
                              {repo.description && (
                                <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                                  {repo.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-6 text-sm text-gray-400">
                                {repo.language && (
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                                    />
                                    <span>{repo.language}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  <span>{repo.stargazers_count}</span>
                                </div>
                                
                                {repo.forks_count !== undefined && (
                                  <div className="flex items-center gap-1">
                                    <GitBranch className="w-4 h-4" />
                                    <span>{repo.forks_count}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Updated {formatDate(repo.updated_at)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 ml-6">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  showToast('Opening repository on GitHub...', 'info');
                                  window.open(repo.html_url, '_blank');
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity border-[rgba(255,255,255,0.2)] hover:border-blue-400/50 text-blue-400"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View on GitHub
                              </Button>
                              
                              <Button
                                size="sm"
                                onClick={() => handleGenerateReadme(repo.html_url, repo.name)}
                                disabled={selectedRepo === repo.name}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
                              >
                                {selectedRepo === repo.name ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Redirecting...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate README
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className={`
            flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-xl border
            ${toast.type === 'success' ? 'bg-green-400/20 border-green-400/50 text-green-400' : ''}
            ${toast.type === 'error' ? 'bg-red-400/20 border-red-400/50 text-red-400' : ''}
            ${toast.type === 'info' ? 'bg-blue-400/20 border-blue-400/50 text-blue-400' : ''}
          `}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'info' && <Info className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function RepositoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RepositoriesContent />
    </Suspense>
  )
}