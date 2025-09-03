"use client";

import React from 'react';

interface LoadingAnimationProps {
  message?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Generating README..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="typewriter-container">
        <div className="typewriter-alt">
          <div className="slide">
            <i></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>
      {message && (
        <div className="mt-6 text-center text-gray-400 text-sm font-medium">
          {message}
        </div>
      )}
      
      <style jsx>{`
        .typewriter-container {
          transform: scale(0.75);
          transform-origin: center;
        }
        
        @media (min-width: 768px) {
          .typewriter-container {
            transform: scale(0.9);
          }
        }
        
        @media (min-width: 1024px) {
          .typewriter-container {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};