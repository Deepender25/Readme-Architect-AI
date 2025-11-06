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
        
        // Calculate horizontal position - center the dropdown relative to the trigger
        const triggerCenter = rect.left + (rect.width / 2)
        let left = triggerCenter - (dropdownWidth / 2)
        
        // Ensure dropdown doesn't go off screen
        if (left < padding) {
          left = padding
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
        
        // Check available space and position accordingly
        const availableSpaceBelow = viewportHeight - rect.bottom - padding
        const availableSpaceAbove = rect.top - padding
        
        if (availableSpaceBelow < 350) {
          // Position above if there's more space or at least 200px
          if (availableSpaceAbove > availableSpaceBelow || availableSpaceAbove >= 200) {
            // Position at top of trigger and use transform to move up
            top = rect.top - 8
            isAbove = true
            
            // Don't let it go off the top of the screen
            if (top - dropdownHeight < padding) {
              top = dropdownHeight + padding
              maxHeight = `${Math.min(availableSpaceAbove, 400)}px`
            }
          } else {
            // Keep below but limit height
            maxHeight = `${Math.max(200, availableSpaceBelow)}px`
          }
        }
        
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
        pointerEvents: 'auto',
        transform: position.isAbove ? 'translateY(-100%)' : 'none',
        transformOrigin: position.isAbove ? 'bottom' : 'top'
      }}
    >
      <div className={position.maxHeight !== 'none' ? 'max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-green-400/20 scrollbar-track-transparent' : ''}>
        {children}
      </div>
    </div>,
    document.body
  )
}