"use client";

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label,
  className = "",
  disabled = false
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="toggle-switch-unified">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span className={`toggle-slider ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}>
          <span className="toggle-thumb" />
        </span>
      </label>
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-white'}`}>
          {label}
        </span>
      )}

      <style jsx>{`
        .toggle-switch-unified {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
        }

        .toggle-slider {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .toggle-slider.checked {
          background: var(--primary-green);
          border-color: var(--primary-green);
          box-shadow: 0 0 16px rgba(0, 255, 136, 0.3);
        }

        .toggle-slider.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .toggle-slider.checked .toggle-thumb {
          transform: translateX(24px);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .toggle-switch-unified:hover .toggle-slider:not(.disabled) {
          border-color: rgba(0, 255, 136, 0.4);
        }

        .toggle-switch-unified:hover .toggle-slider.checked:not(.disabled) {
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
        }

        .toggle-switch-unified:focus-within .toggle-slider:not(.disabled) {
          box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.3);
        }
      `}</style>
    </div>
  );
};