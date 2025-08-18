"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function OptimizedGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      ctx.scale(dpr, dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    const drawGrid = () => {
      if (!ctx || !canvas) return
      
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Grid settings
      const gridSize = 40 // Size of each grid cell
      const lineWidth = 0.5 // Very thin lines
      
      // Calculate grid offset for subtle animation
      const offsetX = (Math.sin(time * 0.0005) * 10) % gridSize
      const offsetY = (Math.cos(time * 0.0003) * 10) % gridSize
      
      // Set line style
      ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 + Math.sin(time * 0.001) * 0.05})`
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      
      // Draw vertical lines
      for (let x = -gridSize + offsetX; x <= width + gridSize; x += gridSize) {
        const opacity = 0.08 + Math.sin(time * 0.001 + x * 0.01) * 0.03
        ctx.strokeStyle = `rgba(0, 255, 136, ${Math.max(0.02, opacity)})`
        
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      
      // Draw horizontal lines
      for (let y = -gridSize + offsetY; y <= height + gridSize; y += gridSize) {
        const opacity = 0.08 + Math.sin(time * 0.001 + y * 0.01) * 0.03
        ctx.strokeStyle = `rgba(0, 255, 136, ${Math.max(0.02, opacity)})`
        
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      
      // Draw intersection dots for enhanced visual appeal
      ctx.fillStyle = `rgba(0, 255, 136, ${0.15 + Math.sin(time * 0.002) * 0.1})`
      
      for (let x = offsetX; x <= width; x += gridSize) {
        for (let y = offsetY; y <= height; y += gridSize) {
          const dotOpacity = 0.1 + Math.sin(time * 0.001 + x * 0.01 + y * 0.01) * 0.05
          if (dotOpacity > 0.05) {
            ctx.globalAlpha = Math.max(0.02, dotOpacity)
            ctx.beginPath()
            ctx.arc(x, y, 0.5, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      
      ctx.globalAlpha = 1
    }

    const animate = () => {
      time += 16 // Roughly 60fps
      drawGrid()
      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    animate()

    // Handle resize
    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.01) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
          `
        }}
      />
      
      {/* Animated grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          mixBlendMode: 'screen',
          opacity: 0.8 
        }}
      />
      
      {/* Subtle overlay for depth */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%)
          `
        }}
      />
    </div>
  )
}
