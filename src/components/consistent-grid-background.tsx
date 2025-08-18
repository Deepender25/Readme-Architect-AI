'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OptimizedThinGridBackground from './optimized-thin-grid-background';

interface ConsistentGridBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  showMouseEffects?: boolean;
  className?: string;
}

export default function ConsistentGridBackground({ 
  intensity = 'medium',
  animated = true,
  showMouseEffects = true,
  className = ''
}: ConsistentGridBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    // Set initial window size
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined') {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      }
    };

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    if (typeof window !== 'undefined' && showMouseEffects) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showMouseEffects]);

  return (
    <div className={`consistent-grid-background absolute inset-0 overflow-hidden ${className}`}>
      {/* Core grid background - optimized for scrolling */}
      <OptimizedThinGridBackground intensity={intensity} animated={animated} />
      
      {/* Subtle static glow effects */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div 
          className="absolute rounded-full w-[600px] h-[600px] blur-[100px] opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 136, 1) 0%, transparent 70%)',
            top: '-200px',
            left: '-200px',
          }}
        />
        
        <div 
          className="absolute rounded-full w-[500px] h-[500px] blur-[100px] opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 136, 1) 0%, transparent 70%)',
            bottom: '-200px',
            right: '-200px',
          }}
        />
      </div>
      
      {/* Interactive mouse effects */}
      {showMouseEffects && (
        <>
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none z-[2]"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 136, 0.04) 0%, rgba(0, 255, 136, 0.02) 40%, transparent 70%)',
              left: mousePosition.x * windowSize.width - 200,
              top: mousePosition.y * windowSize.height - 200,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full pointer-events-none z-[2]"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 136, 0.03) 0%, transparent 60%)',
              left: mousePosition.x * windowSize.width - 100,
              top: mousePosition.y * windowSize.height - 100,
            }}
            animate={{
              scale: [1.2, 0.8, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Subtle edge vignette for improved content readability */}
      <div 
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 70%, rgba(0, 0, 0, 0.2) 100%)
          `,
        }}
      />
    </div>
  );
}
