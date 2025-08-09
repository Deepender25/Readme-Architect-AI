"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option...",
  className = ""
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      <div
        className="relative group rounded-lg bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] overflow-hidden cursor-pointer hover:border-green-400/50 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Dropdown button */}
        <div className="relative flex items-center justify-between px-4 py-2.5 text-white">
          <span className={`text-sm font-medium ${!selectedOption ? 'text-gray-400' : 'text-white'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-green-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </div>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 z-[9999] bg-[rgba(26,26,26,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl overflow-hidden"
              style={{ minWidth: '160px' }}
            >
              <div className="py-1 max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 ${
                      value === option.value
                        ? 'bg-green-400/20 text-green-400 font-medium'
                        : 'text-gray-300 hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}