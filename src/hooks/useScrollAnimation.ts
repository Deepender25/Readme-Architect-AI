"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * Professional scroll animation hook
 * Provides smooth, performant scroll-triggered animations
 * 
 * @param options - Configuration options
 * @returns ref and visibility state
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1, // Trigger when 10% visible
    rootMargin = '0px 0px -50px 0px', // Trigger slightly before element enters viewport
    triggerOnce = true,
    delay = 0,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      // Apply delay if specified
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
        }, delay);
      } else {
        setIsVisible(true);
      }
      
      // Unobserve if triggerOnce is true
      if (triggerOnce && ref.current && observerRef.current) {
        observerRef.current.unobserve(ref.current);
      }
    } else if (!triggerOnce) {
      // Clear timeout if element leaves viewport
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    }
  }, [triggerOnce, delay]);

  useEffect(() => {
    if (!ref.current) return;

    // Create intersection observer with optimized settings
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(ref.current);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { ref, isVisible };
};

/**
 * Hook for staggered scroll animations
 * Useful for animating lists of items
 * 
 * @param index - Item index for stagger calculation
 * @param options - Configuration options
 * @returns ref and visibility state
 */
export const useStaggeredScrollAnimation = (
  index: number,
  options: UseScrollAnimationOptions = {}
) => {
  const staggerDelay = (options.delay || 0) + (index * 50); // 50ms between items
  
  return useScrollAnimation({
    ...options,
    delay: staggerDelay,
  });
};

/**
 * Hook for parallax scroll effects
 * Creates depth and dimension
 * 
 * @param speed - Parallax speed multiplier (0-1)
 * @returns ref and transform value
 */
export const useParallaxScroll = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax offset
      if (rect.top < windowHeight && rect.bottom > 0) {
        const parallaxOffset = (scrolled - elementTop) * speed;
        setOffset(parallaxOffset);
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return { ref, offset };
};