"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface LazyLoadWrapperProps {
  children: ReactNode
  className?: string
  threshold?: number
  fadeIn?: boolean
  delay?: number
}

export function LazyLoadWrapper({
  children,
  className,
  threshold = 0.1,
  fadeIn = true,
  delay = 0,
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip intersection observer logic on the server
    if (typeof window === 'undefined') {
      // On the server, we'll show the content immediately to prevent hydration mismatches
      setIsVisible(true);
      setShouldRender(true);
      return;
    }

    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
            setTimeout(() => {
              setShouldRender(true)
            }, 50)
          }, delay)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold, delay])

  return (
    <div
      ref={ref}
      className={cn(
        fadeIn && "transition-opacity duration-500 ease-in-out",
        !shouldRender && fadeIn && "opacity-0",
        shouldRender && fadeIn && "opacity-100",
        className,
      )}
    >
      {isVisible && children}
    </div>
  )
}
