"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  mass: number;
  id: number;
}

interface FloatingParticlesBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  glowIntensity?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  backgroundColor?: string;
  particleColor?: string;
  mouseGravity?: "none" | "attract" | "repel";
  gravityStrength?: number;
  glowAnimation?: string;
  particleInteraction?: boolean;
  interactionType?: "bounce" | "merge";
}

export default function FloatingParticlesBackground({
  particleCount = 50,
  particleSize = 2,
  particleOpacity = 0.6,
  glowIntensity = 10,
  movementSpeed = 0.5,
  mouseInfluence = 100,
  backgroundColor = "#000000",
  particleColor = "#00FF88",
  mouseGravity = "none",
  gravityStrength = 50,
  glowAnimation = "ease",
  particleInteraction = false,
  interactionType = "bounce"
}: FloatingParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  const initializeParticles = useCallback((width: number, height: number): Particle[] => {
    return Array.from({ length: particleCount }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * movementSpeed,
      vy: (Math.random() - 0.5) * movementSpeed,
      size: Math.random() * particleSize + 1,
      opacity: particleOpacity,
      baseOpacity: particleOpacity,
      mass: Math.random() * 0.5 + 0.5,
      id: index
    }));
  }, [particleCount, particleSize, particleOpacity, movementSpeed]);

  const redistributeParticles = useCallback((width: number, height: number) => {
    particlesRef.current.forEach(particle => {
      // Redistribute particles proportionally across the new dimensions
      particle.x = (particle.x / canvasSize.width) * width;
      particle.y = (particle.y / canvasSize.height) * height;
    });
  }, [canvasSize.width, canvasSize.height]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;

    particlesRef.current.forEach(particle => {
      // Mouse interaction
      if (mouseGravity !== "none") {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const angle = Math.atan2(dy, dx);
          
          if (mouseGravity === "attract") {
            particle.vx += Math.cos(angle) * force * gravityStrength * 0.01;
            particle.vy += Math.sin(angle) * force * gravityStrength * 0.01;
          } else if (mouseGravity === "repel") {
            particle.vx -= Math.cos(angle) * force * gravityStrength * 0.01;
            particle.vy -= Math.sin(angle) * force * gravityStrength * 0.01;
          }
        }
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary collision with elastic bounce
      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Particle interactions
      if (particleInteraction) {
        particlesRef.current.forEach(otherParticle => {
          if (particle.id !== otherParticle.id) {
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = particle.size + otherParticle.size;

            if (distance < minDistance && interactionType === "bounce") {
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              // Rotate particle velocity
              const vx1 = particle.vx * cos + particle.vy * sin;
              const vy1 = particle.vy * cos - particle.vx * sin;
              const vx2 = otherParticle.vx * cos + otherParticle.vy * sin;
              const vy2 = otherParticle.vy * cos - otherParticle.vx * sin;

              // Collision reaction
              const totalMass = particle.mass + otherParticle.mass;
              const newVx1 = ((particle.mass - otherParticle.mass) * vx1 + 2 * otherParticle.mass * vx2) / totalMass;
              const newVx2 = ((otherParticle.mass - particle.mass) * vx2 + 2 * particle.mass * vx1) / totalMass;

              // Rotate back
              particle.vx = newVx1 * cos - vy1 * sin;
              particle.vy = vy1 * cos + newVx1 * sin;
              otherParticle.vx = newVx2 * cos - vy2 * sin;
              otherParticle.vy = vy2 * cos + newVx2 * sin;

              // Separate particles
              const overlap = minDistance - distance;
              const separationX = (dx / distance) * overlap * 0.5;
              const separationY = (dy / distance) * overlap * 0.5;
              particle.x -= separationX;
              particle.y -= separationY;
              otherParticle.x += separationX;
              otherParticle.y += separationY;
            }
          }
        });
      }

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Update opacity based on distance to mouse
      if (mouseGravity !== "none") {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / mouseInfluence);
        particle.opacity = particle.baseOpacity + influence * 0.4;
      }
    });
  }, [mouseGravity, mouseInfluence, gravityStrength, particleInteraction, interactionType]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.save();
      
      // Set particle style
      const alpha = Math.min(1, Math.max(0, particle.opacity));
      ctx.fillStyle = particleColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
      
      // Add glow effect
      if (glowIntensity > 0) {
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = glowIntensity;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }, [backgroundColor, particleColor, glowIntensity]);

  const animate = useCallback(() => {
    updateParticles();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, draw]);

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
    
    if (canvasSize.width !== width || canvasSize.height !== height) {
      redistributeParticles(width, height);
      setCanvasSize({ width, height });
    }
  }, [redistributeParticles, canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initialize canvas size
    handleResize();

    // Initialize particles
    particlesRef.current = initializeParticles(canvas.width, canvas.height);

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
  }, [animate, handleMouseMove, handleResize, initializeParticles]);

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
