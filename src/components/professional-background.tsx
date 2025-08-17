'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ProfessionalBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    // Set initial window size
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined') {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      }
    };

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div className="professional-background enhanced-grid-background absolute inset-0 overflow-hidden">
      {/* Deep black gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      {/* Enhanced animated grid pattern - Primary */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Secondary grid for depth */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />
      
      {/* Tertiary fine grid */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '50% 50%'],
        }}
        transition={{
          duration: 100,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Quaternary ultra-fine grid for texture */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['25% 25%', '75% 75%'],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      />

      {/* Enhanced floating orbs - Reduced for mobile performance */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${200 + i * 40}px`,
              height: `${200 + i * 40}px`,
              background: `radial-gradient(circle, rgba(0, 255, 136, ${0.08 - i * 0.01}) 0%, transparent 70%)`,
              left: `${15 + i * 12}%`,
              top: `${8 + i * 10}%`,
            }}
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -40, 40, 0],
              scale: [1, 1.15, 0.85, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Enhanced interactive mouse glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.12) 0%, rgba(0, 255, 136, 0.06) 40%, transparent 70%)',
          left: mousePosition.x * windowSize.width - 250,
          top: mousePosition.y * windowSize.height - 250,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary mouse glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 60%)',
          left: mousePosition.x * windowSize.width - 150,
          top: mousePosition.y * windowSize.height - 150,
        }}
        animate={{
          scale: [1.2, 0.8, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Enhanced gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-transparent" />
    </div>
  );
}