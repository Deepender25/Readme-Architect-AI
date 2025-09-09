import React from 'react';
import { GridLoadingAnimation, GridLoader } from '@/components/ui/grid-loading-animation';
import { CubeLoaderHTML } from '@/components/ui/cube-loader';

// Common loading animation configurations
export const loadingConfigs = {
  // Quick inline loaders
  inline: {
    size: 'sm' as const,
    showMessage: false,
    speed: 'fast' as const,
    intensity: 2 as const
  },
  
  // Standard page loading
  page: {
    size: 'lg' as const,
    showMessage: true,
    speed: 'normal' as const,
    intensity: 4 as const
  },
  
  // Form/button loading states
  button: {
    size: 'sm' as const,
    showMessage: false,
    speed: 'fast' as const,
    intensity: 1 as const
  },
  
  // Modal/dialog loading
  modal: {
    size: 'md' as const,
    showMessage: true,
    speed: 'normal' as const,
    intensity: 3 as const
  },
  
  // Full-screen loading overlay
  overlay: {
    size: 'xl' as const,
    showMessage: true,
    speed: 'normal' as const,
    intensity: 5 as const
  }
};

// Type for loading contexts
export type LoadingContext = keyof typeof loadingConfigs;

// Utility function to get consistent loading animation
export const createGridLoader = (
  context: LoadingContext,
  options?: {
    message?: string;
    className?: string;
    variant?: 'default' | 'intense' | 'minimal';
  }
) => {
  const config = loadingConfigs[context];
  const { message, className = '', variant = 'default' } = options || {};
  
  // Adjust intensity based on variant
  const adjustedIntensity = 
    variant === 'minimal' ? Math.max(1, config.intensity - 2) :
    variant === 'intense' ? Math.min(5, config.intensity + 2) :
    config.intensity;
  
  return (
    <GridLoadingAnimation
      size={config.size}
      message={message}
      showMessage={config.showMessage && !!message}
      speed={config.speed}
      intensity={adjustedIntensity}
      className={className}
    />
  );
};

// Quick access components for common use cases
export const PageLoader = ({ 
  message = "Loading...", 
  className = "" 
}: { 
  message?: string; 
  className?: string; 
}) => createGridLoader('page', { message, className });

export const InlineLoader = ({ 
  className = "" 
}: { 
  className?: string; 
}) => createGridLoader('inline', { className });

export const ButtonLoader = ({ 
  className = "" 
}: { 
  className?: string; 
}) => createGridLoader('button', { className });

export const ModalLoader = ({ 
  message = "Processing...", 
  className = "" 
}: { 
  message?: string; 
  className?: string; 
}) => createGridLoader('modal', { message, className });

export const OverlayLoader = ({ 
  message = "Loading...", 
  className = "" 
}: { 
  message?: string; 
  className?: string; 
}) => createGridLoader('overlay', { message, className });

// Hook for loading states
export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const toggleLoading = () => setLoading(!loading);
  
  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading
  };
};

// Loading wrapper component
export const LoadingWrapper = ({ 
  loading, 
  children, 
  context = 'page',
  message = "Loading...",
  className = "",
  fallback
}: {
  loading: boolean;
  children: React.ReactNode;
  context?: LoadingContext;
  message?: string;
  className?: string;
  fallback?: React.ReactNode;
}) => {
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallback || createGridLoader(context, { message })}
      </div>
    );
  }
  
  return <>{children}</>;
};

// HTML string generators for static contexts
export const generateGridLoaderHTML = (
  context: LoadingContext,
  options?: {
    message?: string;
    className?: string;
  }
) => {
  const config = loadingConfigs[context];
  const { message, className = '' } = options || {};
  
  const sizeClass = `grid-loader-${config.size}`;
  
  const squares = Array.from({ length: config.intensity }, (_, i) => {
    const positions = [
      { left: '20px', top: '20px' },
      { left: '40px', top: '40px' },
      { left: '60px', top: '20px' },
      { left: '80px', top: '60px' },
      { left: '100px', top: '40px' }
    ];
    
    const pos = positions[i % positions.length];
    return `<div class="grid-square" style="left: ${pos.left}; top: ${pos.top};"></div>`;
  }).join('');
  
  return `
    <div class="grid-loader-container ${className}">
      <div class="grid-loader-bg ${sizeClass}">
        <div class="grid-loader-squares">
          ${squares}
        </div>
        <div class="grid-loader-fade"></div>
      </div>
      ${config.showMessage && message ? `
        <div class="grid-loader-message">
          ${message}
        </div>
      ` : ''}
    </div>
  `;
};

// Export for backward compatibility
export { GridLoadingAnimation, GridLoader, CubeLoaderHTML };

// CSS class utilities
export const gridLoaderClasses = {
  container: 'grid-loader-container',
  background: 'grid-loader-bg',
  squares: 'grid-loader-squares',
  square: 'grid-square',
  fade: 'grid-loader-fade',
  message: 'grid-loader-message',
  sizes: {
    sm: 'grid-loader-sm',
    md: 'grid-loader-md', 
    lg: 'grid-loader-lg',
    xl: 'grid-loader-xl'
  }
};

export default createGridLoader;
