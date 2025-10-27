'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ScrollAnimatedDiv } from './scroll-animated-div'

interface PageContainerProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
  className?: string
  showStats?: boolean
  stats?: Array<{ number: string; label: string }>
}

export default function PageContainer({
  children,
  title,
  subtitle,
  icon,
  className = '',
  showStats = false,
  stats = []
}: PageContainerProps) {
  return (
    <div className={`min-h-screen font-sans text-white overflow-hidden relative ${className}`}>
      <div className="relative isolate px-6 pt-8 lg:px-8 min-h-screen">
        <div className="mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
          
          {/* Page Header */}
          {(title || subtitle) && (
            <div className="text-center mb-16">
              {icon && (
                <ScrollAnimatedDiv delay={0} duration={0.4} yOffset={30}>
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-green-400/10 border border-green-400/30 rounded-2xl text-green-400 mb-8"
                    animate={{ 
                      boxShadow: [
                        '0 0 10px rgba(0, 255, 136, 0.3)',
                        '0 0 20px rgba(0, 255, 136, 0.5)',
                        '0 0 10px rgba(0, 255, 136, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {icon}
                  </motion.div>
                </ScrollAnimatedDiv>
              )}
              
              {title && (
                <ScrollAnimatedDiv delay={0.05} duration={0.4} yOffset={30}>
                  <motion.h1
                    className="text-4xl font-bold tracking-normal leading-relaxed text-white sm:text-6xl lg:text-7xl mb-6"
                    style={{ 
                      textShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.2)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {title}
                  </motion.h1>
                </ScrollAnimatedDiv>
              )}
              
              {subtitle && (
                <ScrollAnimatedDiv delay={0.1} duration={0.4} yOffset={20}>
                  <motion.p className="mt-6 text-xl font-medium text-gray-300 sm:text-2xl max-w-3xl mx-auto leading-relaxed">
                    {subtitle}
                  </motion.p>
                </ScrollAnimatedDiv>
              )}
            </div>
          )}

          {/* Stats Section */}
          {showStats && stats.length > 0 && (
            <ScrollAnimatedDiv delay={0.15} duration={0.4} yOffset={20}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.15) }}
                    className="text-center"
                  >
                    <motion.div
                      className="text-3xl font-bold text-green-400 mb-2"
                      animate={{ 
                        textShadow: [
                          '0 0 10px rgba(0, 255, 136, 0.5)',
                          '0 0 20px rgba(0, 255, 136, 0.8)',
                          '0 0 10px rgba(0, 255, 136, 0.5)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollAnimatedDiv>
          )}

          {/* Main Content */}
          <ScrollAnimatedDiv delay={0.2} duration={0.4} yOffset={20}>
            {children}
          </ScrollAnimatedDiv>
        </div>
      </div>
    </div>
  )
}