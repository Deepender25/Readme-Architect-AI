"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

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
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      // Update position immediately
      updatePosition();
      
      // Add event listeners
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition, { passive: true });
      
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Portal content for dropdown with professional animations
  const dropdownPortal = mounted && isOpen && typeof window !== 'undefined' ? createPortal(
    <>
      {/* Backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-[999998] backdrop-blur-sm bg-black/20"
        style={{
          animation: 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dropdown content with professional animation */}
      <div
        className="dropdown-menu fixed z-[999999] bg-black/95 backdrop-blur-xl border border-green-400/20 rounded-xl shadow-2xl p-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-green"
        style={{
          top: position.top,
          left: position.left,
          width: Math.max(position.width, 160),
          minWidth: '160px',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            className={`dropdown-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm cursor-pointer min-h-[40px] ${
              value === option.value 
                ? 'bg-green-400/10 text-green-400 font-semibold selected' 
                : 'text-white/80'
            }`}
            style={{
              animationDelay: `${index * 30}ms`,
            }}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={buttonRef}
        className="w-full px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg text-white transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 hover:border-green-400/30 hover:bg-black/80 focus:outline-none focus:bg-black/80 focus:border-green-400 min-h-[44px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm font-medium flex-1 ${!selectedOption ? 'text-gray-400' : 'text-white'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-green-400 transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </div>

      {/* Render dropdown via portal */}
      {dropdownPortal}
    </div>
  );
}