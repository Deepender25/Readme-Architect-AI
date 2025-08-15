"use client"

import { useState, useEffect, Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import ProfessionalBackground from '@/components/professional-background'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Github, 
  Trash2, 
  Eye, 
  Download, 
  Loader2, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  FileText,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  Edit,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import SimpleDropdown from '@/components/ui/simple-dropdown'
import ModernReadmeEditor from '@/components/modern-readme-editor'
import withAuth from '@/components/withAuth'

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
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);
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
    setSelectedItem(item);
    setShowEditor(true);
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
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <ProfessionalBackground />
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
                README History
              </h1>
              <p className="text-gray-400 text-lg">
                View, manage, and download your previously generated READMEs
              </p>
            </motion.div>

            {/* Statistics Cards - Single Instance */}
            <motion.div
              key="history-stats-unique"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              data-testid="history-stats-dashboard"
            >
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalItems}</div>
                    <div className="text-sm text-gray-400">Total READMEs</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.withDemo}</div>
                    <div className="text-sm text-gray-400">With Demos</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <Github className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.uniqueRepos}</div>
                    <div className="text-sm text-gray-400">Repositories</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-lg font-bold text-white">
                      {stats.lastGenerated ? formatDate(stats.lastGenerated).split(',')[0] : 'Never'}
                    </div>
                    <div className="text-sm text-gray-400">Last Generated</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 mb-8"
            >
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
                      className="w-full pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400/50"
                    />
                  </div>

                  {/* Demo Filter */}
                  <SimpleDropdown
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
                  <SimpleDropdown
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
                    className="border-[rgba(255,255,255,0.1)] text-gray-300 hover:border-green-400/50"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => fetchHistory(true)}
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
                <span>Showing {filteredHistory.length} of {history.length} items</span>
                {searchTerm && <span>• Filtered by: "{searchTerm}"</span>}
                {filterDemo !== 'all' && <span>• Demo: {filterDemo}</span>}
              </div>
            </motion.div>

            {/* History List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-20" />
              <div className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-green-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading your history...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <div className="text-red-400 mb-4">{error}</div>
                    <Button 
                      onClick={() => fetchHistory()} 
                      variant="outline" 
                      className="border-green-500/50 text-green-400"
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
                  <div className="grid gap-4">
                    <AnimatePresence>
                      {filteredHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.3 }}
                          className="group relative p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-xl hover:border-green-400/30 transition-all duration-200"
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
                            
                            <div className="flex items-center gap-2 ml-6">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(item.readme_content, item.project_name || item.repository_name)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity border-[rgba(255,255,255,0.2)] hover:border-blue-400/50 text-blue-400"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadReadme(item)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity border-[rgba(255,255,255,0.2)] hover:border-green-400/50 text-green-400"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewReadme(item)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity border-[rgba(255,255,255,0.2)] hover:border-purple-400/50 text-purple-400"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteHistoryItem(item.id)}
                                disabled={deletingId === item.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity border-red-400/50 text-red-400 hover:bg-red-400/10"
                              >
                                {deletingId === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
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
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* README Editor Modal */}
      {showEditor && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black">
          <ModernReadmeEditor 
            content={selectedItem.readme_content}
            onClose={() => {
              setShowEditor(false);
              setSelectedItem(null);
            }}
          />
        </div>
      )}

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

const HistoryPage = withAuth(HistoryContent);

export default function HistoryPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryPage key="history-page-single" />
    </Suspense>
  );
}