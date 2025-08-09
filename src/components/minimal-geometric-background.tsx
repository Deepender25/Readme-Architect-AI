"use client";

import React from 'react';
import AnimatedGeometricBackground from './animated-geometric-background';

export const MinimalGridBackground = () => {
  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full" style={{ minHeight: '100vh', minWidth: '100vw' }}>
        <AnimatedGeometricBackground />
      </div>
    </div>
  );
};

export default MinimalGridBackground;