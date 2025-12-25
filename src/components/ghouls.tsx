"use client"

import { useState, useEffect, useCallback } from 'react'

interface Ghoul {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  speed: number
  size: number
  rotation: number
  isDying: boolean
  opacity: number
}

export function Ghouls() {
  const [ghouls, setGhouls] = useState<Ghoul[]>([])
  const [score, setScore] = useState(0)

  const spawnGhoul = useCallback(() => {
    const id = Date.now() + Math.random()
    const side = Math.floor(Math.random() * 4) // 0: top, 1: right, 2: bottom, 3: left
    
    let x: number, y: number
    
    switch (side) {
      case 0: // top
        x = Math.random() * 100
        y = -10
        break
      case 1: // right
        x = 110
        y = Math.random() * 100
        break
      case 2: // bottom
        x = Math.random() * 100
        y = 110
        break
      default: // left
        x = -10
        y = Math.random() * 100
    }

    const newGhoul: Ghoul = {
      id,
      x,
      y,
      targetX: 50 + (Math.random() - 0.5) * 20, // Aim for center area
      targetY: 50 + (Math.random() - 0.5) * 20,
      speed: 0.15 + Math.random() * 0.1,
      size: 40 + Math.random() * 20,
      rotation: Math.random() * 360,
      isDying: false,
      opacity: 1
    }

    setGhouls(prev => [...prev, newGhoul])
  }, [])

  // Spawn ghouls periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to spawn
        spawnGhoul()
      }
    }, 2000)

    // Initial spawn
    setTimeout(spawnGhoul, 500)
    setTimeout(spawnGhoul, 1000)
    setTimeout(spawnGhoul, 1500)

    return () => clearInterval(spawnInterval)
  }, [spawnGhoul])

  // Move ghouls towards target
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setGhouls(prev => prev.map(ghoul => {
        if (ghoul.isDying) {
          const newOpacity = ghoul.opacity - 0.1
          if (newOpacity <= 0) {
            return null as unknown as Ghoul
          }
          return { ...ghoul, opacity: newOpacity, size: ghoul.size * 1.1 }
        }

        const dx = ghoul.targetX - ghoul.x
        const dy = ghoul.targetY - ghoul.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 1) return ghoul

        const moveX = (dx / distance) * ghoul.speed
        const moveY = (dy / distance) * ghoul.speed

        return {
          ...ghoul,
          x: ghoul.x + moveX,
          y: ghoul.y + moveY,
          rotation: ghoul.rotation + 2
        }
      }).filter(Boolean))
    }, 50)

    return () => clearInterval(moveInterval)
  }, [])

  // Kill ghoul on hover
  const killGhoul = (id: number) => {
    setGhouls(prev => prev.map(ghoul => 
      ghoul.id === id && !ghoul.isDying
        ? { ...ghoul, isDying: true }
        : ghoul
    ))
    setScore(prev => prev + 1)
  }

  return (
    <>
      {/* Score display */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-500/30">
        <span className="text-pink-400 text-sm font-bold">DEFEATED:</span>
        <span className="text-white font-mono text-lg">{score}</span>
        <span className="text-2xl">👻</span>
      </div>

      {/* Ghouls container */}
      <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
        {ghouls.map(ghoul => (
          <div
            key={ghoul.id}
            className="absolute pointer-events-auto cursor-crosshair transition-transform"
            style={{
              left: `${ghoul.x}%`,
              top: `${ghoul.y}%`,
              transform: `translate(-50%, -50%) rotate(${ghoul.rotation}deg) scale(${ghoul.isDying ? 1.5 : 1})`,
              opacity: ghoul.opacity,
              transition: ghoul.isDying ? 'all 0.3s ease-out' : 'none',
            }}
            onMouseEnter={() => killGhoul(ghoul.id)}
            onTouchStart={() => killGhoul(ghoul.id)}
          >
            <div 
              className="relative"
              style={{ 
                width: ghoul.size, 
                height: ghoul.size,
                filter: ghoul.isDying 
                  ? 'brightness(2) blur(4px)' 
                  : 'drop-shadow(0 0 10px rgba(255, 121, 198, 0.8))'
              }}
            >
              {/* Ghoul body */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                style={{
                  filter: ghoul.isDying ? 'hue-rotate(180deg)' : 'none'
                }}
              >
                {/* Main body */}
                <ellipse 
                  cx="50" 
                  cy="45" 
                  rx="35" 
                  ry="40" 
                  fill="url(#ghoulGradient)"
                  className="animate-pulse"
                />
                
                {/* Wavy bottom */}
                <path 
                  d="M15 50 Q25 90 35 70 Q45 90 50 75 Q55 90 65 70 Q75 90 85 50" 
                  fill="url(#ghoulGradient)"
                />
                
                {/* Left eye */}
                <ellipse cx="35" cy="40" rx="10" ry="12" fill="#0a0010" />
                <ellipse cx="35" cy="38" rx="5" ry="6" fill="#FF79C6" />
                <circle cx="33" cy="36" r="2" fill="white" />
                
                {/* Right eye */}
                <ellipse cx="65" cy="40" rx="10" ry="12" fill="#0a0010" />
                <ellipse cx="65" cy="38" rx="5" ry="6" fill="#FF79C6" />
                <circle cx="63" cy="36" r="2" fill="white" />
                
                {/* Mouth */}
                <path 
                  d="M35 60 Q50 75 65 60" 
                  stroke="#0a0010" 
                  strokeWidth="3" 
                  fill="none"
                />
                
                {/* Teeth */}
                <path d="M40 60 L42 67 L44 60" fill="#0a0010" />
                <path d="M50 62 L52 70 L54 62" fill="#0a0010" />
                <path d="M58 60 L60 67 L62 60" fill="#0a0010" />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="ghoulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF79C6" />
                    <stop offset="50%" stopColor="#FF5CAD" />
                    <stop offset="100%" stopColor="#BD93F9" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: 'radial-gradient(circle, rgba(255,121,198,0.4) 0%, transparent 70%)',
                  animationDuration: '2s'
                }}
              />
            </div>

            {/* Death particles */}
            {ghoul.isDying && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-pink-400 rounded-full animate-ping"
                    style={{
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
                      top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                      animationDuration: '0.5s'
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float-ghoul {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  )
}

export default Ghouls

