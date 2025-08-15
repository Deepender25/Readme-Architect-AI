"use client";

import React from 'react';
import ThinGreenGridBackground from './thin-green-grid-background';
import FloatingParticlesBackground from './floating-particles-background';

export default function ProfessionalBackground() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* Base thin green grid layer */}
      <div className="absolute inset-0 z-10">
        <ThinGreenGridBackground />
      </div>
      
      {/* Interactive floating particles layer */}
      <div className="absolute inset-0 z-20">
        <FloatingParticlesBackground
          particleCount={35}
          particleSize={3}
          particleOpacity={0.4}
          glowIntensity={8}
          movementSpeed={0.3}
          mouseInfluence={150}
          backgroundColor="transparent"
          particleColor="#00FF88"
          mouseGravity="attract"
          gravityStrength={30}
          particleInteraction={true}
          interactionType="bounce"
        />
      </div>

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
    </div>
  );
}
