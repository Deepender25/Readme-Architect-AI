'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Menu, X, User, Settings, FileText, LogOut, ChevronDown, 
  FolderGit2, History, Home, Sparkles, BookOpen, Code2, Zap
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-client';
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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-[99999] smooth-transition h-16 no-lag hardware-accelerated ${
          isScrolled
            ? 'glass-navbar shadow-lg shadow-green-500/10'
            : 'glass-light border-b border-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full performance-optimized relative">
          <div className="flex items-center h-full w-full">
            {/* Logo - Far Left */}
            <div className="flex-shrink-0">
              <motion.div
                className="flex items-center gap-3 cursor-pointer relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/')}
              >
              <motion.div
                className="relative"
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
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                  quality={100}
                  style={{
                    imageRendering: 'auto' as const,
                    WebkitImageRendering: '-webkit-optimize-contrast',
                    filter: 'none',
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </motion.div>
              
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xl tracking-normal leading-normal text-white whitespace-nowrap">
                  ReadmeArchitect
                </span>
                <span className="text-xs text-green-400/80 font-medium -mt-0.5 whitespace-nowrap">
                  README Generator
                </span>
              </div>
              </motion.div>
            </div>

            {/* Desktop Navigation Links - Centered */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 group whitespace-nowrap ${
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

            {/* Desktop Auth Section - Far Right */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
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
                    className="relative flex items-center gap-2 text-sm font-medium text-green-400 border border-green-400/30 rounded-xl overflow-hidden group hover:border-green-400/50 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                    style={{
                      padding: '12px 24px',
                      minHeight: 'auto',
                      height: 'auto'
                    }}
                  >
                    <Github className="w-4 h-4" />
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
                      className="relative flex items-center gap-2 text-sm font-medium text-green-400 border border-green-400/30 rounded-xl overflow-hidden group hover:border-green-400/50 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                      style={{
                        padding: '12px 24px',
                        minHeight: 'auto',
                        height: 'auto'
                      }}
                    >
                      <img
                        src={user?.avatar_url}
                        alt={user?.name}
                        className="w-4 h-4 rounded-full flex-shrink-0"
                      />
                      <span className="relative z-10 flex-shrink-0">
                        {user?.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
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
                        className="glass-modal rounded-2xl shadow-2xl shadow-green-400/20 py-3 border border-green-400/20 mt-2 w-full"
                      >
                        <div className="px-4 py-3 border-b border-green-400/10">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img
                                src={user?.avatar_url}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full border-2 border-green-400/40"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-black flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white text-sm leading-tight truncate">
                                {user?.name}
                              </div>
                              <div className="text-green-400 text-xs leading-tight truncate">
                                @{user?.username}
                              </div>
                              <div className="text-gray-400 text-xs">
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
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 group"
                          >
                            <div className="w-6 h-6 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                              <FolderGit2 className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm truncate">My Repositories</div>
                              <div className="text-xs text-gray-500 truncate">Manage your projects</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push('/history');
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 group"
                          >
                            <div className="w-6 h-6 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                              <History className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm truncate">Generation History</div>
                              <div className="text-xs text-gray-500 truncate">View past READMEs</div>
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push('/settings');
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 group"
                          >
                            <div className="w-6 h-6 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                              <Settings className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm truncate">Account Settings</div>
                              <div className="text-xs text-gray-500 truncate">Preferences & privacy</div>
                            </div>
                          </button>
                        </div>
                        
                        <div className="border-t border-green-400/10 pt-2">
                          <button 
                            onClick={() => logout()}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
                          >
                            <div className="w-6 h-6 rounded-lg bg-red-400/10 flex items-center justify-center group-hover:bg-red-400/20 transition-colors">
                              <LogOut className="w-3.5 h-3.5 text-red-400" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm truncate">Sign Out</div>
                              <div className="text-xs text-red-400/60 truncate">End your session</div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    </DropdownPortal>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Navigation Links - Hidden on mobile, centered on tablet */}
            <div className="hidden md:flex lg:hidden items-center gap-6 flex-1 justify-center">
              {navLinks.slice(0, 2).map((link) => {
                const isActive = isActiveLink(link.href);
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group whitespace-nowrap ${
                      isActive 
                        ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                        : 'text-foreground/70 hover:text-green-400 hover:bg-green-400/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile menu button - Far Right */}
            <div className="lg:hidden flex-shrink-0 ml-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground/70 hover:text-green-400 transition-colors rounded-lg glass-button"
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
      </nav>
      
      {/* Mobile Navigation - Outside container for full width */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden mobile-nav-visible mobile-hamburger-menu"
          >
            <div className="w-full px-4 sm:px-6 lg:px-8">
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
                      onClick={() => login()}
                      disabled={isLoading}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/10 transition-colors disabled:opacity-50"
                    >
                      <Github className="w-4 h-4" />
                      {isLoading ? 'Loading...' : 'Connect with Github'}
                    </motion.button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-4 px-4 py-4 glass-card rounded-xl border border-green-400/20">
                        <div className="relative">
                          <img
                            src={user?.avatar_url}
                            alt={user?.name}
                            className="w-12 h-12 rounded-full border-2 border-green-400/40"
                          />
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
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/repositories');
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 rounded-lg flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                          <FolderGit2 className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">My Repositories</div>
                          <div className="text-xs text-gray-500">Manage your projects</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/history');
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 rounded-lg flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                          <History className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Generation History</div>
                          <div className="text-xs text-gray-500">View past READMEs</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/settings');
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-400/10 transition-all duration-200 rounded-lg flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center group-hover:bg-green-400/20 transition-colors">
                          <Settings className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Account Settings</div>
                          <div className="text-xs text-gray-500">Preferences & privacy</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-3 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 rounded-lg flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center group-hover:bg-red-400/20 transition-colors">
                          <LogOut className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-red-400/60">End your session</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}