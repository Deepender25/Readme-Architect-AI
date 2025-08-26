'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function AuthDebugPage() {
  const { user, isAuthenticated, isLoading, refreshAuth } = useAuth();
  const [cookies, setCookies] = useState('');
  const [cookieValue, setCookieValue] = useState('');

  useEffect(() => {
    const updateCookieInfo = () => {
      if (typeof window !== 'undefined') {
        setCookies(document.cookie);
        
        // Extract github_user cookie
        const githubUserCookie = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('github_user='));
        
        if (githubUserCookie) {
          const value = githubUserCookie.split('=')[1];
          setCookieValue(value);
        } else {
          setCookieValue('Not found');
        }
      }
    };

    updateCookieInfo();
    
    // Update every second
    const interval = setInterval(updateCookieInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-400">Authentication Debug</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Auth State</h2>
            <div className="space-y-2">
              <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? user.username : 'None'}</p>
              {user && (
                <div className="ml-4 space-y-1">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>GitHub ID:</strong> {user.github_id}</p>
                  <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Cookie Information</h2>
            <div className="space-y-2">
              <p><strong>All Cookies:</strong></p>
              <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                {cookies || 'No cookies found'}
              </pre>
              
              <p><strong>GitHub User Cookie Value:</strong></p>
              <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                {cookieValue}
              </pre>
              
              {cookieValue && cookieValue !== 'Not found' && (
                <>
                  <p><strong>Decoded Cookie:</strong></p>
                  <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(atob(cookieValue)), null, 2);
                      } catch (e) {
                        return `Error decoding: ${e.message}`;
                      }
                    })()}
                  </pre>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Actions</h2>
            <div className="space-x-4">
              <button
                onClick={refreshAuth}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                Refresh Auth
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                Reload Page
              </button>
              
              <button
                onClick={() => {
                  document.cookie = 'github_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                Clear Cookie & Reload
              </button>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">URL Information</h2>
            <div className="space-y-2">
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
              <p><strong>Search Params:</strong> {typeof window !== 'undefined' ? (window.location.search || 'None') : 'Server-side'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}