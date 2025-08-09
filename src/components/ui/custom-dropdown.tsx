"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  const dropdownContent = mounted && isOpen ? (
    <>
      {/* Backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-[999998]"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dropdown menu */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[999999] bg-[rgba(26,26,26,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl overflow-hidden"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          minWidth: '160px'
        }}
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
  ) : null;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={buttonRef}
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

      {/* Portal the dropdown to document.body to ensure it's on top */}
      <AnimatePresence>
        {mounted && typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
      </AnimatePresence>
    </div>
  );
}