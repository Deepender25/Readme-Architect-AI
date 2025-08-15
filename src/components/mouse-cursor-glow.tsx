"use client";

import React, { useEffect, useState } from 'react';

export default function MouseCursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Main cursor glow */}
      <div
        className="pointer-events-none fixed z-50 transition-opacity duration-300"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.03) 0%, rgba(0, 255, 136, 0.01) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Middle glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.03) 50%, transparent 80%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Inner glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.08) 60%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Core glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, rgba(0, 255, 136, 0.1) 70%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Subtle trailing effect */}
      <div
        className="pointer-events-none fixed z-40 transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 0.5 : 0,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(0, 255, 136, 0.02) 0%, transparent 60%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </>
  );
}
