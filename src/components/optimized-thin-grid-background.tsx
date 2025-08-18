"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface OptimizedThinGridBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export default function OptimizedThinGridBackground({ 
  intensity = 'medium',
  animated = true,
  className = ''
}: OptimizedThinGridBackgroundProps) {
  const [isClient, setIsClient] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(1080);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const updateViewportHeight = () => {
      if (typeof window !== 'undefined') {
        // Calculate total document height including scrollable content
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        setViewportHeight(Math.max(documentHeight, window.innerHeight));
      }
    };

    updateViewportHeight();

    // Update viewport height on resize and content changes
    const handleResize = () => {
      setTimeout(updateViewportHeight, 100); // Debounce for performance
    };

    const handleScroll = () => {
      // Update height if content has changed during scroll
      requestAnimationFrame(updateViewportHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Observer for content changes
    const observer = new MutationObserver(() => {
      setTimeout(updateViewportHeight, 100);
    });
    
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const intensitySettings = {
    low: {
      primaryOpacity: 0.15,
      secondaryOpacity: 0.08,
      tertiaryOpacity: 0.04,
      primarySize: 80,
      secondarySize: 40,
      tertiarySize: 20,
    },
    medium: {
      primaryOpacity: 0.25,
      secondaryOpacity: 0.12,
      tertiaryOpacity: 0.06,
      primarySize: 60,
      secondarySize: 30,
      tertiarySize: 15,
    },
    high: {
      primaryOpacity: 0.35,
      secondaryOpacity: 0.18,
      tertiaryOpacity: 0.09,
      primarySize: 40,
      secondarySize: 20,
      tertiarySize: 10,
    }
  };

  const settings = intensitySettings[intensity];

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div 
      ref={backgroundRef}
      className={`fixed inset-0 w-full pointer-events-none overflow-hidden ${className}`}
      style={{ 
        height: `${viewportHeight}px`,
        zIndex: -1 // Ensure it's behind all content
      }}
    >
      {/* Base black background with subtle gradient */}
      <div 
        className="absolute inset-0 w-full"
        style={{
          height: `${viewportHeight}px`,
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0a0a0a 75%, #000000 100%)'
        }}
      />

      {/* Primary Grid Layer - Main structure */}
      <motion.div
        className="absolute inset-0 w-full"
        style={{
          height: `${viewportHeight}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, ${settings.primaryOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, ${settings.primaryOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${settings.primarySize}px ${settings.primarySize}px`,
          backgroundRepeat: 'repeat',
        }}
        animate={animated ? {
          backgroundPositionX: ['0px', `${settings.primarySize}px`],
          backgroundPositionY: ['0px', `${settings.primarySize}px`],
        } : {}}
        transition={animated ? {
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        } : {}}
      />

      {/* Secondary Grid Layer - Medium detail */}
      <motion.div
        className="absolute inset-0 w-full"
        style={{
          height: `${viewportHeight}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, ${settings.secondaryOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, ${settings.secondaryOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${settings.secondarySize}px ${settings.secondarySize}px`,
          backgroundRepeat: 'repeat',
        }}
        animate={animated ? {
          backgroundPositionX: [`${settings.secondarySize}px`, '0px'],
          backgroundPositionY: [`${settings.secondarySize}px`, '0px'],
        } : {}}
        transition={animated ? {
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        } : {}}
      />

      {/* Tertiary Grid Layer - Fine detail */}
      <motion.div
        className="absolute inset-0 w-full"
        style={{
          height: `${viewportHeight}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, ${settings.tertiaryOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, ${settings.tertiaryOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${settings.tertiarySize}px ${settings.tertiarySize}px`,
          backgroundRepeat: 'repeat',
        }}
        animate={animated ? {
          backgroundPositionX: ['0px', `${settings.tertiarySize / 2}px`],
          backgroundPositionY: ['0px', `${settings.tertiarySize / 2}px`],
        } : {}}
        transition={animated ? {
          duration: 80,
          repeat: Infinity,
          ease: 'linear',
        } : {}}
      />

      {/* Accent Lines - Occasional brighter lines for visual interest */}
      <div
        className="absolute inset-0 w-full"
        style={{
          height: `${viewportHeight}px`,
          backgroundImage: `
            linear-gradient(to right, transparent 0%, transparent 49.8%, rgba(0, 255, 136, 0.4) 50%, rgba(0, 255, 136, 0.4) 50.2%, transparent 50.4%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, transparent 49.8%, rgba(0, 255, 136, 0.4) 50%, rgba(0, 255, 136, 0.4) 50.2%, transparent 50.4%, transparent 100%)
          `,
          backgroundSize: `${settings.primarySize * 8}px ${settings.primarySize * 8}px`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Subtle pulse effect overlay */}
      {animated && (
        <motion.div
          className="absolute inset-0 w-full"
          style={{
            height: `${viewportHeight}px`,
            background: `
              radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 255, 136, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, rgba(0, 255, 136, 0.03) 0%, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Noise texture for additional depth - only on larger screens */}
      <div 
        className="absolute inset-0 w-full opacity-[0.008] mix-blend-overlay hidden md:block"
        style={{
          height: `${viewportHeight}px`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Edge gradients to prevent harsh cutoffs */}
      <div 
        className="absolute inset-0 w-full pointer-events-none"
        style={{
          height: `${viewportHeight}px`,
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, transparent 10%, transparent 90%, rgba(0, 0, 0, 0.3) 100%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 10%, transparent 90%, rgba(0, 0, 0, 0.2) 100%)
          `,
        }}
      />
    </div>
  );
}
