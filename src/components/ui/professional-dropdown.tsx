"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProfessionalDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function ProfessionalDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option...",
  className = "",
  disabled = false
}: ProfessionalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown function
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setButtonRect(null);
  }, []);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    
    if (!isOpen && buttonRef.current) {
      // Add a small delay to ensure DOM is updated
      requestAnimationFrame(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setButtonRect(rect);
          setIsOpen(true);
        }
      });
    } else {
      closeDropdown();
    }
  }, [isOpen, disabled, closeDropdown]);

  // Handle option selection
  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    closeDropdown();
  }, [onChange, closeDropdown]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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

  // Close on escape key and handle window resize
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
        buttonRef.current?.focus();
      }
    };

    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setButtonRect(rect);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('resize', handleResize);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, closeDropdown]);

  // Calculate position directly below button accounting for scroll
  const getDropdownPosition = () => {
    if (!buttonRect) return {};
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dropdownWidth = buttonRect.width; // Match button width exactly
    const dropdownHeight = Math.min(options.length * 48 + 8, 300);
    
    // Get current scroll position
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate absolute position accounting for scroll
    let top = buttonRect.top + scrollY + buttonRect.height + 2; // Position below button
    let left = buttonRect.left + scrollX; // Align with button left edge
    
    // Ensure dropdown doesn't go off-screen horizontally
    if (left + dropdownWidth > viewportWidth + scrollX - 8) {
      left = Math.max(scrollX + 8, viewportWidth + scrollX - dropdownWidth - 8);
    }
    if (left < scrollX + 8) {
      left = scrollX + 8;
    }
    
    // Check if dropdown would go off-screen vertically
    const bottomEdge = top + dropdownHeight;
    const viewportBottom = scrollY + viewportHeight;
    
    if (bottomEdge > viewportBottom - 8) {
      // Show above the button if there's more space
      const spaceAbove = buttonRect.top + scrollY - scrollY - 8;
      const spaceBelow = viewportBottom - (buttonRect.bottom + scrollY) - 8;
      
      if (spaceAbove > spaceBelow && spaceAbove >= 100) {
        top = buttonRect.top + scrollY - dropdownHeight - 2;
      } else {
        // Keep below but adjust height if needed
        const availableHeight = viewportBottom - top - 8;
        if (availableHeight < dropdownHeight) {
          return {
            top: Math.round(top),
            left: Math.round(left),
            width: Math.round(dropdownWidth),
            maxHeight: `${Math.max(100, availableHeight)}px`
          };
        }
      }
    }
    
    return {
      top: Math.round(top),
      left: Math.round(left),
      width: Math.round(dropdownWidth),
      maxHeight: '300px'
    };
  };

  const dropdownContent = isOpen && buttonRect && (
    <div className="professional-dropdown-portal">
      <div
        ref={dropdownRef}
        className="professional-dropdown-menu professional-dropdown-content glass-modal border border-green-400/20 shadow-2xl shadow-green-400/10"
        style={getDropdownPosition()}
      >
        <div className="py-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-green">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                professional-dropdown-option w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                transition-all duration-150 ease-out
                ${value === option.value
                  ? 'selected bg-green-400/20 text-green-400 font-medium'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              {/* Icon */}
              {option.icon && (
                <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                  {option.icon}
                </div>
              )}
              
              {/* Label */}
              <span className="flex-1 truncate">{option.label}</span>
              
              {/* Selected indicator */}
              {value === option.value && (
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3
          glass-button border-none
          transition-all duration-200 text-left h-[42px]
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700/50'}
          ${isOpen ? 'bg-gray-700/50 ring-2 ring-green-400/50' : 'bg-gray-800/50'}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Selected option icon */}
          {selectedOption?.icon && (
            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              {selectedOption.icon}
            </div>
          )}
          
          {/* Selected option text */}
          <span className={`
            block truncate text-sm font-medium
            ${selectedOption ? 'text-white' : 'text-gray-400'}
          `}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        
        {/* Chevron */}
        <ChevronDown 
          className={`
            w-4 h-4 text-gray-400 transition-all duration-200 flex-shrink-0 ml-2
            ${isOpen ? 'rotate-180 text-green-400' : 'rotate-0'}
          `} 
        />
      </button>

      {/* Dropdown Portal */}
      {typeof window !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}
