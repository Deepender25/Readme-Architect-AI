"use client";

import React from 'react';

interface LoadingAnimationProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Generating README...",
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20', 
    lg: 'w-28 h-28'
  };

  const cubeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      {/* Cube Loading Animation */}
      <div className="loading-container">
        <div className={`cube-loader ${sizeClasses[size]}`}>
          <div className={`cube ${cubeClasses[size]}`}></div>
          <div className={`cube ${cubeClasses[size]}`}></div>
          <div className={`cube ${cubeClasses[size]}`}></div>
          <div className={`cube ${cubeClasses[size]}`}></div>
        </div>
      </div>
      
      {message && (
        <div className="mt-6 text-center text-green-400 text-sm font-medium">
          {message}
        </div>
      )}
      
      <style jsx>{`
        /* Centering the loader */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        /* Loader container */
        .cube-loader {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          transform: rotate(45deg);
          animation: rotateLoader 2s cubic-bezier(0.6, 0.2, 0.1, 1) infinite;
        }

        /* Cubes with green theme */
        .cube {
          background: linear-gradient(145deg, #00ff88, #00cc6a);
          border-radius: 8px;
          box-shadow:
            0 0 12px rgba(0, 255, 136, 0.6),
            inset 0 0 8px rgba(0, 255, 136, 0.8),
            inset 3px 3px 8px rgba(0, 100, 60, 0.4);
          animation: pulse 1.6s ease-in-out infinite;
          transition: transform 0.4s ease;
        }

        /* Smooth scaling animation */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 15px rgba(0, 255, 136, 0.7),
              inset 0 0 8px rgba(0, 255, 136, 0.8);
          }
          50% {
            transform: scale(1.3);
            box-shadow:
              0 0 25px rgba(0, 255, 136, 1),
              inset 0 0 12px rgba(0, 255, 136, 1);
          }
        }

        /* Rotating loader animation */
        @keyframes rotateLoader {
          0% {
            transform: rotate(45deg);
          }
          50% {
            transform: rotate(225deg);
          }
          100% {
            transform: rotate(405deg);
          }
        }

        /* Staggered animation for individual cubes */
        .cube:nth-child(1) {
          animation-delay: 0s;
        }
        .cube:nth-child(2) {
          animation-delay: 0.2s;
        }
        .cube:nth-child(3) {
          animation-delay: 0.4s;
        }
        .cube:nth-child(4) {
          animation-delay: 0.6s;
        }

        /* Responsive scaling */
        @media (max-width: 768px) {
          .cube-loader {
            gap: 4px;
          }
          .cube {
            border-radius: 6px;
          }
        }

        @media (min-width: 1024px) {
          .cube-loader {
            gap: 8px;
          }
          .cube {
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
};