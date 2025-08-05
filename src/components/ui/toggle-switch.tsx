"use client";

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label 
}) => {
  return (
    <div className="flex items-center gap-3">
      <label className="switch">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
      {label && <span className="text-white text-sm">{label}</span>}

      <style jsx>{`
        /* The switch - the box around the slider */
        .switch {
          font-size: 17px;
          position: relative;
          display: inline-block;
          width: 3.5em;
          height: 2em;
        }

        /* Hide default HTML checkbox */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        /* The slider */
        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: #d4acfb;
          border-radius: 50px;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 1.4em;
          width: 1.4em;
          left: 0.3em;
          bottom: 0.3em;
          background-color: white;
          border-radius: 50px;
          box-shadow: 0 0px 20px rgba(0,0,0,0.4);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .switch input:checked + .slider {
          background: #10b981;
        }

        .switch input:focus + .slider {
          box-shadow: 0 0 1px #10b981;
        }

        .switch input:checked + .slider:before {
          transform: translateX(1.6em);
          width: 2em;
          height: 2em;
          bottom: 0;
        }
      `}</style>
    </div>
  );
};