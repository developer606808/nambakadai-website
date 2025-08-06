"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react'

interface SoundTrack {
  id: string
  name: string
  url: string
  icon: string
  description: string
}

const soundTracks: SoundTrack[] = [
  {
    id: "rain",
    name: "Rain",
    url: "/audio/rain.mp3",
    icon: "🌧️",
    description: "Gentle rainfall"
  },
  {
    id: "birds",
    name: "Birds",
    url: "/audio/birds.mp3", 
    icon: "🐦",
    description: "Morning bird songs"
  },
  {
    id: "wind",
    name: "Wind",
    url: "/audio/wind.mp3",
    icon: "🍃",
    description: "Rustling leaves"
  },
  {
    id: "stream",
    name: "Stream",
    url: "/audio/stream.mp3",
    icon: "🏞️",
    description: "Flowing water"
  },
  {
    id: "crickets",
    name: "Crickets",
    url: "/audio/crickets.mp3",
    icon: "🦗",
    description: "Evening crickets"
  },
  {
    id: "ocean",
    name: "Ocean",
    url: "/audio/ocean.mp3",
    icon: "🌊",
    description: "Ocean waves"
  }
]

function NatureSounds() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string>("rain")
  const [volume, setVolume] = useState([0.5])
  const [isMinimized, setIsMinimized] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0]
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const selectTrack = (trackId: string) => {
    setCurrentTrack(trackId)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const currentTrackData = soundTracks.find(track => track.id === currentTrack)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`bg-background/90 backdrop-blur-sm shadow-lg border transition-all duration-300 ${
        isMinimized ? 'w-16 h-16' : 'w-80'
      }`}>
        <CardContent className="p-3">
          {isMinimized ? (
            // Minimized View
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(false)}
                className="h-10 w-10"
              >
                <span className="text-lg">{currentTrackData?.icon}</span>
              </Button>
            </div>
          ) : (
            // Expanded View
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{currentTrackData?.icon}</span>
                  <div>
                    <h3 className="text-sm font-medium">Nature Sounds</h3>
                    <p className="text-xs text-muted-foreground">
                      {currentTrackData?.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Track Selection */}
              <div className="grid grid-cols-3 gap-2">
                {soundTracks.map((track) => (
                  <Button
                    key={track.id}
                    variant={currentTrack === track.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectTrack(track.id)}
                    className="h-12 flex flex-col items-center justify-center p-1"
                  >
                    <span className="text-sm">{track.icon}</span>
                    <span className="text-xs">{track.name}</span>
                  </Button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlay}
                  className="h-10 w-10"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <div className="flex-1 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Sound Wave Visualization */}
              {isPlaying && (
                <div className="flex items-center justify-center space-x-1 h-8">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-primary rounded-full animate-pulse"
                      style={{
                        width: '2px',
                        height: `${Math.random() * 20 + 4}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={currentTrackData?.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export { NatureSounds }
