import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSmoothNavigation() {
  const router = useRouter()

  const navigateWithPreload = useCallback((href: string) => {
    // Preload the route for faster navigation
    router.prefetch(href)
    
    // Navigate to the route
    router.push(href)
  }, [router])

  return {
    navigateWithPreload
  }
}