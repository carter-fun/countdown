"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

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
  isEating: boolean
}

interface BiteMarks {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

interface GhoulsProps {
  onBite?: (x: number, y: number) => void
}

export function Ghouls({ onBite }: GhoulsProps) {
  const [ghouls, setGhouls] = useState<Ghoul[]>([])
  const [score, setScore] = useState(0)
  const [damage, setDamage] = useState(0)

  const spawnGhoul = useCallback(() => {
    const id = Date.now() + Math.random()
    const side = Math.floor(Math.random() * 4)
    
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

    // Target the 2026 text area - spread across the text width
    const newGhoul: Ghoul = {
      id,
      x,
      y,
      targetX: 35 + Math.random() * 30, // Spread across 35-65% (where 2026 text is)
      targetY: 32 + Math.random() * 12, // Vertical spread where 2026 is (~32-44%)
      speed: 0.12 + Math.random() * 0.08,
      size: 35 + Math.random() * 15,
      rotation: Math.random() * 360,
      isDying: false,
      opacity: 1,
      isEating: false
    }

    setGhouls(prev => [...prev, newGhoul])
  }, [])

  // Spawn ghouls periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        spawnGhoul()
      }
    }, 1800)

    setTimeout(spawnGhoul, 500)
    setTimeout(spawnGhoul, 1200)

    return () => clearInterval(spawnInterval)
  }, [spawnGhoul])

  // Move ghouls and check for biting
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setGhouls(prev => prev.map(ghoul => {
        if (ghoul.isDying) {
          const newOpacity = ghoul.opacity - 0.15
          if (newOpacity <= 0) {
            return null as unknown as Ghoul
          }
          return { ...ghoul, opacity: newOpacity, size: ghoul.size * 1.15 }
        }

        const dx = ghoul.targetX - ghoul.x
        const dy = ghoul.targetY - ghoul.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Check if ghoul reached the target (2026 text area)
        if (distance < 3 && !ghoul.isEating) {
          // Ghoul reached the text - take a bite!
          if (onBite) {
            onBite(ghoul.x, ghoul.y)
          }
          setDamage(prev => prev + 1)
          
          // After biting, pick a new target on the text
          return {
            ...ghoul,
            isEating: true,
            targetX: 35 + Math.random() * 30, // Stay on text area
            targetY: 32 + Math.random() * 12,
          }
        }
        
        // Reset eating state when far enough and pick new target
        if (ghoul.isEating && distance > 5) {
          return { 
            ...ghoul, 
            isEating: false,
            targetX: 35 + Math.random() * 30,
            targetY: 32 + Math.random() * 12,
          }
        }

        const moveX = (dx / distance) * ghoul.speed
        const moveY = (dy / distance) * ghoul.speed

        return {
          ...ghoul,
          x: ghoul.x + moveX,
          y: ghoul.y + moveY,
          rotation: ghoul.rotation + (ghoul.isEating ? 10 : 2)
        }
      }).filter(Boolean))
    }, 50)

    return () => clearInterval(moveInterval)
  }, [onBite])

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
      <div className="fixed top-6 left-6 z-50 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-500/30">
          <span className="text-pink-400 text-sm font-bold">DEFEATED:</span>
          <span className="text-white font-mono text-lg">{score}</span>
          <span className="text-2xl">👻</span>
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/30">
          <span className="text-red-400 text-sm font-bold">DAMAGE:</span>
          <span className="text-white font-mono text-lg">{damage}</span>
          <span className="text-2xl">🦷</span>
        </div>
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
              transform: `translate(-50%, -50%) rotate(${ghoul.rotation}deg) scale(${ghoul.isDying ? 1.5 : ghoul.isEating ? 1.2 : 1})`,
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
                  : ghoul.isEating 
                    ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.8)) brightness(1.2)'
                    : 'drop-shadow(0 0 10px rgba(255, 121, 198, 0.8))'
              }}
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                style={{
                  filter: ghoul.isDying ? 'hue-rotate(180deg)' : 'none'
                }}
              >
                <ellipse 
                  cx="50" 
                  cy="45" 
                  rx="35" 
                  ry="40" 
                  fill="url(#ghoulGradient)"
                  className={ghoul.isEating ? '' : 'animate-pulse'}
                />
                
                <path 
                  d="M15 50 Q25 90 35 70 Q45 90 50 75 Q55 90 65 70 Q75 90 85 50" 
                  fill="url(#ghoulGradient)"
                />
                
                {/* Eyes - angry when eating */}
                <ellipse cx="35" cy="40" rx="10" ry={ghoul.isEating ? 8 : 12} fill="#0a0010" />
                <ellipse cx="35" cy="38" rx="5" ry={ghoul.isEating ? 4 : 6} fill={ghoul.isEating ? "#FF0000" : "#FF79C6"} />
                <circle cx="33" cy="36" r="2" fill="white" />
                
                <ellipse cx="65" cy="40" rx="10" ry={ghoul.isEating ? 8 : 12} fill="#0a0010" />
                <ellipse cx="65" cy="38" rx="5" ry={ghoul.isEating ? 4 : 6} fill={ghoul.isEating ? "#FF0000" : "#FF79C6"} />
                <circle cx="63" cy="36" r="2" fill="white" />
                
                {/* Mouth - open wide when eating */}
                {ghoul.isEating ? (
                  <>
                    <ellipse cx="50" cy="65" rx="15" ry="12" fill="#0a0010" />
                    <path d="M38 60 L42 70 L46 60" fill="white" />
                    <path d="M48 60 L52 72 L56 60" fill="white" />
                    <path d="M54 60 L58 70 L62 60" fill="white" />
                  </>
                ) : (
                  <>
                    <path d="M35 60 Q50 75 65 60" stroke="#0a0010" strokeWidth="3" fill="none" />
                    <path d="M40 60 L42 67 L44 60" fill="#0a0010" />
                    <path d="M50 62 L52 70 L54 62" fill="#0a0010" />
                    <path d="M58 60 L60 67 L62 60" fill="#0a0010" />
                  </>
                )}
                
                <defs>
                  <linearGradient id="ghoulGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={ghoul.isEating ? "#FF5555" : "#FF79C6"} />
                    <stop offset="50%" stopColor={ghoul.isEating ? "#FF3333" : "#FF5CAD"} />
                    <stop offset="100%" stopColor={ghoul.isEating ? "#CC0000" : "#BD93F9"} />
                  </linearGradient>
                </defs>
              </svg>

              <div 
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: ghoul.isEating 
                    ? 'radial-gradient(circle, rgba(255,0,0,0.6) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(255,121,198,0.4) 0%, transparent 70%)',
                  animationDuration: ghoul.isEating ? '0.3s' : '2s'
                }}
              />
            </div>

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
    </>
  )
}

export default Ghouls
