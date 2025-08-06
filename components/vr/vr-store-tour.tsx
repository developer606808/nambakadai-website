"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize, Navigation, Info, X, Play, Pause } from 'lucide-react'

interface VRTourButtonProps {
  storeId: string
}

interface Hotspot {
  id: string
  x: number
  y: number
  title: string
  description: string
  productId?: string
  price?: number
}

const mockHotspots: Hotspot[] = [
  {
    id: '1',
    x: 25,
    y: 40,
    title: 'Organic Tomatoes',
    description: 'Fresh, locally grown organic tomatoes',
    productId: '1',
    price: 60
  },
  {
    id: '2',
    x: 60,
    y: 30,
    title: 'Fresh Herbs Section',
    description: 'Variety of fresh herbs and spices',
    productId: '2',
    price: 40
  },
  {
    id: '3',
    x: 80,
    y: 60,
    title: 'Seasonal Vegetables',
    description: 'Seasonal produce picked fresh daily',
    productId: '3',
    price: 50
  }
]

export function VRTourButton({ storeId }: VRTourButtonProps) {
  const [showVRTour, setShowVRTour] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [showMiniMap, setShowMiniMap] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoRotateRef = useRef<number>()

  useEffect(() => {
    if (isAutoRotating) {
      const rotate = () => {
        setRotation(prev => (prev + 0.5) % 360)
        autoRotateRef.current = requestAnimationFrame(rotate)
      }
      autoRotateRef.current = requestAnimationFrame(rotate)
    } else {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current)
      }
    }

    return () => {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current)
      }
    }
  }, [isAutoRotating])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerX = rect.width / 2
    const deltaX = x - centerX
    const rotationDelta = (deltaX / rect.width) * 10
    
    setRotation(prev => prev + rotationDelta)
  }

  const resetView = () => {
    setRotation(0)
    setZoom(1)
    setSelectedHotspot(null)
  }

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))

  if (!showVRTour) {
    return (
      <Button
        onClick={() => setShowVRTour(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <Eye className="h-4 w-4 mr-2" />
        VR Tour
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* VR Tour Interface */}
      <div className="relative w-full h-full overflow-hidden">
        {/* 360° Panoramic View */}
        <div
          ref={containerRef}
          className="relative w-full h-full cursor-grab active:cursor-grabbing"
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: `url('/placeholder.svg?height=800&width=1600&text=360°+Store+Panorama')`,
            backgroundSize: `${200 * zoom}% 100%`,
            backgroundPosition: `${rotation}px 0`,
            backgroundRepeat: 'repeat-x'
          }}
        >
          {/* Interactive Hotspots */}
          {mockHotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: `translate(-50%, -50%) scale(${zoom})`
              }}
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  {hotspot.title}
                </div>
              </div>
            </div>
          ))}

          {/* Hotspot Detail Modal */}
          {selectedHotspot && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{selectedHotspot.title}</h3>
                      <p className="text-gray-600 text-sm">{selectedHotspot.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedHotspot(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {selectedHotspot.price && (
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{selectedHotspot.price}
                      </span>
                      <span className="text-gray-500 ml-1">per kg</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      View Product
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShowVRTour(false)}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Badge className="bg-black/50 text-white border-white/20">
              VR Store Tour
            </Badge>
          </div>

          {/* Center Info */}
          <div className="flex items-center space-x-4">
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Rotation: {Math.round(rotation)}°
            </div>
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShowMiniMap(!showMiniMap)}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <Navigation className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              {isAutoRotating ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={resetView}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mini Map */}
        {showMiniMap && (
          <div className="absolute top-20 right-4">
            <Card className="w-48 h-32 bg-black/80 border-white/20">
              <CardContent className="p-2 h-full">
                <div className="relative w-full h-full bg-gray-800 rounded">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-green-900 opacity-50 rounded"></div>
                  
                  {/* Store Layout */}
                  <div className="absolute inset-2 border border-white/30 rounded">
                    {mockHotspots.map((hotspot) => (
                      <div
                        key={hotspot.id}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* View Direction Indicator */}
                  <div
                    className="absolute top-1 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500"
                    style={{
                      transform: `translateX(-50%) rotate(${rotation}deg)`,
                      transformOrigin: 'center bottom'
                    }}
                  />
                  
                  <div className="absolute bottom-1 left-1 text-white text-xs">
                    Store Map
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-20 left-4">
          <Card className="bg-black/50 border-white/20">
            <CardContent className="p-3">
              <div className="text-white text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <Info className="h-3 w-3" />
                  <span>Move mouse to look around</span>
                </div>
                <div>• Click hotspots to view products</div>
                <div>• Use controls to zoom and rotate</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
