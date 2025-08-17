'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon?: ReactNode
  title: string
  description: string
  delay?: number
  className?: string
  onClick?: () => void
  children?: ReactNode
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className = '',
  onClick,
  children
}: FeatureCardProps) {
  const Component = onClick ? motion.button : motion.div

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(delay * 0.05, 0.2) }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Component
        className={`relative bg-black/40 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all duration-300 w-full text-left ${className}`}
        onClick={onClick}
        whileHover={onClick ? { scale: 1.02, y: -2 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
      >
        {icon && (
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        )}
        
        {!icon && (
          <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        )}
        
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
        
        {children}
      </Component>
    </motion.div>
  )
}