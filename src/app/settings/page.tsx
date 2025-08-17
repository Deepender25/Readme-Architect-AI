"use client"

import { Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  LogOut,
  Download,
  Trash2,
  Github,
  Settings as SettingsIcon,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Shield,
  Database,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import LayoutWrapper from '@/components/layout-wrapper'
import PageHeader from '@/components/layout/page-header'
import ContentSection from '@/components/layout/content-section'
import withAuth from '@/components/withAuth'

function SettingsContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [stats, setStats] = useState({ historyCount: 0, reposCount: 0, lastActivity: null });

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch user statistics
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStats();
    }
  }, [isAuthenticated]);

  const fetchUserStats = async () => {
    try {
      const [historyRes, reposRes] = await Promise.all([
        fetch('/api/history'),
        fetch('/api/repositories')
      ]);

      if (historyRes.ok && reposRes.ok) {
        const historyData = await historyRes.json();
        const reposData = await reposRes.json();
        
        setStats({
          historyCount: historyData.history?.length || 0,
          reposCount: reposData.repositories?.length || 0,
          lastActivity: historyData.history?.[0]?.created_at || null
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleDownloadData = async () => {
    try {
      setIsLoading(true);
      showToast('Preparing your data for download...', 'info');
      
      const [historyRes, reposRes] = await Promise.all([
        fetch('/api/history'),
        fetch('/api/repositories')
      ]);

      if (historyRes.ok && reposRes.ok) {
        const historyData = await historyRes.json();
        const reposData = await reposRes.json();
        
        const exportData = {
          user: {
            github_id: user?.github_id,
            username: user?.username,
            name: user?.name,
            avatar_url: user?.avatar_url
          },
          history: historyData.history || [],
          repositories: reposData.repositories || [],
          exported_at: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `autodoc-ai-data-${user?.username}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Your data has been downloaded successfully!', 'success');
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      showToast('Failed to download data. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveData = async () => {
    if (!confirm('Are you sure you want to permanently delete all your data? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      showToast('Removing all your data...', 'info');
      
      const response = await fetch('/api/history', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        showToast('All your data has been permanently removed.', 'success');
        // Update stats
        setStats(prev => ({ ...prev, historyCount: 0, lastActivity: null }));
        // Refresh after a delay
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 2000);
      } else {
        throw new Error('Failed to remove data');
      }
    } catch (error) {
      console.error('Error removing data:', error);
      showToast('Failed to remove data. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisitGitHub = () => {
    if (user?.html_url) {
      showToast('Opening your GitHub profile...', 'info');
      if (typeof window !== 'undefined') {
        window.open(user.html_url, '_blank', 'noopener,noreferrer');
      }
    } else {
      showToast('GitHub profile URL not available.', 'error');
    }
  };

  const handleLogout = () => {
    showToast('Signing you out...', 'info');
    setTimeout(() => {
      logout();
    }, 1000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (!isAuthenticated) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
            <p className="text-gray-400">Please sign in to access your settings.</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper maxWidth="4xl">
      <PageHeader
        title="Settings"
        description="Customize your AutoDoc AI experience"
        badge="Your Account"
        icon={SettingsIcon}
      />

      <div className="space-y-8">
        {/* Profile Section */}
        <ContentSection background="gradient">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar_url}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-2 border-green-400/50 shadow-lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{user?.name || 'No name set'}</h3>
                <p className="text-gray-400 flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  @{user?.username}
                </p>
                <p className="text-sm text-gray-500 mt-1">GitHub ID: {user?.github_id}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">README Generations:</span>
                <span className="text-white font-semibold">{stats.historyCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">Connected Repositories:</span>
                <span className="text-white font-semibold">{stats.reposCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300">Last Activity:</span>
                <span className="text-white font-semibold">{formatDate(stats.lastActivity)}</span>
              </div>
            </div>
          </div>
        </ContentSection>

        {/* Quick Actions */}
        <ContentSection background="glass">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleVisitGitHub}
              variant="outline"
              disabled={isLoading}
              className="glass-button border-none text-green-400 hover:bg-green-400/20 h-12 justify-start"
            >
              <Github className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Visit GitHub Profile</div>
                <div className="text-xs opacity-70">Open your GitHub profile</div>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </Button>

            <Button
              onClick={handleDownloadData}
              variant="outline"
              disabled={isLoading}
              className="glass-button border-none text-blue-400 hover:bg-blue-400/20 h-12 justify-start"
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Download My Data</div>
                <div className="text-xs opacity-70">Export all your data as JSON</div>
              </div>
            </Button>
          </div>
        </ContentSection>

        {/* Danger Zone */}
        <ContentSection background="glass" className="border-red-400/20">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
          </div>
          
          <div className="space-y-4">
            <div className="glass-card bg-red-400/10 border-red-400/20 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">Permanent Data Removal</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    This will permanently delete all your README generation history ({stats.historyCount} items). 
                    This action cannot be undone.
                  </p>
                  <Button
                    onClick={handleRemoveData}
                    variant="outline"
                    disabled={isLoading || stats.historyCount === 0}
                    className="glass-button border-none text-red-400 hover:bg-red-400/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {stats.historyCount === 0 ? 'No Data to Remove' : 'Remove All Data'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass-card bg-orange-400/10 border-orange-400/20 p-6">
              <div className="flex items-start gap-3">
                <LogOut className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <h3 className="text-orange-400 font-semibold mb-1">Sign Out</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Sign out of your account. You can sign back in anytime with GitHub.
                  </p>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    disabled={isLoading}
                    className="glass-button border-none text-orange-400 hover:bg-orange-400/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>
      </div>

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
  );
}

const SettingsPage = withAuth(SettingsContent);

export default function SettingsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}