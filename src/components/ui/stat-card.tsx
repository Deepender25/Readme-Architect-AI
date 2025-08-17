"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  description?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  index?: number
  className?: string
}

const colors = {
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    accent: 'text-blue-400'
  },
  green: {
    icon: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    accent: 'text-green-400'
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    accent: 'text-purple-400'
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    accent: 'text-orange-400'
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20',
    accent: 'text-red-400'
  }
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  description,
  color = 'green',
  index = 0,
  className
}: StatCardProps) {
  const colorScheme = colors[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "group relative bg-[rgba(26,26,26,0.8)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 hover:border-opacity-30 transition-all duration-300",
        colorScheme.border,
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className={cn(
        "absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300",
        colorScheme.bg
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            colorScheme.bg
          )}>
            <div className={cn("w-6 h-6", colorScheme.icon)}>
              {icon}
            </div>
          </div>
          
          {change && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              change.type === 'increase' && "bg-green-400/10 text-green-400",
              change.type === 'decrease' && "bg-red-400/10 text-red-400",
              change.type === 'neutral' && "bg-gray-400/10 text-gray-400"
            )}>
              <span>{change.type === 'increase' ? '↗' : change.type === 'decrease' ? '↘' : '→'}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        
        <motion.div
          className="text-3xl font-bold text-white mb-2"
          animate={{ 
            textShadow: [
              `0 0 10px ${colorScheme.icon.includes('green') ? 'rgba(0, 255, 136, 0.5)' : 
                         colorScheme.icon.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                         colorScheme.icon.includes('purple') ? 'rgba(147, 51, 234, 0.5)' :
                         colorScheme.icon.includes('orange') ? 'rgba(251, 146, 60, 0.5)' :
                         'rgba(239, 68, 68, 0.5)'}`,
              '0 0 0px transparent',
              `0 0 10px ${colorScheme.icon.includes('green') ? 'rgba(0, 255, 136, 0.5)' : 
                         colorScheme.icon.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                         colorScheme.icon.includes('purple') ? 'rgba(147, 51, 234, 0.5)' :
                         colorScheme.icon.includes('orange') ? 'rgba(251, 146, 60, 0.5)' :
                         'rgba(239, 68, 68, 0.5)'}`
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {value}
        </motion.div>
        
        <div className="text-gray-400 text-sm font-medium mb-1">
          {label}
        </div>
        
        {description && (
          <div className="text-gray-500 text-xs">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  )
}
