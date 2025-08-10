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
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 224 // 224px = w-56
      })
    }
  }, [isOpen, triggerRef])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className="fixed z-[999999] w-56"
      data-dropdown-portal="true"
      style={{
        top: position.top,
        left: position.left,
        pointerEvents: 'auto'
      }}
    >
      {children}
    </div>,
    document.body
  )
}