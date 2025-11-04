"use client";

import { useState, useEffect } from 'react';
import { User, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleAuth from '@/lib/auth';

interface AuthStatusProps {
  onLoginClick?: () => void;
  className?: string;
}

export default function AuthStatus({ onLoginClick, className = "" }: AuthStatusProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      window.location.href = '/api/auth/github?returnTo=' + encodeURIComponent(window.location.pathname);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {user ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <User className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">
            Signed in as {user.username}
          </span>
          <Lock className="w-3 h-3 text-green-400" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <Lock className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">
              Public repos only
            </span>
          </div>
          <Button
            onClick={handleLogin}
            variant="outline"
            size="sm"
            className="border-white/20 hover:border-white/30"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign in for private repos
          </Button>
        </div>
      )}
    </div>
  );
}