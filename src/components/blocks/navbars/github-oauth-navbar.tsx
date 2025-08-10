"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X, User, Settings, FileText, LogOut, ChevronDown, FolderGit2, History } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface GitHubOAuthNavbarProps {
  // Props are now optional since we use the auth hook
}

export default function GitHubOAuthNavbar({}: GitHubOAuthNavbarProps) {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Examples', href: '/examples' },
    { name: 'Documentation', href: '/documentation' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 h-16 ${
        isScrolled
          ? 'bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-green-500/20'
          : 'bg-background/80 backdrop-blur-sm border-b border-transparent'}`}>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - properly aligned and animated */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/'}>
            
            <motion.div
              className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(0, 255, 136, 0.2)',
                  '0 0 8px rgba(0, 255, 136, 0.4)',
                  '0 0 16px rgba(0, 255, 136, 0.6)',
                  '0 0 8px rgba(0, 255, 136, 0.4)',
                  '0 0 0px rgba(0, 255, 136, 0.2)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}>
              <FileText className="w-4 h-4 text-white" />
            </motion.div>
            
            <span className="font-bold text-green-400 text-2xl tracking-tight">
              AutoDoc AI
            </span>
          </motion.div>

          {/* Desktop Navigation Links - centered and balanced */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-foreground/70 hover:text-green-400 transition-colors px-3 py-2 group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}>
                
                {link.name}
                <motion.div
                  className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-400"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{
                    transformOrigin: 'center',
                    boxShadow: '0 0 8px rgba(0, 255, 136, 0.6)'
                  }} />
              </motion.a>
            ))}
          </div>

          {/* Desktop Auth Section - properly spaced */}
          <div className="hidden md:flex items-center w-auto">
            <AnimatePresence mode="wait">
              {!isAuthenticated ? (
                <motion.button
                  key="sign-in"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={login}
                  disabled={isLoading}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-500 border border-green-500/50 rounded-lg overflow-hidden group hover:border-green-500/80 transition-all duration-200 disabled:opacity-50">
                  
                  <Github className="w-4 h-4" />
                  <span className="relative z-10">
                    {isLoading ? 'Loading...' : 'Sign in with GitHub'}
                  </span>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 border border-green-400/50 rounded-lg"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }} />
                </motion.button>
              ) : (
                <motion.div
                  key="user-menu"
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}>
                  
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground/80 hover:text-green-400 transition-all duration-200 border border-transparent hover:border-green-500/30 rounded-lg"
                    style={{
                      boxShadow: dropdownOpen ? '0 0 12px rgba(0, 255, 136, 0.3)' : 'none'
                    }}>
                    
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border border-green-500/60 shadow-sm shadow-green-500/20" />
                    
                    <span className="hidden lg:inline">{user.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-card/95 backdrop-blur-xl border border-green-500/20 rounded-lg shadow-xl shadow-green-500/20 py-2">
                        
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            // Navigate to repositories page
                            window.location.href = '/repositories';
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                          <FolderGit2 className="w-4 h-4" />
                          My Repositories
                        </button>
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            // Navigate to history page
                            window.location.href = '/history';
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                          <History className="w-4 h-4" />
                          History
                        </button>
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            window.location.href = '/settings';
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <hr className="border-border my-2" />
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button - optimized */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground/70 hover:text-green-400 transition-colors rounded-lg">
              
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation - improved layout */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-border/50 overflow-hidden">
              
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="block px-4 py-3 text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg"
                    onClick={() => setIsOpen(false)}>
                    {link.name}
                  </motion.a>
                ))}
                
                <div className="px-4 pt-4">
                  {!isAuthenticated ? (
                    <motion.button
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={login}
                      disabled={isLoading}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-green-500 border border-green-500/50 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50">
                      <Github className="w-4 h-4" />
                      {isLoading ? 'Loading...' : 'Sign in with GitHub'}
                    </motion.button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-2 py-3">
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-8 h-8 rounded-full border border-green-500/50" />
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = '/repositories';
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg flex items-center gap-3">
                        <FolderGit2 className="w-4 h-4" />
                        My Repositories
                      </button>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = '/history';
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg flex items-center gap-3">
                        <History className="w-4 h-4" />
                        History
                      </button>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = '/settings';
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg flex items-center gap-3">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg flex items-center gap-3">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}