"use client";

import React from 'react';

export default function ThinGreenGridBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Main Grid Container */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          // Add a subtle animation to make it more dynamic
          animation: 'gridShift 30s ease-in-out infinite'
        }}
      />
      
      {/* Overlay thinner grid for more detail */}
      <div 
        className="absolute inset-0 w-full h-full opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
          animation: 'gridShift 20s ease-in-out infinite reverse'
        }}
      />

      {/* Ultra-fine grid for texture */}
      <div 
        className="absolute inset-0 w-full h-full opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 136, 0.3) 0.5px, transparent 0.5px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.3) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '10px 10px'
        }}
      />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-20" />
      
      {/* Breathing glow effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.3) 0%, transparent 70%)`,
          animation: 'breathe 8s ease-in-out infinite'
        }}
      />

      <style jsx>{`
        @keyframes gridShift {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(2px, -1px);
            opacity: 0.2;
          }
          50% {
            transform: translate(-1px, 2px);
            opacity: 0.4;
          }
          75% {
            transform: translate(1px, -2px);
            opacity: 0.25;
          }
        }

        @keyframes breathe {
          0%, 100% {
            opacity: 0.03;
            transform: scale(1);
          }
          50% {
            opacity: 0.08;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
