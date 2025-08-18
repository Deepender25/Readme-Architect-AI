"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface EnhancedDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'outline';
  maxHeight?: number;
  label?: string;
  error?: string;
  showSelectedIcon?: boolean;
}

export default function EnhancedDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option...",
  className = "",
  searchable = false,
  disabled = false,
  size = 'md',
  variant = 'glass',
  maxHeight = 300,
  label,
  error,
  showSelectedIcon = true
}: EnhancedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [shouldShowAbove, setShouldShowAbove] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-5 py-3 text-base min-h-[52px]'
  };

  // Variant styles
  const variantClasses = {
    default: 'bg-gray-800/70 hover:bg-gray-700/70 border-gray-600/50 hover:border-green-400/50',
    glass: 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)] hover:border-green-400/50 backdrop-blur-xl',
    outline: 'bg-transparent hover:bg-gray-800/30 border-gray-600/50 hover:border-green-400/70'
  };

  // Close dropdown function
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setButtonRect(null);
    setSearchTerm('');
    setFocusedIndex(-1);
  }, []);

  // Handle option selection
  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    closeDropdown();
  }, [onChange, closeDropdown]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  }, [isOpen, filteredOptions, focusedIndex, handleSelect, closeDropdown]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && buttonRef.current && dropdownRef.current) {
        const target = event.target as Node;
        if (!buttonRef.current.contains(target) && !dropdownRef.current.contains(target)) {
          closeDropdown();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, closeDropdown, handleKeyDown]);

  // Handle position updates
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setButtonRect(rect);
          
          // Check if dropdown should show above
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;
          const dropdownHeight = Math.min(filteredOptions.length * 56 + (searchable ? 60 : 16), maxHeight);
          
          setShouldShowAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
        }
      };
      
      updatePosition();
      
      // Update position on scroll and resize with throttling
      let ticking = false;
      const handleUpdate = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            updatePosition();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isOpen, filteredOptions.length, searchable, maxHeight]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      // Small delay to ensure portal is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && buttonRect && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999998]"
            onClick={closeDropdown}
          />
          
          {/* Dropdown Menu */}
          <motion.div
            ref={dropdownRef}
            initial={{ 
              opacity: 0, 
              y: shouldShowAbove ? 8 : -8, 
              scale: 0.95 
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: shouldShowAbove ? 8 : -8, 
              scale: 0.95 
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              fixed bg-black/95 backdrop-blur-xl border border-green-400/30 rounded-xl shadow-2xl overflow-hidden z-[9999999]
              ${window.innerWidth < 768 ? 'mx-2' : ''}
            `}
            style={{
              top: shouldShowAbove 
                ? buttonRect.top - 8 
                : buttonRect.bottom + 8,
              left: window.innerWidth < 768 
                ? Math.max(8, Math.min(buttonRect.left, window.innerWidth - buttonRect.width - 8))
                : buttonRect.left,
              width: window.innerWidth < 768 
                ? Math.min(buttonRect.width, window.innerWidth - 16)
                : Math.max(buttonRect.width, 200),
              maxWidth: window.innerWidth < 768 ? 'calc(100vw - 16px)' : '400px',
              maxHeight: shouldShowAbove 
                ? Math.min(maxHeight, buttonRect.top - 16)
                : Math.min(maxHeight, window.innerHeight - buttonRect.bottom - 16),
              transform: shouldShowAbove ? 'translateY(-100%)' : 'none',
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-700/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400/50 text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="py-2 max-h-full overflow-y-auto scrollbar-thin scrollbar-green">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-400">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: shouldShowAbove ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 text-left
                      ${size === 'lg' ? 'py-4' : size === 'sm' ? 'py-2' : 'py-3'}
                      ${window.innerWidth < 768 ? 'min-h-[48px] py-3' : ''}
                      ${option.disabled 
                        ? 'text-gray-500 cursor-not-allowed opacity-50' 
                        : value === option.value
                          ? 'bg-green-500/20 text-green-400 font-medium border-l-2 border-green-400'
                          : focusedIndex === index
                            ? 'bg-gray-700/70 text-white'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white active:bg-gray-600/50'
                      }
                    `}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {option.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-400 truncate mt-0.5">
                          {option.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Selected indicator */}
                    {value === option.value && showSelectedIcon && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <Check className="w-4 h-4 text-green-400" />
                      </motion.div>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between border rounded-xl transition-all duration-200 text-left group relative
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400/30'
          }
          ${error ? 'border-red-400/50' : ''}
          ${isOpen ? 'border-green-400/50 bg-[rgba(255,255,255,0.1)]' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Selected option icon */}
          {selectedOption?.icon && (
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {selectedOption.icon}
            </div>
          )}
          
          {/* Selected option text */}
          <div className="flex-1 min-w-0">
            <span className={`
              block truncate font-medium
              ${selectedOption ? 'text-white' : 'text-gray-400'}
            `}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.description && size === 'lg' && (
              <span className="block text-xs text-gray-400 truncate">
                {selectedOption.description}
              </span>
            )}
          </div>
        </div>
        
        {/* Chevron */}
        <ChevronDown 
          className={`
            w-5 h-5 text-gray-400 group-hover:text-green-400 transition-all duration-200 flex-shrink-0 ml-2
            ${isOpen ? 'rotate-180 text-green-400' : 'rotate-0'}
          `} 
        />
      </button>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Dropdown Portal */}
      {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}
