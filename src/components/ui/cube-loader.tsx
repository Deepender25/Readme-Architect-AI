"use client";

import React from 'react';

interface CubeLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'inline';
  variant?: 1 | 2 | 3 | 'default';
  className?: string;
  message?: string;
  showMessage?: boolean;
}

export const CubeLoader: React.FC<CubeLoaderProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  message = 'Loading...',
  showMessage = false
}) => {
  const getLoaderClasses = () => {
    let classes = 'cube-loader-global';
    
    if (size === 'sm') classes += ' cube-loader-sm';
    if (size === 'lg') classes += ' cube-loader-lg';
    if (size === 'inline') classes += ' cube-loader-inline';
    
    if (variant !== 'default') classes += ` cube-loader-variant-${variant}`;
    
    return classes;
  };

  const containerClasses = size === 'inline' 
    ? `inline-flex items-center ${className}`
    : `cube-loading-container ${className}`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className={getLoaderClasses()}>
          <div className="cube-global"></div>
          <div className="cube-global"></div>
          <div className="cube-global"></div>
          <div className="cube-global"></div>
        </div>
        
        {showMessage && message && (
          <div className="mt-4 text-center text-green-400 text-sm font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

// Export a simple HTML version for use in static contexts
export const CubeLoaderHTML = ({ 
  size = 'md', 
  message = 'Loading...',
  showMessage = false 
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showMessage?: boolean;
}) => {
  const sizeClass = size === 'sm' ? 'cube-loader-sm' : size === 'lg' ? 'cube-loader-lg' : '';
  
  return `
    <div class="cube-loading-container">
      <div class="flex flex-col items-center">
        <div class="cube-loader-global ${sizeClass}">
          <div class="cube-global"></div>
          <div class="cube-global"></div>
          <div class="cube-global"></div>
          <div class="cube-global"></div>
        </div>
        ${showMessage ? `
          <div class="mt-4 text-center text-green-400 text-sm font-medium">
            ${message}
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

export default CubeLoader;