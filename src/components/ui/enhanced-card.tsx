"use client"

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnhancedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'gradient' | 'glow' | 'interactive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  glow?: boolean
  className?: string
}

const variants = {
  default: "bg-[rgba(26,26,26,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)]",
  glass: "bg-[rgba(26,26,26,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.15)]",
  gradient: "bg-gradient-to-br from-[rgba(26,26,26,0.9)] to-[rgba(0,255,136,0.05)] border border-green-400/20",
  glow: "bg-[rgba(26,26,26,0.8)] backdrop-blur-xl border border-green-400/30 shadow-lg shadow-green-400/10",
  interactive: "bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/20"
}

const sizes = {
  sm: "p-4 rounded-lg",
  md: "p-6 rounded-xl", 
  lg: "p-8 rounded-2xl",
  xl: "p-12 rounded-3xl"
}

export default function EnhancedCard({ 
  children, 
  variant = 'default', 
  size = 'md',
  hover = false,
  glow = false,
  className,
  ...props 
}: EnhancedCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        variants[variant],
        sizes[size],
        hover && "hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      {...props}
    >
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
