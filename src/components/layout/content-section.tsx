'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
  background?: 'default' | 'glass' | 'gradient' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  animate?: boolean;
  delay?: number;
}

export default function ContentSection({
  children,
  className = '',
  background = 'default',
  padding = 'lg',
  maxWidth = '7xl',
  animate = true,
  delay = 0
}: ContentSectionProps) {
  const backgroundClasses = {
    default: '',
    glass: 'glass-card',
    gradient: 'bg-gradient-to-br from-green-400/5 to-green-600/5 border border-green-400/20',
    none: ''
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const content = (
    <div
      className={`
        ${backgroundClasses[background]}
        ${paddingClasses[padding]}
        ${background !== 'none' ? 'rounded-2xl' : ''}
        ${className}
      `}
    >
      <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
        {children}
      </div>
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {content}
    </motion.div>
  );
}