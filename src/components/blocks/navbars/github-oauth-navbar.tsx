'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, FileText, LogOut, ChevronDown, FolderGit2, History } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-client';
import DropdownPortal from '@/components/ui/dropdown-portal';



export default function GitHubOAuthNavbar() {
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
    { name: 'Features', href: '/features' },
    { name: 'Examples', href: '/examples' },
    { name: 'Documentation', href: '/documentation' }
  ];

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-[9998] smooth-transition h-16 no-lag hardware-accelerated ${isScrolled
          ? 'glass-navbar shadow-lg shadow-green-500/20'
          : 'glass-light border-b border-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full performance-optimized relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo - properly aligned and animated */}
          <motion.div
            className={`flex items-center gap-3 cursor-pointer shrink-0 relative ${pathname === '/' ? 'scale-105' : ''
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
          >
            <motion.div
              className="relative w-10 h-10"
              animate={{
                filter: pathname === '/' ? [
                  'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))',
                  'drop-shadow(0 0 16px rgba(0, 255, 136, 0.8))',
                  'drop-shadow(0 0 24px rgba(0, 255, 136, 1))',
                  'drop-shadow(0 0 16px rgba(0, 255, 136, 0.8))',
                  'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))'
                ] : [
                  'drop-shadow(0 0 0px rgba(0, 255, 136, 0.2))',
                  'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))',
                  'drop-shadow(0 0 16px rgba(0, 255, 136, 0.6))',
                  'drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))',
                  'drop-shadow(0 0 0px rgba(0, 255, 136, 0.2))'
                ]
              }}
              transition={{
                duration: pathname === '/' ? 2 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/Logo.png"
                alt="ReadmeArchitect Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
                quality={100}
                unoptimized
              />
            </motion.div>

            <span className={`font-bold text-2xl tracking-normal leading-normal transition-all duration-300 ${pathname === '/' ? 'text-green-300' : 'text-green-400'
              }`}>
              ReadmeArchitect
            </span>

            {/* Home page active indicator */}
            {pathname === '/' && (
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"
                layoutId="active-nav-link"
              />
            )}
          </motion.div>

          {/* Desktop Navigation Links - centered and balanced */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-300 px-3 py-2 group ${isActive
                      ? 'text-green-400 font-semibold'
                      : 'text-foreground/70 hover:text-green-400'
                    }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {link.name}

                  {isActive && (
                    <motion.div
                      className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                      layoutId="active-nav-link"
                      style={{ boxShadow: '0 0 12px rgba(0, 255, 136, 0.8)' }}
                    />
                  )}
                </motion.a>
              );
            })}
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
                  onClick={() => login()}
                  disabled={isLoading}
                  className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-green-400 border border-green-400/30 rounded-xl overflow-hidden group hover:border-green-400/50 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span className="relative z-10">
                    {isLoading ? 'Loading...' : 'Connect with Github'}
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-green-400 border border-green-400/30 rounded-xl overflow-hidden group hover:border-green-400/50 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                  >
                    <div className="relative w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={user?.avatar_url || '/default-avatar.svg'}
                        alt={user?.name || 'User'}
                        width={16}
                        height={16}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                        onError={(e: any) => {
                          e.target.src = '/default-avatar.svg';
                        }}
                      />
                    </div>
                    <span className="relative z-10">
                      {user?.name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        dropdownOpen ? 'rotate-180' : ''
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                  
                  <DropdownPortal isOpen={dropdownOpen} triggerRef={dropdownTriggerRef}>
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="glass-modal rounded-2xl shadow-2xl shadow-green-400/20 py-3 min-w-64 border border-green-400/20"
                    >
                      <div className="px-5 py-4 border-b border-green-400/10">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-green-400/40">
                              <Image
                                src={user?.avatar_url || '/default-avatar.svg'}
                                alt={user?.name || 'User'}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized
                                onError={(e: any) => {
                                  e.target.src = '/default-avatar.svg';
                                }}
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white text-base leading-normal">
                              {user?.name}
                            </div>
                            <div className="text-green-400 text-sm leading-normal">
                              @{user?.username}
                            </div>
                            <div className="text-gray-400 text-xs mt-0.5">
                              GitHub Developer
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push('/repositories');
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                            <FolderGit2 className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">My Repositories</div>
                            <div className="text-xs text-gray-500">Manage your projects</div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push('/history');
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                            <History className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">Generation History</div>
                            <div className="text-xs text-gray-500">View past READMEs</div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push('/settings');
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                            <Settings className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">Account Settings</div>
                            <div className="text-xs text-gray-500">Preferences & privacy</div>
                          </div>
                        </button>
                      </div>
                      
                      <div className="border-t border-green-400/10 pt-2">
                        <button 
                          onClick={() => logout()}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center group-hover:bg-red-400/20 transition-colors">
                            <LogOut className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">Sign Out</div>
                            <div className="text-xs text-red-400/60">End your session</div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </DropdownPortal>
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

        {/* Mobile Navigation - improved layout */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = isActiveLink(link.href);
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`relative block px-4 py-3 transition-all duration-300 rounded-lg ${isActive
                          ? 'text-green-400 bg-green-500/10 font-semibold border-l-2 border-green-400'
                          : 'text-foreground/70 hover:text-green-400 hover:bg-green-500/5'
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}

                      {/* Active state indicator for mobile */}
                      {isActive && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}

                      {/* Pulsing effect for active mobile item */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-green-400/5 rounded-lg -z-10"
                          animate={{
                            opacity: [0.2, 0.4, 0.2]
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

                <div className="px-4 pt-4">
                  {!isAuthenticated ? (
                    <motion.button
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => login()}
                      disabled={isLoading}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/10 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      {isLoading ? 'Loading...' : 'Connect with Github'}
                    </motion.button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-2 py-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-green-500/50 flex-shrink-0">
                          <Image
                            src={user?.avatar_url || '/default-avatar.svg'}
                            alt={user?.name || 'User'}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            unoptimized
                            onError={(e: any) => {
                              e.target.src = '/default-avatar.svg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user?.name}</div>
                          <div className="text-xs text-muted-foreground">@{user?.username}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/repositories');
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <FolderGit2 className="w-4 h-4" />
                        My Repositories
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/history');
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <History className="w-4 h-4" />
                        History
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/settings');
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-foreground/70 hover:text-green-400 hover:bg-green-500/5 transition-colors rounded-lg flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg flex items-center gap-3"
                      >
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
    </nav>
  );
}