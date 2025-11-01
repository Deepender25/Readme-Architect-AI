'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, FileText, LogOut, ChevronDown, FolderGit2, History } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
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
                width={40}
                height={40}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => login()}
                  disabled={isLoading}
                  className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-10 px-4 py-2 inline-flex"
                >
                  <div className="flex items-center">
                    <svg className="size-4" viewBox="0 0 438.549 438.549">
                      <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" fill="#fff"></path>
                    </svg>
                    <span className="ml-1 text-white p-1">
                      {isLoading ? 'Loading...' : 'Connect with Github'}
                    </span>
                  </div>
                </motion.button>
              ) : (
                <motion.div
                  key="user-menu"
                  className="relative -ml-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <motion.button
                    ref={dropdownTriggerRef}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-green-400 transition-all duration-200 border border-transparent hover:border-green-500/30 rounded-lg relative"
                    style={{
                      boxShadow: dropdownOpen ? '0 0 12px rgba(0, 255, 136, 0.3)' : 'none'
                    }}
                  >
                    <img
                      src={user?.avatar_url}
                      alt={user?.name}
                      className="w-7 h-7 rounded-full border border-green-500/60 shadow-sm shadow-green-500/20"
                    />

                    <span className="hidden lg:inline">{user?.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </motion.button>

                  <DropdownPortal isOpen={dropdownOpen} triggerRef={dropdownTriggerRef}>
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      className="bg-black/95 backdrop-blur-xl border border-green-500/20 rounded-lg shadow-xl shadow-green-500/20 py-2"
                    >
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push('/repositories');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4" />
                        My Repositories
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push('/history');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        <History className="w-4 h-4" />
                        History
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push('/settings');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <hr className="border-border my-2" />
                      <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
                      className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-10 px-4 py-2 w-full flex"
                    >
                      <div className="flex items-center">
                        <svg className="size-4" viewBox="0 0 438.549 438.549">
                          <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" fill="#fff"></path>
                        </svg>
                        <span className="ml-1 text-white p-1">
                          {isLoading ? 'Loading...' : 'Connect with Github'}
                        </span>
                      </div>
                    </motion.button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-2 py-3">
                        <img
                          src={user?.avatar_url}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full border border-green-500/50"
                        />
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