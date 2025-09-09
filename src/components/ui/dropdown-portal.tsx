"use client"

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface DropdownPortalProps {
  children: ReactNode
  isOpen: boolean
  triggerRef: React.RefObject<HTMLElement>
}

export default function DropdownPortal({ children, isOpen, triggerRef }: DropdownPortalProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, maxHeight: 'none', isAbove: false })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        const rect = triggerRef.current!.getBoundingClientRect()
        const dropdownWidth = 256 // min-w-64 = 256px
        const dropdownHeight = 380 // Estimated height for our dropdown content
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const padding = 16 // Safe padding from viewport edges
        
        // Calculate horizontal position
        let left = rect.right - dropdownWidth
        if (left < padding) {
          left = rect.left
        }
        if (left + dropdownWidth > viewportWidth - padding) {
          left = viewportWidth - dropdownWidth - padding
        }
        
        // Calculate available space
        const spaceBelow = viewportHeight - rect.bottom - padding
        const spaceAbove = rect.top - padding
        
        let top = rect.bottom + 8
        let maxHeight = 'none'
        let isAbove = false
        
        // More aggressive cutoff detection - if less than 350px space below
        if (viewportHeight - rect.bottom < 350) {
          // Position above the trigger
          top = rect.top - dropdownHeight - 8
          isAbove = true
          
          // If positioning above would go off-screen, adjust
          if (top < padding) {
            top = padding
            maxHeight = `${rect.top - padding - 8}px`
          }
        }
        
        // Ensure dropdown doesn't go beyond viewport boundaries
        top = Math.max(padding, Math.min(top, viewportHeight - padding - 100))
        
        setPosition({ top, left, maxHeight, isAbove })
      }
      
      updatePosition()
      
      // Recalculate on window resize or scroll
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  }, [isOpen, triggerRef])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed z-[999999] min-w-64"
      data-dropdown-portal="true"
      style={{
        top: position.top,
        left: position.left,
        maxHeight: position.maxHeight,
        overflowY: position.maxHeight !== 'none' ? 'auto' : 'visible',
        overflowX: 'visible',
        pointerEvents: 'auto'
      }}
    >
      <div className={position.maxHeight !== 'none' ? 'max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/20 scrollbar-track-transparent' : ''}>
        {children}
      </div>
    </div>,
    document.body
  )
}