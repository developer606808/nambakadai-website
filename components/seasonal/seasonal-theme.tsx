"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Snowflake, Leaf, Sun, Flower } from 'lucide-react'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

interface SeasonalThemeProps {
  children: React.ReactNode
}

interface SeasonConfig {
  name: string
  icon: React.ComponentType<any>
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  particles: {
    color: string
    count: number
    speed: number
    size: number
  }
}

const seasonConfigs: Record<Season, SeasonConfig> = {
  spring: {
    name: 'Spring',
    icon: Flower,
    colors: {
      primary: '#10b981', // emerald-500
      secondary: '#34d399', // emerald-400
      accent: '#f59e0b', // amber-500
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
    },
    particles: {
      color: '#fbbf24', // amber-400 (pollen)
      count: 20,
      speed: 1,
      size: 3
    }
  },
  summer: {
    name: 'Summer',
    icon: Sun,
    colors: {
      primary: '#f59e0b', // amber-500
      secondary: '#fbbf24', // amber-400
      accent: '#10b981', // emerald-500
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
    },
    particles: {
      color: '#fbbf24', // amber-400 (sun rays)
      count: 15,
      speed: 0.5,
      size: 4
    }
  },
  autumn: {
    name: 'Autumn',
    icon: Leaf,
    colors: {
      primary: '#dc2626', // red-600
      secondary: '#f59e0b', // amber-500
      accent: '#92400e', // amber-800
      background: 'linear-gradient(135deg, #fef7cd 0%, #fed7aa 100%)'
    },
    particles: {
      color: '#dc2626', // red-600 (falling leaves)
      count: 25,
      speed: 2,
      size: 5
    }
  },
  winter: {
    name: 'Winter',
    icon: Snowflake,
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#60a5fa', // blue-400
      accent: '#1e40af', // blue-800
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
    },
    particles: {
      color: '#ffffff', // white (snowflakes)
      count: 30,
      speed: 1.5,
      size: 4
    }
  }
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

function Particles({ config }: { config: SeasonConfig['particles'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    particlesRef.current = Array.from({ length: config.count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: Math.random() * config.speed + 0.5,
      size: Math.random() * config.size + 1,
      opacity: Math.random() * 0.5 + 0.3
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Reset particle if it goes off screen
        if (particle.y > canvas.height) {
          particle.y = -particle.size
          particle.x = Math.random() * canvas.width
        }
        if (particle.x > canvas.width) {
          particle.x = -particle.size
        }
        if (particle.x < -particle.size) {
          particle.x = canvas.width
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = config.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

export function SeasonalTheme({ children }: SeasonalThemeProps) {
  const [currentSeason, setCurrentSeason] = useState<Season>(getCurrentSeason())
  const [showSeasonSelector, setShowSeasonSelector] = useState(false)
  const config = seasonConfigs[currentSeason]

  useEffect(() => {
    // Update CSS custom properties for theming
    const root = document.documentElement
    root.style.setProperty('--seasonal-primary', config.colors.primary)
    root.style.setProperty('--seasonal-secondary', config.colors.secondary)
    root.style.setProperty('--seasonal-accent', config.colors.accent)
    root.style.setProperty('--seasonal-background', config.colors.background)
  }, [config])

  return (
    <div className="relative min-h-screen">
      {/* Seasonal Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: config.colors.background }}
      />

      {/* Animated Particles */}
      <Particles config={config.particles} />

      {/* Season Selector */}
      <div className="fixed top-20 left-4 z-40">
        <Card className={`bg-background/90 backdrop-blur-sm shadow-lg border transition-all duration-300 ${
          showSeasonSelector ? 'w-64' : 'w-16'
        }`}>
          <CardContent className="p-3">
            {showSeasonSelector ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Season Theme</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSeasonSelector(false)}
                    className="h-6 w-6"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(seasonConfigs).map(([season, seasonConfig]) => {
                    const IconComponent = seasonConfig.icon
                    return (
                      <Button
                        key={season}
                        variant={currentSeason === season ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentSeason(season as Season)}
                        className="h-12 flex flex-col items-center justify-center p-1"
                        style={{
                          backgroundColor: currentSeason === season ? seasonConfig.colors.primary : undefined,
                          borderColor: seasonConfig.colors.primary
                        }}
                      >
                        <IconComponent className="h-4 w-4 mb-1" />
                        <span className="text-xs">{seasonConfig.name}</span>
                      </Button>
                    )
                  })}
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Current: {config.name}
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSeasonSelector(true)}
                className="h-10 w-10"
                style={{ color: config.colors.primary }}
              >
                <config.icon className="h-5 w-5" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Seasonal CSS Variables */}
      <style jsx global>{`
        :root {
          --seasonal-primary: ${config.colors.primary};
          --seasonal-secondary: ${config.colors.secondary};
          --seasonal-accent: ${config.colors.accent};
        }
        
        .seasonal-primary {
          color: var(--seasonal-primary);
        }
        
        .seasonal-bg-primary {
          background-color: var(--seasonal-primary);
        }
        
        .seasonal-border-primary {
          border-color: var(--seasonal-primary);
        }
        
        .seasonal-gradient {
          background: ${config.colors.background};
        }
      `}</style>
    </div>
  )
}
