'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function EnhancedGridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined') {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Main thin grid pattern - covers entire viewport and beyond */}
      <motion.div
        className="absolute w-[200vw] h-[200vh] opacity-40"
        style={{
          left: '-50vw',
          top: '-50vh',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '40px 40px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Secondary thinner grid for more detail */}
      <motion.div
        className="absolute w-[200vw] h-[200vh] opacity-25"
        style={{
          left: '-50vw',
          top: '-50vh',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.2) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.2) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '20px 20px',
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
        animate={{
          backgroundPosition: ['20px 20px', '0% 0%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Ultra-fine grid for texture */}
      <motion.div
        className="absolute w-[200vw] h-[200vh] opacity-10"
        style={{
          left: '-50vw',
          top: '-50vh',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.04) 0.25px, transparent 0.25px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.04) 0.25px, transparent 0.25px)
          `,
          backgroundSize: '10px 10px',
          transform: `translateY(${scrollY * 0.02}px)`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '10px 10px'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Large grid pattern for depth */}
      <motion.div
        className="absolute w-[200vw] h-[200vh] opacity-15"
        style={{
          left: '-50vw',
          top: '-50vh',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
        animate={{
          backgroundPosition: ['80px 80px', '0% 0%'],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Subtle edge fade overlay - top */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />
      
      {/* Subtle edge fade overlay - bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />
      
      {/* Subtle edge fade overlay - left */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />
      
      {/* Subtle edge fade overlay - right */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* Interactive mouse glow that follows cursor */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.02) 50%, transparent 70%)',
          left: `${mousePosition.x * 100}vw`,
          top: `${mousePosition.y * 100}vh`,
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Breathing effect overlay for subtle animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.01) 0%, transparent 70%)',
          zIndex: 0,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
