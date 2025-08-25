'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [cookies, setCookies] = useState('');

  useEffect(() => {
    // Only access document on client side
    if (typeof window !== 'undefined') {
      setCookies(document.cookie.includes('github_user') ? 'present' : 'none');
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-[10000]">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>User: {user ? user.username : 'null'}</div>
        <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Cookies: {cookies}</div>
      </div>
      <div className="mt-2 space-y-1">
        <div className="space-x-2">
          <button 
            onClick={login}
            className="bg-green-600 px-2 py-1 rounded text-xs"
          >
            Auth Login
          </button>
          <button 
            onClick={logout}
            className="bg-red-600 px-2 py-1 rounded text-xs"
          >
            Logout
          </button>
        </div>
        <div className="space-x-2">
          <button 
            onClick={() => {
              console.log('Direct redirect test...');
              window.location.href = '/auth/github';
            }}
            className="bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Direct Test
          </button>
          <button 
            onClick={() => {
              console.log('Opening in new tab...');
              window.open('/auth/github', '_blank');
            }}
            className="bg-purple-600 px-2 py-1 rounded text-xs"
          >
            New Tab
          </button>
        </div>
      </div>
    </div>
  );
}