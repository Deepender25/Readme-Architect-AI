"use client";

import React from 'react';

// Generate random particles that cover the full screen width
const generateParticles = (count: number) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 3 : 3240; // 3x screen height for long pages
    const x = Math.floor(Math.random() * maxWidth); // Full screen width
    const y = Math.floor(Math.random() * maxHeight); // Extended height for long pages
    particles.push(`${x}px ${y}px #fff`);
  }
  return particles.join(', ');
};

export default function CSSSparklesBackground() {
  // Generate particles for each layer
  const particle1Shadow = generateParticles(100);
  const particle1AfterShadow = generateParticles(80);
  const particle2Shadow = generateParticles(120);
  const particle2AfterShadow = generateParticles(90);
  const particle3AfterShadow = generateParticles(150);
  const particle4Shadow = generateParticles(200);
  const particle4AfterShadow = generateParticles(100);

  return (
    <div className="animation-wrapper">
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      
      <style jsx>{`
        .animation-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle, .particle:after {
          background: transparent;
        }

        .particle:after {
          position: absolute;
          content: "";
          top: 3240px;
        }

        .particle-1 {
          animation: animParticle 60s linear infinite;
          box-shadow: ${particle1Shadow};
          border-radius: 50%;
          height: 2px;
          width: 2px;
        }

        .particle-1:after {
          box-shadow: ${particle1AfterShadow};
          height: 2px;
          width: 2px;
        }

        .particle-2 {
          animation: animParticle 120s linear infinite;
          box-shadow: ${particle2Shadow};
          border-radius: 50%;
          height: 2px;
          width: 2px;
        }

        .particle-2:after {
          box-shadow: ${particle2AfterShadow};
          height: 3px;
          width: 3px;
        }

        .particle-3:after {
          box-shadow: ${particle3AfterShadow};
          height: 3px;
          width: 3px;
          border-radius: 50%;
        }

        .particle-4 {
          animation: animParticle 200s linear infinite;
          box-shadow: ${particle4Shadow};
          border-radius: 50%;
          height: 1px;
          width: 1px;
        }

        .particle-4:after {
          box-shadow: ${particle4AfterShadow};
          height: 1px;
          width: 1px;
        }

        @keyframes animParticle {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-3240px);
          }
        }
      `}</style>
    </div>
  );
}
