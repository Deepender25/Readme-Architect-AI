'use client';

import { memo, useEffect, useState } from 'react';

const EnhancedGridBackground = memo(function EnhancedGridBackground() {
  const [documentHeight, setDocumentHeight] = useState('100vh');

  useEffect(() => {
    let updateTimeout: NodeJS.Timeout;
    
    const updateHeight = () => {
      // Clear any pending update
      clearTimeout(updateTimeout);
      
      // Throttle updates to prevent excessive recalculations
      updateTimeout = setTimeout(() => {
        // Get the full document height including scrollable content
        const height = Math.max(
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight,
          document.documentElement.clientHeight,
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.body.clientHeight
        );
        
        // Only update if height has significantly changed (avoid micro-updates)
        const newHeight = `${height}px`;
        setDocumentHeight(prev => {
          const prevNum = parseInt(prev.replace('px', ''));
          const newNum = height;
          // Only update if difference is more than 50px to prevent excessive re-renders
          return Math.abs(newNum - prevNum) > 50 ? newHeight : prev;
        });
      }, 150); // Throttle to 150ms
    };

    // Initial height calculation
    updateHeight();

    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeight, 100);
    };

    // Update height on window resize with throttling
    window.addEventListener('resize', throttledResize);
    
    // Optimized mutation observer with debouncing
    let mutationTimeout: NodeJS.Timeout;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(updateHeight, 200); // Longer delay for DOM changes
    });
    
    // Only observe specific changes that might affect height
    if (document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: false, // Don't observe deep subtree changes for performance
        attributes: false // Don't observe attribute changes
      });
    }

    return () => {
      clearTimeout(updateTimeout);
      clearTimeout(resizeTimeout);
      clearTimeout(mutationTimeout);
      window.removeEventListener('resize', throttledResize);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div 
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ 
        zIndex: 1,
        height: documentHeight,
        minHeight: '100vh',
        minWidth: '100vw',
        overflow: 'hidden',
        willChange: 'auto',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Base gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #000000 50%, #0a0a0a 75%, #000000 100%)',
          zIndex: 1
        }}
      />
      
      {/* Main grid pattern - enhanced visibility */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
          zIndex: 2
        }}
      />
      
      {/* Secondary finer grid - enhanced visibility */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.08) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.08) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          zIndex: 2
        }}
      />
      
      {/* Dramatic fade overlay - creates random faded areas */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.8) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(0,0,0,0.7) 0%, transparent 35%),
            radial-gradient(circle at 60% 80%, rgba(0,0,0,0.6) 0%, transparent 45%),
            radial-gradient(circle at 15% 70%, rgba(0,0,0,0.5) 0%, transparent 30%),
            radial-gradient(ellipse at 90% 60%, rgba(0,0,0,0.4) 0%, transparent 50%),
            linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 20%, rgba(0,0,0,0.2) 60%, transparent 80%)
          `,
          zIndex: 2
        }}
      />
      
      {/* Highlight areas - subtle grid enhancement */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 40% 60%, rgba(0, 255, 136, 0.08) 0%, transparent 25%),
            radial-gradient(ellipse at 70% 30%, rgba(0, 255, 136, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 25% 85%, rgba(0, 255, 136, 0.05) 0%, transparent 20%)
          `,
          zIndex: 1
        }}
      />
      
      {/* Deep black header area for better readability */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.4) 70%, transparent 100%)',
          zIndex: 3,
        }}
      />
    </div>
  );
});

export default EnhancedGridBackground;
