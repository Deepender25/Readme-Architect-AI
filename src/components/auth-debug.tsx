'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading, currentSession } = useAuth();
  const [cookies, setCookies] = useState<string>('');
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [urlParams, setUrlParams] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCookies(document.cookie);
      setUrlParams(window.location.search);
      
      // Check for auth_success parameter
      const urlSearchParams = new URLSearchParams(window.location.search);
      const authSuccessParam = urlSearchParams.get('auth_success');
      setAuthSuccess(authSuccessParam || 'None');
      
      // Get session info from localStorage
      try {
        const sessions = localStorage.getItem('active_sessions');
        setSessionInfo(sessions ? JSON.parse(sessions) : null);
      } catch (error) {
        console.error('Failed to get session info:', error);
      }
    }
  }, [user, isAuthenticated]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-[10000] border border-green-400/30">
      <h3 className="font-bold text-green-400 mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? user.username : 'None'}</div>
        <div><strong>Session ID:</strong> {currentSession?.sessionId || 'None'}</div>
        <div><strong>URL Params:</strong> {urlParams || 'None'}</div>
        <div><strong>Auth Success:</strong> {authSuccess.substring(0, 20)}...</div>
        <div><strong>Cookies:</strong> {cookies.substring(0, 50)}...</div>
        <div><strong>Active Sessions:</strong> {sessionInfo ? sessionInfo.length : 0}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-2 py-1 bg-green-600 rounded text-xs"
        >
          Refresh
        </button>
        <button 
          onClick={() => {
            console.log('=== AUTH DEBUG INFO ===');
            console.log('URL:', window.location.href);
            console.log('Cookies:', document.cookie);
            console.log('LocalStorage sessions:', localStorage.getItem('active_sessions'));
            console.log('User:', user);
            console.log('Session:', currentSession);
          }} 
          className="mt-1 px-2 py-1 bg-blue-600 rounded text-xs"
        >
          Log Details
        </button>
      </div>
    </div>
  );
}