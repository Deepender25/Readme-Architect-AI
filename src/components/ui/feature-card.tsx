'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cardEntranceVariants } from '@/lib/animation-utils'

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

  // Professional entrance animation with stagger
  const entranceVariants = {
    hidden: cardEntranceVariants.hidden,
    visible: {
      ...cardEntranceVariants.visible,
      transition: {
        ...cardEntranceVariants.visible.transition,
        delay: Math.min(delay * 0.05, 0.3),
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={entranceVariants}
      className="relative group"
    >
      {/* Glow effect on hover - smooth transition */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Component
        className={`
          card-professional
          bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl
          ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400/30' : ''}
          w-full text-left relative z-10
          ${className}
        `}
        onClick={onClick}
        whileHover={{ 
          scale: 1.005,
          y: -4,
          transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
        }}
        whileTap={onClick ? { 
          scale: 0.995,
          y: -2,
          transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
        } : undefined}
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
        }}
      >
        {icon && (
          <div className="flex items-start gap-4 mb-6">
            <motion.div 
              className="p-3 bg-green-400/10 rounded-xl border border-green-400/20 flex-shrink-0"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
            >
              {icon}
            </motion.div>
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