"use client";

import React, { useEffect, useRef } from 'react';

interface GridLoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'intense' | 'minimal' | 'pulse';
  className?: string;
  message?: string;
  showMessage?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: 1 | 2 | 3 | 4 | 5;
}

export const GridLoadingAnimation: React.FC<GridLoadingAnimationProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  message = 'Loading...',
  showMessage = false,
  speed = 'normal',
  intensity = 3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const sizeConfig = {
    sm: { gridSize: 15, containerSize: 120 },
    md: { gridSize: 20, containerSize: 160 },
    lg: { gridSize: 25, containerSize: 200 },
    xl: { gridSize: 30, containerSize: 240 }
  };

  const speedConfig = {
    slow: 1200,
    normal: 800,
    fast: 500
  };

  const config = sizeConfig[size];
  const animationSpeed = speedConfig[speed];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const squares: HTMLDivElement[] = [];
    const activeSquares = new Set<HTMLDivElement>();

    // Clear existing content
    container.innerHTML = '';

    // Calculate grid dimensions
    const cols = Math.ceil(config.containerSize / config.gridSize);
    const rows = Math.ceil(config.containerSize / config.gridSize);

    // Create grid squares
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const square = document.createElement('div');
        square.className = 'grid-loader-square';
        square.style.cssText = `
          position: absolute;
          width: ${config.gridSize}px;
          height: ${config.gridSize}px;
          left: ${col * config.gridSize}px;
          top: ${row * config.gridSize}px;
          background-color: transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          border-radius: 2px;
        `;
        
        container.appendChild(square);
        squares.push(square);
      }
    }

    // Animation logic
    const animate = () => {
      const availableSquares = squares.filter(s => !activeSquares.has(s));
      if (availableSquares.length === 0) return;

      // Animate multiple squares based on intensity
      const count = Math.min(intensity, availableSquares.length);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * availableSquares.length);
        const square = availableSquares.splice(idx, 1)[0];
        
        if (!square) continue;

        const duration = 800 + Math.random() * 1200;
        
        // Apply animation styles
        square.style.cssText += `
          background-color: rgba(0, 255, 136, 0.8);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
          transform: scale(1.05);
          animation: gridPulse ${duration}ms ease-in-out;
        `;
        
        activeSquares.add(square);

        // Reset square after animation
        setTimeout(() => {
          if (square) {
            square.style.cssText = square.style.cssText.split('animation:')[0];
            square.style.backgroundColor = 'transparent';
            square.style.boxShadow = 'none';
            square.style.transform = 'scale(1)';
            activeSquares.delete(square);
          }
        }, duration);
      }
    };

    // Start animation loop
    animationRef.current = setInterval(animate, animationSpeed);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [size, speed, intensity, config.gridSize, config.containerSize, animationSpeed]);

  const containerClasses = `
    relative 
    inline-flex 
    flex-col 
    items-center 
    justify-center 
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {/* Grid Container */}
      <div className="relative">
        {/* Grid background */}
        <div 
          className="grid-loader-background"
          style={{
            width: `${config.containerSize}px`,
            height: `${config.containerSize}px`,
            backgroundImage: `
              linear-gradient(to right, rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${config.gridSize}px ${config.gridSize}px`,
            borderRadius: '8px',
            position: 'relative'
          }}
        >
          {/* Animated squares container */}
          <div 
            ref={containerRef}
            className="absolute inset-0"
            style={{
              overflow: 'hidden',
              borderRadius: '8px'
            }}
          />
          
          {/* Corner fade effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(
                circle at center,
                transparent 30%,
                rgba(0, 0, 0, 0.3) 100%
              )`,
              borderRadius: '8px'
            }}
          />
        </div>
      </div>

      {/* Loading message */}
      {showMessage && message && (
        <div className="mt-4 text-center text-green-400 text-sm font-medium animate-pulse">
          {message}
        </div>
      )}

      <style jsx>{`
        @keyframes gridPulse {
          0% { 
            background-color: transparent;
            box-shadow: 0 0 0px rgba(0, 255, 136, 0.5);
            transform: scale(1);
          }
          50% { 
            background-color: rgba(0, 255, 136, 0.8);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.7);
            transform: scale(1.1);
          }
          100% { 
            background-color: transparent;
            box-shadow: 0 0 0px rgba(0, 255, 136, 0.5);
            transform: scale(1);
          }
        }

        .grid-loader-square.pulse {
          animation: gridPulse 1.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Export simplified version for inline use
export const GridLoader = ({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}) => (
  <GridLoadingAnimation 
    size={size} 
    className={className}
    showMessage={false}
  />
);

export default GridLoadingAnimation;
