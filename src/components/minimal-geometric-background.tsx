"use client";

import React from 'react';

export const MinimalGridBackground = () => {
  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.015) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            minHeight: '100vh',
            minWidth: '100vw'
          }}
        />
      </div>
    </div>
  );
};

export default MinimalGridBackground;