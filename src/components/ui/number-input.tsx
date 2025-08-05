"use client";

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  label 
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
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-300">{label}</label>
      )}
      <div className="relative flex items-center max-w-[8rem]">
        <button 
          type="button" 
          onClick={handleDecrement}
          disabled={value <= min}
          className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(255,255,255,0.1)] rounded-l-lg p-3 h-11 focus:ring-green-500 focus:ring-2 focus:outline-none transition-all"
        >
          <Minus className="w-3 h-3 text-white" />
        </button>
        
        <input 
          type="text" 
          value={value}
          onChange={handleInputChange}
          className="bg-[rgba(255,255,255,0.05)] border-x-0 border-[rgba(255,255,255,0.1)] h-11 text-center text-white text-sm focus:ring-green-500 focus:border-green-500 block w-full py-2.5 transition-all"
          min={min}
          max={max}
        />
        
        <button 
          type="button" 
          onClick={handleIncrement}
          disabled={value >= max}
          className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(255,255,255,0.1)] rounded-r-lg p-3 h-11 focus:ring-green-500 focus:ring-2 focus:outline-none transition-all"
        >
          <Plus className="w-3 h-3 text-white" />
        </button>
      </div>
    </div>
  );
};