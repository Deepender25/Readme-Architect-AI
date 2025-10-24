'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DebugAuthContent() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = {
        url: window.location.href,
        cookies: document.cookie,
        localStorage: {
          active_sessions: localStorage.getItem('active_sessions'),
          previous_github_account: localStorage.getItem('previous_github_account'),
          show_account_selection: localStorage.getItem('show_account_selection'),
        },
        sessionStorage: {
          oauth_return_to: sessionStorage.getItem('oauth_return_to'),
        },
        urlParams: {
          auth_success: searchParams.get('auth_success'),
          error: searchParams.get('error'),
          code: searchParams.get('code'),
          state: searchParams.get('state'),
        },
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      setDebugInfo(info);
    }
  }, [searchParams]);

  const testAuthFlow = async () => {
    try {
      console.log('Testing auth flow...');
      
      // Test 1: Check if we can reach the auth endpoint
      const authResponse = await fetch('/auth/github', { redirect: 'manual' });
      console.log('Auth endpoint response:', authResponse.status, authResponse.headers.get('Location'));
      
      // Test 2: Check if we can reach the API endpoints
      const repoResponse = await fetch('/api/repositories');
      console.log('Repositories endpoint response:', repoResponse.status);
      
      // Test 3: Check current session
      const sessionData = localStorage.getItem('active_sessions');
      console.log('Current sessions:', sessionData);
      
    } catch (error) {
      console.error('Auth flow test error:', error);
    }
  };

  const clearAllAuth = () => {
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('All auth data cleared');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-400">Authentication Debug</h1>
        
        <div className="grid gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Actions</h2>
            <div className="space-x-4">
              <button 
                onClick={testAuthFlow}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                Test Auth Flow
              </button>
              <button 
                onClick={clearAllAuth}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Clear All Auth Data
              </button>
              <button 
                onClick={() => window.location.href = '/auth/github'}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Try Login
              </button>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Debug Information</h2>
            <pre className="text-sm overflow-auto bg-black p-4 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DebugAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">Loading...</div>}>
      <DebugAuthContent />
    </Suspense>
  );
}