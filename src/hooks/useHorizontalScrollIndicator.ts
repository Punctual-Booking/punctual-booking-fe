import { useState, useRef, useEffect } from 'react'

interface UseHorizontalScrollIndicatorOptions {
  /**
   * Dependency array to trigger re-evaluation of scroll detection
   */
  dependencies?: any[]
  /**
   * Initial delay before first animation (ms)
   */
  initialDelay?: number
  /**
   * Animation delay after scroll detection (ms)
   */
  animationDelay?: number
  /**
   * Duration of the return animation (ms)
   */
  returnAnimationDuration?: number
  /**
   * Maximum scroll amount for the indicator animation
   */
  maxScrollAmount?: number
}

/**
 * Hook to detect horizontal scrolling and provide visual indicators
 */
export function useHorizontalScrollIndicator({
  dependencies = [],
  initialDelay = 500,
  animationDelay = 1500,
  returnAnimationDuration = 800,
  maxScrollAmount = 60,
}: UseHorizontalScrollIndicatorOptions = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false)
  const scrollAnimationTimerRef = useRef<number | null>(null)

  // Check if container has horizontal scroll
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Function to check for horizontal scroll and trigger animation
    const checkScrollAndAnimate = () => {
      const hasScroll = container.scrollWidth > container.clientWidth
      setHasHorizontalScroll(hasScroll)

      // If there's horizontal scroll, animate a small scroll to indicate scrollability
      if (hasScroll) {
        // Clear any existing animation
        if (scrollAnimationTimerRef.current) {
          window.clearTimeout(scrollAnimationTimerRef.current)
          scrollAnimationTimerRef.current = null
        }

        // Set a delay to ensure content is fully loaded
        scrollAnimationTimerRef.current = window.setTimeout(() => {
          // Scroll animation
          const scrollAmount = Math.min(
            maxScrollAmount,
            container.scrollWidth * 0.1
          )
          container.scrollLeft = scrollAmount

          setTimeout(() => {
            container.scrollTo({
              left: 0,
              behavior: 'smooth',
            })
          }, returnAnimationDuration)
        }, animationDelay)
      }
    }

    // Initial check with a delay to ensure content is rendered
    const initialCheckTimer = window.setTimeout(
      checkScrollAndAnimate,
      initialDelay
    )

    // Also check when window is fully loaded
    const handleWindowLoad = () => {
      checkScrollAndAnimate()
    }

    window.addEventListener('load', handleWindowLoad)

    // Set up ResizeObserver to detect changes in container dimensions
    const resizeObserver = new ResizeObserver(() => {
      checkScrollAndAnimate()
    })

    resizeObserver.observe(container)

    // Clean up
    return () => {
      window.clearTimeout(initialCheckTimer)
      if (scrollAnimationTimerRef.current) {
        window.clearTimeout(scrollAnimationTimerRef.current)
      }
      window.removeEventListener('load', handleWindowLoad)
      resizeObserver.disconnect()
    }
  }, dependencies)

  return {
    scrollContainerRef,
    hasHorizontalScroll,
  }
}
