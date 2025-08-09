"use client"

import { useState, useRef, useEffect } from 'react'
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

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
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="fixed z-[9999] bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-lg shadow-2xl overflow-hidden"
                style={{
                  top: buttonRect.bottom + 8,
                  left: buttonRect.left,
                  width: buttonRect.width,
                }}
              >
                <div className="py-1 max-h-64 overflow-y-auto">
                  {options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 text-left ${
                        value === option.value
                          ? 'bg-green-500/20 text-green-400 font-medium'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                      {value === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-green-400 rounded-full"
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