'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { usePageTransition } from '@/lib/page-transition-context';

interface PageSlideWrapperProps {
  children: ReactNode;
}

export default function PageSlideWrapper({ children }: PageSlideWrapperProps) {
  const pathname = usePathname();
  const { isTransitioning, direction } = usePageTransition();
  const [animationClass, setAnimationClass] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isTransitioning) {
      // Slide out animation
      if (direction === 'left') {
        setAnimationClass('page-slide-out-left');
      } else if (direction === 'right') {
        setAnimationClass('page-slide-out-right');
      } else {
        setAnimationClass('page-fade-out');
      }
      
      // Hide content after slide out
      setTimeout(() => {
        setIsVisible(false);
      }, 400);
    } else {
      // Slide in animation
      setIsVisible(true);
      if (direction === 'left') {
        setAnimationClass('page-slide-in-left');
      } else if (direction === 'right') {
        setAnimationClass('page-slide-in-right');
      } else {
        setAnimationClass('page-fade-in');
      }
      
      // Clear animation class after completion
      setTimeout(() => {
        setAnimationClass('');
      }, 400);
    }
  }, [isTransitioning, direction]);

  // Reset on pathname change
  useEffect(() => {
    setIsVisible(true);
    setAnimationClass('page-entering');
    setTimeout(() => {
      setAnimationClass('');
    }, 400);
  }, [pathname]);

  return (
    <div className="page-transition-wrapper">
      <div className={`page-content ${animationClass}`}>
        {isVisible && children}
      </div>
    </div>
  );
}
