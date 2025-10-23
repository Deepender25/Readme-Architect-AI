"use client";

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  label,
  className = ""
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <div className="relative flex items-center w-32 md:w-24">
        <button 
          type="button" 
          onClick={handleDecrement}
          disabled={value <= min}
          className="inline-flex items-center justify-center w-6 md:w-10 h-10 p-0 text-white/70 bg-transparent border border-white/10 rounded-l-lg hover:bg-green-400/10 hover:text-green-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-2.5 md:w-3 h-2.5 md:h-3" />
        </button>
        
        <input 
          type="text" 
          value={value}
          onChange={handleInputChange}
          className="w-full h-10 px-0 md:px-3 text-center text-green-400 md:text-white bg-black/40 md:bg-black/60 backdrop-blur-xl border-t border-b border-green-400/50 md:border-white/10 focus:outline-none focus:bg-black/60 md:focus:bg-black/80 focus:border-green-400 transition-all duration-300 font-black md:font-medium text-xl md:text-base shadow-sm"
          min={min}
          max={max}
        />
        
        <button 
          type="button" 
          onClick={handleIncrement}
          disabled={value >= max}
          className="inline-flex items-center justify-center w-6 md:w-10 h-10 p-0 text-white/70 bg-transparent border border-white/10 rounded-r-lg hover:bg-green-400/10 hover:text-green-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};