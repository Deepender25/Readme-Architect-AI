'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ActionButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
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
  const baseClasses = "font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black flex items-center justify-center gap-3"
  
  const variantClasses = {
    primary: "bg-green-500 text-black hover:bg-green-400",
    secondary: "bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50",
    outline: "bg-transparent border border-green-400/30 text-green-400 hover:bg-green-400/10 hover:border-green-400/50"
  }
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <div className="relative group">
      {variant === 'primary' && (
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
      )}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          relative
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${variant === 'primary' ? 'shadow-[0_0_30px_rgba(0,255,136,0.4)]' : ''}
          ${className}
        `}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    </div>
  )
}