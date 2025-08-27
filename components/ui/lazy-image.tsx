"use client"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
  threshold?: number
  blurEffect?: boolean
  fadeIn?: boolean
}

export function LazyImage({
  src,
  alt,
  className,
  threshold = 0.1,
  blurEffect = true,
  fadeIn = true,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip intersection observer logic on the server
    if (typeof window === 'undefined') return;

    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  // On the server or before hydration, we'll show the image immediately
  // This prevents hydration mismatches
  const shouldShowImage = typeof window === 'undefined' || isInView;

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        fadeIn && "transition-opacity duration-500",
        !isLoaded && fadeIn && "opacity-0",
        isLoaded && fadeIn && "opacity-100",
        className,
      )}
    >
      {shouldShowImage && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn(blurEffect && "transition-all duration-500", className)}
          onLoad={handleImageLoad}
          {...props}
        />
      )}
      {shouldShowImage && !isLoaded && blurEffect && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
    </div>
  )
}
