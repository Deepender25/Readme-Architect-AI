
'use client';

import React, { useEffect, useRef, useState } from 'react';

const DynamicGridBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<HTMLDivElement[]>([]);
  const activeSquaresRef = useRef<Set<HTMLDivElement>>(new Set());
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [gridSize, setGridSize] = useState(35);
  const [isVisible, setIsVisible] = useState(false);

  // Settings
  const speed = 2000;
  const intensity = 3;
  const brightness = 0.6;

  useEffect(() => {
    // Force visibility after component mounts
    setIsVisible(true);
    console.log('🎨 DynamicGridBackground mounted');

    const updateGridSize = () => {
      const newSize = window.innerWidth <= 768 ? 25 : 35;
      setGridSize(newSize);
      return newSize;
    };

    const createGrid = () => {
      if (!containerRef.current) {
        console.log('❌ Container ref not available');
        return;
      }
      
      // Clear existing content
      containerRef.current.innerHTML = '';
      squaresRef.current = [];
      activeSquaresRef.current.clear();

      const currentGridSize = updateGridSize();
      const cols = Math.ceil(window.innerWidth / currentGridSize) + 2;
      const rows = Math.ceil(window.innerHeight / currentGridSize) + 2;

      console.log('🎯 Creating grid:', cols, 'x', rows, 'with size', currentGridSize);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const square = document.createElement('div');
          square.style.position = 'absolute';
          square.style.width = `${currentGridSize}px`;
          square.style.height = `${currentGridSize}px`;
          square.style.left = `${col * currentGridSize}px`;
          square.style.top = `${row * currentGridSize}px`;
          square.style.backgroundColor = 'transparent';
          square.style.transition = 'all 0.3s ease';
          square.style.pointerEvents = 'none';
          square.style.zIndex = '2';

          containerRef.current.appendChild(square);
          squaresRef.current.push(square);
        }
      }

      console.log('✅ Grid created with', squaresRef.current.length, 'squares');
    };

    const animateRandom = () => {
      const availableSquares = squaresRef.current.filter(s => !activeSquaresRef.current.has(s));
      if (availableSquares.length === 0) return;

      const count = Math.min(intensity, availableSquares.length);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * availableSquares.length);
        const square = availableSquares.splice(idx, 1)[0];

        const duration = 1000 + Math.random() * 1500;
        
        // Apply pulse animation
        square.style.backgroundColor = `rgba(0, 255, 136, ${brightness})`;
        square.style.boxShadow = `0 0 20px rgba(0, 255, 136, ${brightness * 0.8})`;
        square.style.transform = 'scale(1.1)';
        square.style.borderRadius = '3px';

        activeSquaresRef.current.add(square);

        setTimeout(() => {
          square.style.backgroundColor = 'transparent';
          square.style.boxShadow = 'none';
          square.style.transform = 'scale(1)';
          square.style.borderRadius = '0';
          activeSquaresRef.current.delete(square);
        }, duration);
      }
    };

    const startAnimation = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      intervalIdRef.current = setInterval(animateRandom, speed);
      console.log('🎬 Animation started');
    };

    const handleResize = () => {
      console.log('📐 Window resized, recreating grid');
      createGrid();
    };

    // Initialize with delay to ensure DOM is ready
    setTimeout(() => {
      createGrid();
      startAnimation();
    }, 100);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{
        zIndex: -1,
        background: '#000000',
        display: 'block',
        visibility: 'visible'
      }}
    >
      {/* Test visibility div */}
      <div 
        className="absolute top-4 right-4 text-green-400 text-xs bg-black bg-opacity-50 p-2 rounded"
        style={{ zIndex: 1000 }}
      >
        Background Active ✓
      </div>
      
      {/* Grid Lines */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          zIndex: 1
        }}
      />
      
      {/* Animated Grid Squares */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ zIndex: 2 }}
      />
      
      {/* Corner Fade Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0, 0, 0, 0.6) 100%
          )`,
          zIndex: 3
        }}
      />
    </div>
  );
};

export default DynamicGridBackground;
