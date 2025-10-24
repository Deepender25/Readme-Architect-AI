'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  X, 
  Shield, 
  Clock,
  MapPin,
  Chrome,
  Firefox,
  Safari,
  Globe,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface SessionInfo {
  session_id: string;
  device_info: {
    type: string;
    browser: string;
    user_agent: string;
  };
  ip_address: string;
  created_at: string;
  last_used: string;
  expires_at: string;
}

interface SessionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function SessionManager({ isOpen, onClose, userName }: SessionManagerProps) {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions');
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
        console.error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      setRevoking(sessionId);
      const response = await fetch('/api/sessions/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      if (response.ok) {
        // Remove the session from the list
        setSessions(sessions.filter(session => session.session_id !== sessionId));
      } else {
        console.error('Failed to revoke session');
      }
    } catch (error) {
      console.error('Error revoking session:', error);
    } finally {
      setRevoking(null);
    }
  };

  const revokeAllOtherSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions', {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh the sessions list
        await fetchSessions();
      } else {
        console.error('Failed to revoke all sessions');
      }
    } catch (error) {
      console.error('Error revoking all sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome':
        return <Chrome className="w-4 h-4" />;
      case 'firefox':
        return <Firefox className="w-4 h-4" />;
      case 'safari':
        return <Safari className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    return deviceType.toLowerCase() === 'mobile' ? 
      <Smartphone className="w-4 h-4" /> : 
      <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Manage your active sessions{userName ? ` for ${userName}` : ''}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="ml-2 text-gray-300">Loading sessions...</span>
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="w-12 h-12 text-gray-500 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">No Active Sessions</h4>
                  <p className="text-gray-500">You don't have any active sessions.</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.session_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Device and Browser Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2 text-blue-400">
                              {getDeviceIcon(session.device_info.type)}
                              <span className="font-medium">{session.device_info.type}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                              {getBrowserIcon(session.device_info.browser)}
                              <span className="text-sm">{session.device_info.browser}</span>
                            </div>
                          </div>

                          {/* Session Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>IP: {session.ip_address}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>Last used: {formatDate(session.last_used)}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400">
                              <span>Session ID: {session.session_id}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400">
                              <span>Created: {formatDate(session.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Revoke Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => revokeSession(session.session_id)}
                          disabled={revoking === session.session_id}
                          className="ml-4 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {revoking === session.session_id ? 'Revoking...' : 'Revoke'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 pt-4 border-t border-gray-700 bg-gray-800/30">
              {/* Warning */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-300 mb-1">Security Note</h4>
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                      If you see any sessions you don't recognize, revoke them immediately. Each session allows full access to your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Close
                </motion.button>
                
                {sessions.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={revokeAllOtherSessions}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Shield className="w-4 h-4" />
                    {loading ? 'Revoking...' : 'Revoke All Others'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}