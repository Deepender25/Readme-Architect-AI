'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-client';

export default function DebugSession() {
  const { user, isAuthenticated, isLoading, previousAccount } = useAuth();
  const [cookies, setCookies] = useState<string[]>([]);
  const [localStorage, setLocalStorage] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get all cookies
      const cookieList = document.cookie.split(';').map(cookie => cookie.trim()).filter(c => c);
      setCookies(cookieList);

      // Get relevant localStorage items
      const storageItems: string[] = [];
      try {
        const keys = ['previous_github_account', 'active_sessions', 'show_account_selection'];
        keys.forEach(key => {
          const value = window.localStorage.getItem(key);
          if (value) {
            storageItems.push(`${key}: ${value.substring(0, 50)}...`);
          }
        });
      } catch (error) {
        storageItems.push('Error accessing localStorage');
      }
      setLocalStorage(storageItems);
    }
  }, [user]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-[10000] font-mono">
      <h3 className="font-bold mb-2 text-green-400">🐛 Auth Debug</h3>
      
      <div className="space-y-2">
        <div className="border-b border-gray-600 pb-2">
          <div><strong>User:</strong> {user?.username || 'null'}</div>
          <div><strong>Name:</strong> {user?.name || 'null'}</div>
          <div><strong>ID:</strong> {user?.github_id || 'null'}</div>
          <div><strong>Authenticated:</strong> <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{isAuthenticated ? 'true' : 'false'}</span></div>
          <div><strong>Loading:</strong> <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>{isLoading ? 'true' : 'false'}</span></div>
        </div>

        {previousAccount && (
          <div className="border-b border-gray-600 pb-2">
            <div><strong>Previous:</strong></div>
            <div className="ml-2">
              <div>User: {previousAccount.username || 'empty'}</div>
              <div>Name: {previousAccount.name || 'empty'}</div>
            </div>
          </div>
        )}

        <div className="border-b border-gray-600 pb-2">
          <div><strong>Cookies ({cookies.length}):</strong></div>
          <div className="ml-2 max-h-20 overflow-y-auto">
            {cookies.length > 0 ? cookies.map((cookie, i) => (
              <div key={i} className="text-xs break-all">
                {cookie.substring(0, 40)}...
              </div>
            )) : <div className="text-gray-500">None</div>}
          </div>
        </div>

        <div>
          <div><strong>LocalStorage:</strong></div>
          <div className="ml-2">
            {localStorage.length > 0 ? localStorage.map((item, i) => (
              <div key={i} className="text-xs break-all">
                {item}
              </div>
            )) : <div className="text-gray-500">None</div>}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600 space-y-1">
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs mr-2"
        >
          Go to Login
        </button>
        <button 
          onClick={() => {
            document.cookie.split(";").forEach(c => {
              const eqPos = c.indexOf("=");
              const name = eqPos > -1 ? c.substr(0, eqPos) : c;
              document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs mr-2"
        >
          Clear All
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Reload
        </button>
      </div>
    </div>
  );
}