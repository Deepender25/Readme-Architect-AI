"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';

interface TechLogo {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  mass: number;
  id: number;
  type: string;
  rotation: number;
  rotationSpeed: number;
  color: string;
  hoverScale: number;
}


interface TechLogosBackgroundProps {
  logoCount?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  backgroundColor?: string;
  mouseGravity?: "none" | "attract" | "repel";
  gravityStrength?: number;
}

const techLogos = [
  // Development Tools
  { symbol: '⚡', color: '#F7DF1E', name: 'javascript', glow: true },
  { symbol: '⚛️', color: '#61DAFB', name: 'react', glow: true },
  { symbol: '📦', color: '#CB3837', name: 'npm', glow: false },
  { symbol: '🔧', color: '#F05032', name: 'git', glow: true },
  { symbol: '🐙', color: '#00FF88', name: 'github', glow: true },
  { symbol: '💻', color: '#007ACC', name: 'vscode', glow: true },
  
  // Languages & Frameworks
  { symbol: '🐍', color: '#3776AB', name: 'python', glow: true },
  { symbol: '🚀', color: '#00D8FF', name: 'node', glow: true },
  { symbol: '💎', color: '#CC342D', name: 'ruby', glow: true },
  { symbol: '☕', color: '#ED8B00', name: 'java', glow: true },
  { symbol: '🦀', color: '#CE422B', name: 'rust', glow: true },
  { symbol: '🔷', color: '#007ACC', name: 'typescript', glow: true },
  
  // Web Technologies
  { symbol: '🌐', color: '#E34F26', name: 'html', glow: false },
  { symbol: '🎨', color: '#1572B6', name: 'css', glow: false },
  { symbol: '📱', color: '#A4C639', name: 'mobile', glow: false },
  
  // DevOps & Tools
  { symbol: '⚙️', color: '#326CE5', name: 'kubernetes', glow: true },
  { symbol: '🐳', color: '#0db7ed', name: 'docker', glow: true },
  { symbol: '🔒', color: '#FF6B6B', name: 'security', glow: true },
  { symbol: '☁️', color: '#4285F4', name: 'cloud', glow: true },
  { symbol: '🗄️', color: '#336791', name: 'database', glow: true },
  { symbol: '📊', color: '#FF6384', name: 'analytics', glow: false },
  { symbol: '🔥', color: '#FFCA28', name: 'firebase', glow: true },
  { symbol: '⚗️', color: '#9B59B6', name: 'testing', glow: false },
];

export default function TechLogosBackground({
  logoCount = 25,
  movementSpeed = 0.3,
  mouseInfluence = 120,
  backgroundColor = "#0a0a0a",
  mouseGravity = "attract",
  gravityStrength = 30
}: TechLogosBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const logosRef = useRef<TechLogo[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  const initializeTechLogos = useCallback((width: number, height: number): TechLogo[] => {
    return Array.from({ length: logoCount }, (_, index) => {
      const logo = techLogos[Math.floor(Math.random() * techLogos.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * movementSpeed,
        vy: (Math.random() - 0.5) * movementSpeed,
        size: Math.random() * 25 + 15, // 15-40px
        opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7
        baseOpacity: Math.random() * 0.4 + 0.3,
        mass: Math.random() * 0.5 + 0.5,
        id: index,
        type: logo.symbol,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: logo.color,
        hoverScale: 1
      };
    });
  }, [logoCount, movementSpeed]);


  const updateTechLogos = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;

    logosRef.current.forEach(logo => {
      // Mouse interaction
      if (mouseGravity !== "none") {
        const dx = mouse.x - logo.x;
        const dy = mouse.y - logo.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const angle = Math.atan2(dy, dx);
          
          if (mouseGravity === "attract") {
            logo.vx += Math.cos(angle) * force * gravityStrength * 0.005;
            logo.vy += Math.sin(angle) * force * gravityStrength * 0.005;
          } else if (mouseGravity === "repel") {
            logo.vx -= Math.cos(angle) * force * gravityStrength * 0.005;
            logo.vy -= Math.sin(angle) * force * gravityStrength * 0.005;
          }

          // Scale effect on hover
          logo.hoverScale = 1 + force * 0.3;
          logo.opacity = logo.baseOpacity + force * 0.4;
        } else {
          logo.hoverScale = logo.hoverScale * 0.95 + 0.05; // Smooth return to normal
          logo.opacity = logo.opacity * 0.95 + logo.baseOpacity * 0.05;
        }
      }

      // Update position
      logo.x += logo.vx;
      logo.y += logo.vy;

      // Update rotation
      logo.rotation += logo.rotationSpeed;

      // Boundary wrapping
      if (logo.x < -50) logo.x = width + 50;
      if (logo.x > width + 50) logo.x = -50;
      if (logo.y < -50) logo.y = height + 50;
      if (logo.y > height + 50) logo.y = -50;

      // Apply friction
      logo.vx *= 0.995;
      logo.vy *= 0.995;
    });
  }, [mouseGravity, mouseInfluence, gravityStrength]);


  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Draw tech logos
    logosRef.current.forEach(logo => {
      ctx.save();
      
      const alpha = Math.min(1, Math.max(0, logo.opacity));
      const scale = logo.hoverScale;
      
      // Move to logo position
      ctx.translate(logo.x, logo.y);
      ctx.rotate(logo.rotation);
      ctx.scale(scale, scale);
      
      // Add glow effect
      ctx.shadowColor = logo.color;
      ctx.shadowBlur = 8 * scale;
      
      // Draw the emoji/symbol
      ctx.font = `${logo.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = alpha;
      
      ctx.fillText(logo.type, 0, 0);
      
      ctx.restore();
    });
  }, [backgroundColor]);

  const animate = useCallback(() => {
    updateTechLogos();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateTechLogos, draw]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    
    setCanvasSize({ width, height });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initialize canvas size
    handleResize();

    // Initialize logos
    logosRef.current = initializeTechLogos(canvas.width, canvas.height);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animate, handleMouseMove, handleResize, initializeTechLogos]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
