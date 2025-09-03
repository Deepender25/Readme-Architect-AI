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
  const [position, setPosition] = useState({ top: 0, left: 0, maxHeight: 'none' })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const dropdownWidth = 256 // min-w-64 = 256px
      const dropdownHeight = 400 // Estimated height of our new dropdown
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Calculate horizontal position
      let left = rect.right - dropdownWidth
      if (left < 16) { // 16px margin from left edge
        left = rect.left
      }
      if (left + dropdownWidth > viewportWidth - 16) { // 16px margin from right edge
        left = viewportWidth - dropdownWidth - 16
      }
      
      // Calculate vertical position
      let top = rect.bottom + 8
      let maxHeight = 'none'
      
      // Check if dropdown would go below viewport
      if (top + dropdownHeight > viewportHeight - 16) {
        // Try positioning above the trigger
        const topPosition = rect.top - dropdownHeight - 8
        if (topPosition >= 16) {
          top = topPosition
        } else {
          // Keep below but limit height
          maxHeight = `${viewportHeight - top - 16}px`
        }
      }
      
      setPosition({ top, left, maxHeight })
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
        pointerEvents: 'auto'
      }}
    >
      {children}
    </div>,
    document.body
  )
}