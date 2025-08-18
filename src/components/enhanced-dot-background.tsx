'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedDotBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  dotColor?: string;
  dotSize?: string;
  spacing?: string;
  enableScrollEffect?: boolean;
}

export default function EnhancedDotBackground({
  children,
  className,
  dotColor = '#404040',
  dotSize = '1px',
  spacing = '20px',
  enableScrollEffect = true
}: EnhancedDotBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Transform scroll position to background position
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '10%']);
  const backgroundX = useTransform(scrollY, [0, 1000], ['0%', '5%']);
  
  // Transform scroll position to opacity for fade effect
  const dotOpacity = useTransform(scrollY, [0, 300, 600], [0.6, 0.4, 0.2]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined') {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div className={cn("relative min-h-screen w-full bg-black", className)}>
      {/* Primary Dot Pattern Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundSize: `${spacing} ${spacing}`,
          backgroundImage: `radial-gradient(${dotColor} ${dotSize}, transparent ${dotSize})`,
          backgroundPosition: enableScrollEffect ? backgroundX : '0%',
          opacity: enableScrollEffect ? dotOpacity : 0.6,
        }}
        animate={enableScrollEffect ? {
          backgroundPosition: ['0% 0%', '100% 100%'],
        } : {}}
        transition={enableScrollEffect ? {
          duration: 60,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        } : {}}
      />
      
      {/* Secondary Dot Pattern for Depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundSize: `${parseInt(spacing) * 2}px ${parseInt(spacing) * 2}px`,
          backgroundImage: `radial-gradient(${dotColor} 0.5px, transparent 0.5px)`,
          backgroundPosition: enableScrollEffect ? backgroundY : '0%',
          opacity: enableScrollEffect ? 0.3 : 0.4,
        }}
        animate={enableScrollEffect ? {
          backgroundPosition: ['100% 100%', '0% 0%'],
        } : {}}
        transition={enableScrollEffect ? {
          duration: 80,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        } : {}}
      />

      {/* Interactive Mouse Glow Effect */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 40%, transparent 70%)`,
          left: mousePosition.x * (typeof window !== 'undefined' ? window.innerWidth : 1920) - 200,
          top: mousePosition.y * (typeof window !== 'undefined' ? window.innerHeight : 1080) - 200,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Radial Gradient Mask for Faded Look */}
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Enhanced Grid Lines for Premium Look */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: enableScrollEffect ? backgroundX : '0%',
        }}
        animate={enableScrollEffect ? {
          backgroundPosition: ['0% 0%', '50% 50%'],
        } : {}}
        transition={enableScrollEffect ? {
          duration: 100,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        } : {}}
      />

      {/* Floating Orbs for Depth */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${150 + i * 30}px`,
              height: `${150 + i * 30}px`,
              background: `radial-gradient(circle, rgba(0, 255, 136, ${0.05 - i * 0.008}) 0%, transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Utility function to create the utils if it doesn't exist
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}