'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function AccountSwitcher() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-xl transition-all"
      >
        <img
          src={user.avatar_url}
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-green-500/50"
        />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white whitespace-nowrap">
            {user.name}
          </p>
          <p className="text-xs text-gray-400 whitespace-nowrap">
            @{user.username}
          </p>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-green-500/50"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    {user.email && (
                      <p className="text-xs text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                
                <Link
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </Link>

                <div className="border-t border-gray-700 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}