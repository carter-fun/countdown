"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Ghouls } from './ghouls'

interface BiteMark {
  id: number
  x: number
  y: number
  size: number
  rotation: number
}

export function EatableText() {
  const [biteMarks, setBiteMarks] = useState<BiteMark[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerBounds, setContainerBounds] = useState<DOMRect | null>(null)

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        setContainerBounds(containerRef.current.getBoundingClientRect())
      }
    }
    updateBounds()
    window.addEventListener('resize', updateBounds)
    return () => window.removeEventListener('resize', updateBounds)
  }, [])

  const handleBite = useCallback((ghoulX: number, ghoulY: number) => {
    // Convert ghoul position (percentage) to position relative to the text
    // Add some randomness to make bites look natural
    const newBite: BiteMark = {
      id: Date.now() + Math.random(),
      x: (ghoulX - 35) * 2.5 + (Math.random() - 0.5) * 30, // Map to text area
      y: (ghoulY - 25) * 3 + (Math.random() - 0.5) * 40,
      size: 25 + Math.random() * 35,
      rotation: Math.random() * 360
    }
    
    setBiteMarks(prev => [...prev, newBite])
  }, [])

  return (
    <>
      <Ghouls onBite={handleBite} />
      
      <div ref={containerRef} className="relative">
        {/* The 2026 text with bite marks */}
        <div className="relative">
          {/* SVG container for the text with mask */}
          <svg 
            viewBox="0 0 500 180" 
            className="w-full h-auto max-w-[800px]"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Gradient for the text */}
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF79C6" />
                <stop offset="50%" stopColor="#BD93F9" />
                <stop offset="100%" stopColor="#8BE9FD" />
              </linearGradient>
              
              {/* Mask with bite marks */}
              <mask id="biteMask">
                {/* White = visible, black = hidden */}
                <rect x="0" y="0" width="500" height="180" fill="white" />
                
                {/* Bite marks as black circles/shapes that "eat away" the text */}
                {biteMarks.map(bite => (
                  <g key={bite.id} transform={`translate(${bite.x + 250}, ${bite.y + 90}) rotate(${bite.rotation})`}>
                    {/* Jagged bite shape */}
                    <ellipse cx="0" cy="0" rx={bite.size * 0.6} ry={bite.size * 0.4} fill="black" />
                    <circle cx={bite.size * 0.3} cy={-bite.size * 0.2} r={bite.size * 0.25} fill="black" />
                    <circle cx={-bite.size * 0.25} cy={bite.size * 0.15} r={bite.size * 0.2} fill="black" />
                    <circle cx={bite.size * 0.1} cy={bite.size * 0.25} r={bite.size * 0.18} fill="black" />
                  </g>
                ))}
              </mask>
              
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Drip effect filter */}
              <filter id="drip">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
              </filter>
            </defs>
            
            {/* Background glow */}
            <text
              x="250"
              y="130"
              textAnchor="middle"
              className="font-black"
              style={{
                fontSize: '160px',
                fill: 'rgba(255, 121, 198, 0.3)',
                filter: 'blur(20px)'
              }}
            >
              2026
            </text>
            
            {/* Main text with bite mask */}
            <text
              x="250"
              y="130"
              textAnchor="middle"
              className="font-black"
              style={{
                fontSize: '160px',
                fill: 'url(#textGradient)',
                filter: 'url(#glow)'
              }}
              mask="url(#biteMask)"
            >
              2026
            </text>
            
            {/* Bite mark edges (darker outlines where bites occurred) */}
            {biteMarks.map(bite => (
              <g key={`edge-${bite.id}`} transform={`translate(${bite.x + 250}, ${bite.y + 90}) rotate(${bite.rotation})`}>
                <ellipse 
                  cx="0" 
                  cy="0" 
                  rx={bite.size * 0.62} 
                  ry={bite.size * 0.42} 
                  fill="none" 
                  stroke="rgba(255, 0, 100, 0.6)" 
                  strokeWidth="3"
                  style={{ filter: 'blur(2px)' }}
                />
                {/* Dripping effect */}
                <path
                  d={`M ${-bite.size * 0.3} ${bite.size * 0.3} Q ${-bite.size * 0.25} ${bite.size * 0.8} ${-bite.size * 0.2} ${bite.size * 0.6}`}
                  stroke="rgba(255, 0, 100, 0.4)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${bite.size * 0.1} ${bite.size * 0.35} Q ${bite.size * 0.15} ${bite.size * 0.9} ${bite.size * 0.2} ${bite.size * 0.7}`}
                  stroke="rgba(255, 0, 100, 0.3)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>
          
          {/* Particle effects at bite locations */}
          {biteMarks.slice(-5).map(bite => (
            <div
              key={`particle-${bite.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `calc(50% + ${bite.x}px)`,
                top: `calc(50% + ${bite.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-ping"
                  style={{
                    background: 'linear-gradient(135deg, #FF79C6, #BD93F9)',
                    left: `${Math.cos(i * 90 * Math.PI / 180) * 20}px`,
                    top: `${Math.sin(i * 90 * Math.PI / 180) * 20}px`,
                    animationDuration: '1s',
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Damage indicator overlay */}
        {biteMarks.length > 0 && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background: `radial-gradient(circle, rgba(255,0,0,${Math.min(biteMarks.length * 0.02, 0.3)}) 0%, transparent 70%)`,
              animation: biteMarks.length > 10 ? 'pulse 0.5s infinite' : 'none'
            }}
          />
        )}
      </div>
    </>
  )
}

export default EatableText

