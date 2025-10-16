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
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Component
        className={`
          bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300
          ${onClick ? 'cursor-pointer hover:bg-black/90 hover:border-green-400/20 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400/30' : 'hover:bg-black/90 hover:border-green-400/20 hover:-translate-y-1'}
          w-full text-left relative z-10
          ${className}
        `}
        onClick={onClick}
        whileHover={onClick ? { scale: 1.01, y: -2 } : { y: -2 }}
        whileTap={onClick ? { scale: 0.99, y: -1 } : undefined}
      >
        {icon && (
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-400/10 rounded-xl border border-green-400/20 flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
          </div>
        )}
        
        {!icon && (
          <>
            <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
          </>
        )}
        
        {children}
      </Component>
    </motion.div>
  )
}