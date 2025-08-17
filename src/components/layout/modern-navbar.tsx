'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Menu, X, User, Settings, FileText, LogOut, ChevronDown, 
  FolderGit2, History, Home, Sparkles, BookOpen, Code2, Zap
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import DropdownPortal from '@/components/ui/dropdown-portal';

export default function ModernNavbar() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideTrigger = dropdownTriggerRef.current?.contains(target);
      const isClickInsideDropdown = target && (target as Element).closest('[data-dropdown-portal="true"]');
      
      if (!isClickInsideTrigger && !isClickInsideDropdown) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Features', href: '/features', icon: Sparkles },
    { name: 'Examples', href: '/examples', icon: Code2 },
    { name: 'Documentation', href: '/documentation', icon: BookOpen }
  ];

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[99999] smooth-transition h-16 no-lag hardware-accelerated ${
        isScrolled
          ? 'glass-navbar shadow-lg shadow-green-500/10'
          : 'glass-light border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full performance-optimized relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer shrink-0 relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
              animate={{
                boxShadow: pathname === '/' ? [
                  '0 0 8px rgba(0, 255, 136, 0.4)',
                  '0 0 16px rgba(0, 255, 136, 0.8)',
                  '0 0 24px rgba(0, 255, 136, 1)',
                  '0 0 16px rgba(0, 255, 136, 0.8)',
                  '0 0 8px rgba(0, 255, 136, 0.4)'
                ] : [
                  '0 0 0px rgba(0, 255, 136, 0.2)',
                  '0 0 8px rgba(0, 255, 136, 0.4)',
                  '0 0 16px rgba(0, 255, 136, 0.6)',
                  '0 0 8px rgba(0, 255, 136, 0.4)',
                  '0 0 0px rgba(0, 255, 136, 0.2)'
                ]
              }}
              transition={{
                duration: pathname === '/' ? 2 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FileText className="w-4 h-4 text-white" />
            </motion.div>
            
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white">
                AutoDoc AI
              </span>
              <span className="text-xs text-green-400/80 font-medium -mt-1">
                README Generator
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive 
                      ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                      : 'text-foreground/70 hover:text-green-400 hover:bg-green-400/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-green-400/5 rounded-lg -z-10"
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.a>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
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
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-400 border border-green-400/30 rounded-lg overflow-hidden group hover:border-green-400/50 transition-all duration-200 disabled:opacity-50"
                >
                  <Github className="w-4 h-4" />
                  <span className="relative z-10">
                    {isLoading ? 'Loading...' : 'Sign in'}
                  </span>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              ) : (
                <motion.div
                  key="user-menu"
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <motion.button
                    ref={dropdownTriggerRef}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-green-400 transition-all duration-200 border border-transparent hover:border-green-400/20 rounded-lg bg-green-400/5 hover:bg-green-400/10"
                  >
                    <img
                      src={user?.avatar_url}
                      alt={user?.name}
                      className="w-6 h-6 rounded-full border border-green-400/40"
                    />
                    
                    <span className="hidden xl:inline max-w-24 truncate">{user?.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>
                  
                  <DropdownPortal isOpen={dropdownOpen} triggerRef={dropdownTriggerRef}>
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="bg-black/95 backdrop-blur-xl border border-green-400/20 rounded-xl shadow-xl shadow-green-400/10 py-2 min-w-48"
                    >
                      <div className="px-4 py-3 border-b border-green-400/10">
                        <div className="font-medium text-sm text-white">{user?.name}</div>
                        <div className="text-xs text-green-400">@{user?.username}</div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push('/repositories');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4" />
                        My Repositories
                      </button>
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push('/history');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                      >
                        <History className="w-4 h-4" />
                        History
                      </button>
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push('/settings');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <hr className="border-green-400/10 my-2" />
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </DropdownPortal>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground/70 hover:text-green-400 transition-colors rounded-lg"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

      </div>
      
      {/* Mobile Navigation - Outside container for full width */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden mobile-nav-menu mobile-nav-dropdown"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = isActiveLink(link.href);
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`relative flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-lg ${
                        isActive 
                          ? 'text-green-400 bg-green-400/10 font-semibold border-l-2 border-green-400' 
                          : 'text-foreground/70 hover:text-green-400 hover:bg-green-400/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                      
                      {isActive && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </motion.a>
                  );
                })}
                
                <div className="px-4 pt-4 border-t border-green-400/10 mt-4">
                  {!isAuthenticated ? (
                    <motion.button
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={login}
                      disabled={isLoading}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/10 transition-colors disabled:opacity-50"
                    >
                      <Github className="w-4 h-4" />
                      {isLoading ? 'Loading...' : 'Sign in with GitHub'}
                    </motion.button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-2 py-3 bg-green-400/5 rounded-lg">
                        <img
                          src={user?.avatar_url}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full border border-green-400/40"
                        />
                        <div>
                          <div className="font-medium text-sm text-white">{user?.name}</div>
                          <div className="text-xs text-green-400">@{user?.username}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/repositories');
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-400/5 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <FolderGit2 className="w-4 h-4" />
                        My Repositories
                      </button>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/history');
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-400/5 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <History className="w-4 h-4" />
                        History
                      </button>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/settings');
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-400/5 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}