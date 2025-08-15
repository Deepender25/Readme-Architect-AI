"use client";

import React from 'react';
import ThinGreenGridBackground from './thin-green-grid-background';
import TechLogosBackground from './tech-logos-background';
import CSSSparklesBackground from './css-sparkles-background';
import MouseCursorGlow from './mouse-cursor-glow';

interface EnhancedBackgroundWrapperProps {
  children: React.ReactNode;
  showTechLogos?: boolean;
  showSparkles?: boolean;
  showMouseGlow?: boolean;
  logoCount?: number;
  className?: string;
}

export default function EnhancedBackgroundWrapper({
  children,
  showTechLogos = true,
  showSparkles = true,
  showMouseGlow = true,
  logoCount = 20,
  className = ""
}: EnhancedBackgroundWrapperProps) {
  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
      {/* Base thin green grid layer */}
      <div className="absolute inset-0 z-10">
        <ThinGreenGridBackground />
      </div>
      
      {/* CSS Sparkles layer */}
      {showSparkles && (
        <div className="absolute inset-0 z-15">
          <CSSSparklesBackground />
        </div>
      )}
      
      {/* Interactive tech logos layer */}
      {showTechLogos && (
        <div className="absolute inset-0 z-20">
          <TechLogosBackground
            logoCount={logoCount}
            movementSpeed={0.2}
            mouseInfluence={140}
            backgroundColor="transparent"
            mouseGravity="attract"
            gravityStrength={25}
          />
        </div>
      )}

      {/* Mouse cursor glow effect */}
      {showMouseGlow && <MouseCursorGlow />}
      
      {/* Subtle overlay to ensure content remains readable */}
      <div className="absolute inset-0 z-30 bg-gradient-to-br from-black/10 via-transparent to-black/20 pointer-events-none" />
      
      {/* Professional depth effect */}
      <div className="absolute inset-0 z-5">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, rgba(0, 255, 136, 0.08) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-40">
        {children}
      </div>
    </div>
  );
}
