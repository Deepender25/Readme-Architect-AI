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
      mutationTimeout = setTimeout(updateHeight, 100); // Shorter delay for better responsiveness
    });
    
    // Observe changes that might affect height
    if (document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true, // Observe deep changes for content updates
        attributes: false // Don't observe attribute changes
      });
    }

    // Force update on scroll to catch dynamic content
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateHeight, 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(updateTimeout);
      clearTimeout(resizeTimeout);
      clearTimeout(mutationTimeout);
      clearTimeout(scrollTimeout);
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('scroll', handleScroll);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div 
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ 
        zIndex: 0,
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
      
      {/* Main grid pattern - smaller squares like reference */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0',
          zIndex: 2
        }}
      />
      
      {/* Secondary finer grid - smaller detail */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.06) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.06) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '15px 15px',
          backgroundPosition: '0 0',
          zIndex: 2
        }}
      />
      
      {/* Enhanced fade effect - dramatic variations like reference */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 25% 20%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 12%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.1) 40%, transparent 60%),
            radial-gradient(ellipse at 75% 30%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.55) 15%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.08) 45%, transparent 65%),
            radial-gradient(circle at 40% 70%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 18%, rgba(0,0,0,0.2) 35%, transparent 55%),
            radial-gradient(ellipse at 15% 60%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 16%, rgba(0,0,0,0.15) 32%, transparent 50%),
            radial-gradient(circle at 85% 80%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 14%, rgba(0,0,0,0.12) 30%, transparent 48%),
            radial-gradient(ellipse at 60% 15%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 13%, rgba(0,0,0,0.1) 28%, transparent 45%),
            radial-gradient(circle at 10% 35%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 17%, rgba(0,0,0,0.08) 35%, transparent 52%),
            radial-gradient(ellipse at 90% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 19%, transparent 40%),
            linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 15%, rgba(0,0,0,0.4) 35%, transparent 50%, rgba(0,0,0,0.3) 70%, transparent 85%),
            linear-gradient(-45deg, transparent 0%, rgba(0,0,0,0.35) 20%, transparent 40%, rgba(0,0,0,0.25) 60%, transparent 80%)
          `,
          zIndex: 3
        }}
      />
      
      {/* Subtle highlight areas - gentle grid enhancement */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 55% 45%, rgba(0, 255, 136, 0.03) 0%, rgba(0, 255, 136, 0.015) 30%, transparent 60%),
            radial-gradient(ellipse at 25% 75%, rgba(0, 255, 136, 0.025) 0%, transparent 45%),
            radial-gradient(circle at 75% 25%, rgba(0, 255, 136, 0.02) 0%, transparent 35%)
          `,
          zIndex: 4
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
