"use client";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface UniversalAnimatedBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  enableScrollParallax?: boolean;
  enableMouseEffects?: boolean;
}

export default function UniversalAnimatedBackground({
  children,
  className,
  intensity = 'medium',
  enableScrollParallax = true,
  enableMouseEffects = false, // Disabled since we removed mouse effects
}: UniversalAnimatedBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  
  // Scroll-based transformations for parallax effect
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -50]);
  const gridY = useTransform(scrollY, [0, 1000], [0, 30]);

  // Intensity settings
  const intensitySettings = {
    low: {
      numSquares: 25,
      maxOpacity: 0.08,
      duration: 5,
      repeatDelay: 1.5,
      glowOpacity: 0.05,
    },
    medium: {
      numSquares: 40,
      maxOpacity: 0.15,
      duration: 3,
      repeatDelay: 1,
      glowOpacity: 0.08,
    },
    high: {
      numSquares: 60,
      maxOpacity: 0.25,
      duration: 2.5,
      repeatDelay: 0.5,
      glowOpacity: 0.12,
    },
  };

  const settings = intensitySettings[intensity];

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {/* Base dark background */}
      <div className="fixed inset-0 bg-black z-0" />
      
      {/* Animated Grid Pattern Background - Reduced for balance */}
      <motion.div
        className="fixed inset-0 z-0 opacity-60"
        style={{
          y: enableScrollParallax && !isMobile ? backgroundY : 0,
        }}
      >
        <AnimatedGridPattern
          numSquares={isMobile ? Math.floor(settings.numSquares * 0.4) : Math.floor(settings.numSquares * 0.6)}
          maxOpacity={isMobile ? settings.maxOpacity * 0.4 : settings.maxOpacity * 0.6}
          duration={settings.duration * 1.5}
          repeatDelay={settings.repeatDelay * 1.5}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
            "fill-green-400/10 stroke-green-400/10"
          )}
        />
      </motion.div>

      {/* Grid Layer with Edge Fade */}
      <motion.div
        className="fixed inset-0 z-0 opacity-80"
        style={{
          y: enableScrollParallax && !isMobile ? gridY : 0,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? '50px 50px' : '60px 60px',
            mask: `
              radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%),
              linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
            `,
            maskComposite: 'intersect',
            WebkitMask: `
              radial-gradient(ellipse 80% 70% at center, black 40%, transparent 100%),
              linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
              linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
            `,
            WebkitMaskComposite: 'source-in',
          }}
        />
      </motion.div>

      {/* Grid-Aligned Animated Squares in Groups */}
      <div className="fixed inset-0 z-0 pointer-events-none will-change-auto">
        {Array.from({ length: isMobile ? 8 : 12 }).map((_, groupIndex) => {
          const gridSize = isMobile ? 50 : 60;
          const squareSize = gridSize - 2; // Slightly smaller than grid cell
          
          // Create groups of 2-4 squares
          const groupSize = 2 + Math.floor(Math.random() * 3); // 2-4 squares per group
          const groupCenterX = 2 + Math.floor(Math.random() * (window?.innerWidth ? Math.floor((window.innerWidth * 0.8) / gridSize) : 20));
          const groupCenterY = 2 + Math.floor(Math.random() * (window?.innerHeight ? Math.floor((window.innerHeight * 0.8) / gridSize) : 15));
          
          const groupDelay = Math.random() * 12; // 0-12 seconds delay between groups
          const groupDuration = 4 + Math.random() * 3; // 4-7 seconds duration
          const groupPause = 4 + Math.random() * 6; // 4-10 seconds pause
          
          return Array.from({ length: groupSize }).map((_, squareIndex) => {
            const greenShades = [
              'rgba(0, 255, 136, 0.08)',  // Light green
              'rgba(0, 255, 136, 0.12)',  // Medium light green
              'rgba(0, 255, 136, 0.10)',  // Soft green
              'rgba(0, 255, 136, 0.15)',  // Medium green
              'rgba(0, 255, 136, 0.09)',  // Balanced green
              'rgba(0, 255, 136, 0.13)',  // Medium bright green
            ];
            
            // Position squares in a small cluster around group center
            const offsetX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const offsetY = Math.floor(Math.random() * 3) - 1;
            const squareGridX = groupCenterX + offsetX;
            const squareGridY = groupCenterY + offsetY;
            
            // Convert grid position to pixel position
            const pixelX = squareGridX * gridSize;
            const pixelY = squareGridY * gridSize;
            
            const randomShade = greenShades[Math.floor(Math.random() * greenShades.length)];
            const squareDelay = groupDelay + (squareIndex * 0.2); // Slight stagger within group
            
            // Create lighter border color
            const borderColor = randomShade.replace(/0\.(\d+)\)/, (match, opacity) => {
              const newOpacity = Math.max(0.02, parseFloat(`0.${opacity}`) * 0.3);
              return `${newOpacity.toFixed(2)})`;
            });
            
            return (
              <motion.div
                key={`grid-square-group-${groupIndex}-${squareIndex}`}
                className="absolute"
                style={{
                  left: `${pixelX}px`,
                  top: `${pixelY}px`,
                  width: `${squareSize}px`,
                  height: `${squareSize}px`,
                  background: randomShade,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  willChange: 'opacity, transform',
                  transform: 'translateZ(0)',
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: [0, 0.9, 1, 0.9, 0],
                  scale: [0.7, 1, 1.02, 1, 0.7],
                }}
                transition={{
                  duration: groupDuration,
                  delay: squareDelay,
                  repeat: Infinity,
                  repeatDelay: groupPause,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.5, 0.7, 1],
                }}
              />
            );
          });
        })}
      </div>

      {/* Subtle Fine Grid */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.06) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.06) 0.5px, transparent 0.5px)
          `,
          backgroundSize: isMobile ? '25px 25px' : '30px 30px',
        }}
      />


      {/* Enhanced Ambient Glow Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Main large glow orb */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-green-400/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.8, 0.4],
            x: [-30, 30, -30],
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Secondary glow orb */}
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] bg-green-400/6 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [20, -20, 20],
            y: [15, -15, 15],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Additional center glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/4 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Corner accent glows */}
        <motion.div
          className="absolute top-0 right-0 w-[250px] h-[250px] bg-green-400/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-green-400/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle Edge Gradients for Better Content Contrast */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          }}
        />
        {/* Side gradients for ultra-wide screens */}
        <div
          className="absolute top-0 left-0 bottom-0 w-16"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-16"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Breathing Effect for Subtle Animation */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.01) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
