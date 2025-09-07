"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Github, 
  Trash2, 
  Eye, 
  Download, 
  Loader2, 
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  FileText,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  BarChart3,
  History,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import ProfessionalDropdown from '@/components/ui/professional-dropdown'
import withAuth from '@/components/withAuth'
import LayoutWrapper from '@/components/layout-wrapper'
import PageHeader from '@/components/layout/page-header'
import ContentSection from '@/components/layout/content-section'

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

function HistoryContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'name'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDemo, setFilterDemo] = useState<'all' | 'with' | 'without'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, sortBy, sortOrder, filterDemo]);

  const fetchHistory = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        showToast('Refreshing history...', 'info');
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const response = await fetch('/api/history');
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      const historyItems = data.history || [];
      setHistory(historyItems);
      
      if (refresh) {
        showToast(`Refreshed ${historyItems.length} history items successfully!`, 'success');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load history';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = history.filter(item => {
      const matchesSearch = 
        item.repository_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        item.repository_url.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDemo = 
        filterDemo === 'all' ||
        (filterDemo === 'with' && item.generation_params.include_demo) ||
        (filterDemo === 'without' && !item.generation_params.include_demo);
      
      return matchesSearch && matchesDemo;
    });

    // Sort history
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.project_name || a.repository_name).localeCompare(b.project_name || b.repository_name);
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredHistory(filtered);
  };

  const deleteHistoryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this README from your history?')) {
      return;
    }

    try {
      setDeletingId(id);
      showToast('Deleting history item...', 'info');
      
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }
      
      // Remove from local state
      setHistory(prev => prev.filter(item => item.id !== id));
      showToast('History item deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting history item:', err);
      showToast('Failed to delete history item. Please try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const downloadReadme = (item: HistoryItem) => {
    try {
      const blob = new Blob([item.readme_content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.project_name || item.repository_name}-README.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded README for ${item.project_name || item.repository_name}!`, 'success');
    } catch (error) {
      showToast('Failed to download README. Please try again.', 'error');
    }
  };

  const copyToClipboard = async (content: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showToast(`Copied README for ${itemName} to clipboard!`, 'success');
    } catch (error) {
      showToast('Failed to copy to clipboard. Please try again.', 'error');
    }
  };

  const viewReadme = (item: HistoryItem) => {
    router.push(`/history/${item.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHistoryStats = () => {
    const totalItems = history.length;
    const withDemo = history.filter(item => item.generation_params.include_demo).length;
    const uniqueRepos = new Set(history.map(item => item.repository_url)).size;
    const lastGenerated = history.length > 0 ? history[0]?.created_at : null;
    
    return { totalItems, withDemo, uniqueRepos, lastGenerated };
  };

  

  const stats = getHistoryStats();

  return (
    <LayoutWrapper>
      <PageHeader
        title="README History"
        description="View, manage, and download your previously generated READMEs"
        badge="Your Creations"
        icon={History}
      />

      <ContentSection background="none" padding="none" className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-400/20 rounded-xl group-hover:bg-blue-400/30 transition-colors">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.totalItems}</div>
                <div className="text-sm text-gray-400">Total READMEs</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-400/20 rounded-xl group-hover:bg-purple-400/30 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.withDemo}</div>
                <div className="text-sm text-gray-400">With Demos</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-400/20 rounded-xl group-hover:bg-green-400/30 transition-colors">
                <Github className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.uniqueRepos}</div>
                <div className="text-sm text-gray-400">Repositories</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-400/20 rounded-xl group-hover:bg-orange-400/30 transition-colors">
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {stats.lastGenerated ? formatDate(stats.lastGenerated).split(',')[0] : 'Never'}
                </div>
                <div className="text-sm text-gray-400">Last Generated</div>
              </div>
            </div>
          </motion.div>
        </div>
      </ContentSection>

      <ContentSection background="glass" className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                    />
                  </div>

                  {/* Demo Filter */}
                  <ProfessionalDropdown
                    options={[
                      { value: 'all', label: 'All READMEs', icon: <FileText className="w-4 h-4" /> },
                      { value: 'with', label: 'With Demo', icon: <BarChart3 className="w-4 h-4" /> },
                      { value: 'without', label: 'Without Demo', icon: <FileText className="w-4 h-4" /> }
                    ]}
                    value={filterDemo}
                    onChange={(value) => setFilterDemo(value as 'all' | 'with' | 'without')}
                    placeholder="Demo Filter"
                    className="min-w-[160px]"
                  />
                </div>

                <div className="flex gap-2">
                  {/* Sort Controls */}
                  <ProfessionalDropdown
                    options={[
                      { value: 'created', label: 'Date Created', icon: <Calendar className="w-4 h-4" /> },
                      { value: 'updated', label: 'Last Updated', icon: <Clock className="w-4 h-4" /> },
                      { value: 'name', label: 'Name', icon: <FileText className="w-4 h-4" /> }
                    ]}
                    value={sortBy}
                    onChange={(value) => setSortBy(value as 'created' | 'updated' | 'name')}
                    placeholder="Sort By"
                    className="min-w-[140px]"
                  />

                  <Button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    variant="outline"
                    size="sm"
                    className="glass-button border-none text-gray-300 hover:text-green-400"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => fetchHistory(true)}
                    variant="outline"
                    size="sm"
                    disabled={isRefreshing}
                    className="glass-button border-none text-green-400 hover:bg-green-400/20"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>Showing {filteredHistory.length} of {history.length} items</span>
                {searchTerm && <span>• Filtered by: "{searchTerm}"</span>}
                {filterDemo !== 'all' && <span>• Demo: {filterDemo}</span>}
              </div>
      </ContentSection>

      <ContentSection background="gradient" className="min-h-0">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-green" style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'scroll-position'
        }}>
          {isLoading ? (
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
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <div className="text-red-400 mb-4">{error}</div>
              <Button 
                onClick={() => fetchHistory()} 
                variant="outline" 
                className="glass-button border-none text-green-400"
              >
                Try Again
              </Button>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No README history found</p>
              <p className="text-sm">
                {history.length === 0 
                  ? "Generate your first README to see it here!" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 pb-6">
              <AnimatePresence>
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.3 }}
                    className="glass-card p-8 group"
                    style={{
                      transform: 'translate3d(0, 0, 0)',
                      willChange: 'transform',
                      isolation: 'isolate'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <Github className="w-5 h-5 text-green-400" />
                          <h4 className="text-xl font-semibold text-white truncate">
                            {item.project_name || item.repository_name}
                          </h4>
                          {item.generation_params.include_demo && (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                              <BarChart3 className="w-3 h-3" />
                              Demo Included
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 mb-4 truncate">
                          {item.repository_url}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created {formatDate(item.created_at)}</span>
                          </div>
                          
                          {item.updated_at !== item.created_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Updated {formatDate(item.updated_at)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{Math.round(item.readme_content.length / 1000)}k chars</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 ml-4 md:ml-6 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(item.readme_content, item.project_name || item.repository_name)}
                          className="glass-button border-none text-blue-400 hover:bg-blue-400/20 p-2 sm:px-3 sm:py-2"
                        >
                          <Copy className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Copy</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadReadme(item)}
                          className="glass-button border-none text-green-400 hover:bg-green-400/20 p-2 sm:px-3 sm:py-2"
                        >
                          <Download className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewReadme(item)}
                          className="glass-button border-none text-purple-400 hover:bg-purple-400/20 p-2 sm:px-3 sm:py-2"
                        >
                          <Eye className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteHistoryItem(item.id)}
                          disabled={deletingId === item.id}
                          className="glass-button border-none text-red-400 hover:bg-red-400/20 p-2 sm:px-3 sm:py-2"
                        >
                          {deletingId === item.id ? (
                            <div className="cube-loader-global cube-loader-inline">
                              <div className="cube-global"></div>
                              <div className="cube-global"></div>
                              <div className="cube-global"></div>
                              <div className="cube-global"></div>
                            </div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
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
      </ContentSection>


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
    </LayoutWrapper>
  )
}

const HistoryPage = withAuth(HistoryContent);

export default function HistoryPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryPage key="history-page-single" />
    </Suspense>
  );
}