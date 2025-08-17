"use client"

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InteractiveButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
}

const variants = {
  primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25",
  secondary: "bg-gray-800 hover:bg-gray-700 text-white",
  outline: "border-2 border-green-400/50 text-green-400 hover:bg-green-400/10 hover:border-green-400",
  ghost: "text-gray-300 hover:text-green-400 hover:bg-green-400/5",
  gradient: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30",
  glow: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50 hover:shadow-green-500/70"
}

const sizes = {
  sm: "px-3 py-2 text-sm rounded-lg",
  md: "px-4 py-3 text-base rounded-xl",
  lg: "px-6 py-4 text-lg rounded-xl",
  xl: "px-8 py-5 text-xl rounded-2xl"
}

export default function InteractiveButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}: InteractiveButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </motion.button>
  )
}
