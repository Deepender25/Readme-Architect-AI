"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimatedDivProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export const ScrollAnimatedDiv: React.FC<ScrollAnimatedDivProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.3, // Reduced duration for faster animations
  yOffset = 20, // Reduced offset for subtler movement
  threshold = 0.05, // Lower threshold for earlier triggering
  triggerOnce = true,
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        y: yOffset,
      }}
      animate={isVisible ? { 
        opacity: 1, 
        y: 0,
      } : { 
        opacity: 0, 
        y: yOffset,
      }}
      transition={{
        duration,
        delay: Math.min(delay, 0.1), // Cap delay at 0.1s for responsiveness
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
        type: "tween", // Use tween instead of spring for consistency
      }}
    >
      {children}
    </motion.div>
  );
};