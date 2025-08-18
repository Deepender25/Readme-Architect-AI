"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SimpleDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SimpleDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
  className = ""
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [shouldShowAbove, setShouldShowAbove] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown function
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setButtonRect(null);
  }, []);

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
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen, closeDropdown]);

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
          const dropdownHeight = Math.min(options.length * 48 + 16, 256); // Estimate height
          
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
  }, [isOpen, options.length]);

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-green-400/50 rounded-lg transition-all duration-200 text-left group"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={`text-sm font-medium ${selectedOption ? 'text-white' : 'text-gray-400'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 group-hover:text-green-400 transition-all duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {/* Dropdown Menu - Rendered in Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && buttonRect && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                style={{ zIndex: 9999998 }}
                onClick={closeDropdown}
              />
              
              {/* Menu */}
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
                className="dropdown-menu simple-dropdown-menu fixed bg-gray-900/98 backdrop-blur-xl border border-green-400/30 rounded-lg shadow-2xl overflow-hidden mobile-dropdown-menu"
                data-dropdown-menu="true"
                style={{
                  top: shouldShowAbove 
                    ? buttonRect.top - 8 
                    : buttonRect.bottom + 8,
                  left: Math.max(8, Math.min(
                    buttonRect.left,
                    window.innerWidth - buttonRect.width - 8
                  )),
                  width: window.innerWidth < 768 
                    ? Math.min(buttonRect.width, window.innerWidth - 16)
                    : buttonRect.width,
                  maxHeight: shouldShowAbove 
                    ? Math.min(256, buttonRect.top - 16)
                    : Math.min(256, window.innerHeight - buttonRect.bottom - 16),
                  zIndex: 9999999,
                  transform: shouldShowAbove ? 'translateY(-100%)' : 'none',
                }}
              >
                <div className="py-1 max-h-full overflow-y-auto scrollbar-thin scrollbar-green">
                  {options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, x: shouldShowAbove ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => {
                        onChange(option.value);
                        closeDropdown();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 text-left mobile-touch-target ${
                        value === option.value
                          ? 'bg-green-500/20 text-green-400 font-medium border-l-2 border-green-400'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white active:bg-gray-600/50'
                      }`}
                    >
                      <div className="flex-shrink-0">{option.icon}</div>
                      <span className="flex-1 truncate">{option.label}</span>
                      {value === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}