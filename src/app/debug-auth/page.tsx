'use client';

import { useAuth } from '@/lib/auth';

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const directRedirect = () => {
    console.log('Direct redirect test from debug page');
    window.location.href = '/auth/github';
  };

  const testFetch = async () => {
    try {
      console.log('Testing fetch to /auth/github');
      const response = await fetch('/auth/github');
      console.log('Response:', response);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-8">Auth Debug Page</h1>
      
      <div className="space-y-4 mb-8">
        <div>User: {user ? user.username : 'null'}</div>
        <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Cookies: {typeof window !== 'undefined' && document.cookie.includes('github_user') ? 'present' : 'none'}</div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={login}
          className="block bg-green-600 px-4 py-2 rounded"
        >
          Auth Context Login
        </button>
        
        <button 
          onClick={directRedirect}
          className="block bg-blue-600 px-4 py-2 rounded"
        >
          Direct Window Redirect
        </button>
        
        <button 
          onClick={testFetch}
          className="block bg-purple-600 px-4 py-2 rounded"
        >
          Test Fetch
        </button>
        
        <button 
          onClick={logout}
          className="block bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Manual Tests</h2>
        <div className="space-y-2">
          <a href="/auth/github" className="block text-blue-400 underline">
            Direct Link to /auth/github
          </a>
          <button 
            onClick={() => window.open('/auth/github', '_blank')}
            className="block bg-gray-600 px-4 py-2 rounded"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    </div>
  );
}