
import * as React from "react"

// Updated for more standard mobile breakpoints
const MOBILE_BREAKPOINT = 640

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check based on window width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkIsMobile()
    
    // Add throttled resize event listener for better performance
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        checkIsMobile()
      }, 100)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // For SSR compatibility
  React.useEffect(() => {
    // Check for touch capability as additional mobile indicator
    const hasTouchScreen = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0

    if (hasTouchScreen && !isMobile && window.innerWidth < 768) {
      setIsMobile(true)
    }
  }, [isMobile])

  return isMobile
}