'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ActionButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disabled?: boolean
  loading?: boolean
}

export default function ActionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false
}: ActionButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'text-black bg-green-400 border border-green-400 hover:bg-green-300'
      case 'secondary': return 'text-green-400 bg-transparent border border-green-400/20 hover:bg-green-400/10'
      case 'outline': return 'text-green-400 bg-transparent border border-green-400/20 hover:bg-green-400/10'
      case 'ghost': return 'text-white/70 bg-transparent border border-transparent hover:bg-green-400/10 hover:text-green-400'
      default: return 'text-black bg-green-400 border border-green-400 hover:bg-green-300'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-xs min-h-[36px]'
      case 'md': return 'px-6 py-3 text-sm min-h-[44px]'
      case 'lg': return 'px-8 py-4 text-base min-h-[52px]'
      case 'xl': return 'px-10 py-5 text-lg min-h-[60px]'
      default: return 'px-6 py-3 text-sm min-h-[44px]'
    }
  }

  return (
    <div className="relative group">
      {variant === 'primary' && (
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: -1 }}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 disabled:opacity-40 disabled:cursor-not-allowed relative z-10
          ${getVariantClass()}
          ${getSizeClass()}
          ${className}
        `}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    </div>
  )
}