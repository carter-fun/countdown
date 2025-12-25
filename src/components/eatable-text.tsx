"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Ghouls } from './ghouls'

interface BiteMark {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  createdAt: number
}

export function EatableText() {
  const [biteMarks, setBiteMarks] = useState<BiteMark[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(n => n + 1)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const handleBite = useCallback((ghoulX: number, ghoulY: number) => {
    if (!svgRef.current) return
    
    const svgRect = svgRef.current.getBoundingClientRect()
    
    const viewportX = (ghoulX / 100) * window.innerWidth
    const viewportY = (ghoulY / 100) * window.innerHeight
    
    const relativeX = viewportX - svgRect.left
    const relativeY = viewportY - svgRect.top
    
    const svgX = (relativeX / svgRect.width) * 500
    const svgY = (relativeY / svgRect.height) * 180
    
    if (svgX >= -50 && svgX <= 550 && svgY >= -50 && svgY <= 230) {
      const newBite: BiteMark = {
        id: Date.now() + Math.random(),
        x: svgX,
        y: svgY,
        size: 20 + Math.random() * 30,
        rotation: Math.random() * 360,
        createdAt: Date.now()
      }
      
      setBiteMarks(prev => [...prev, newBite])
    }
  }, [])

  const getBloodOpacity = (createdAt: number) => {
    const age = Date.now() - createdAt
    const fadeDuration = 2000
    if (age >= fadeDuration) return 0
    return 1 - (age / fadeDuration)
  }

  return (
    <>
      <Ghouls onBite={handleBite} />
      
      <div className="relative w-full max-w-[900px] mx-auto">
        <svg 
          ref={svgRef}
          viewBox="0 0 500 180" 
          className="w-full h-auto"
          style={{ overflow: 'visible' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF79C6" />
              <stop offset="50%" stopColor="#BD93F9" />
              <stop offset="100%" stopColor="#8BE9FD" />
            </linearGradient>
            
            <mask id="biteMask">
              <rect x="-100" y="-50" width="700" height="300" fill="white" />
              
              {biteMarks.map(bite => (
                <g key={bite.id} transform={`translate(${bite.x}, ${bite.y}) rotate(${bite.rotation})`}>
                  <circle cx="0" cy="0" r={bite.size * 0.5} fill="black" />
                  <circle cx={bite.size * 0.3} cy={-bite.size * 0.2} r={bite.size * 0.35} fill="black" />
                  <circle cx={-bite.size * 0.25} cy={bite.size * 0.2} r={bite.size * 0.3} fill="black" />
                  <circle cx={bite.size * 0.15} cy={bite.size * 0.3} r={bite.size * 0.25} fill="black" />
                  <circle cx={-bite.size * 0.35} cy={-bite.size * 0.15} r={bite.size * 0.28} fill="black" />
                </g>
              ))}
            </mask>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <text
            x="250"
            y="130"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="160"
            fill="rgba(255, 121, 198, 0.3)"
            style={{ filter: 'blur(15px)' }}
          >
            2026
          </text>
          
          <text
            x="250"
            y="130"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="160"
            fill="url(#textGradient)"
            filter="url(#glow)"
            mask="url(#biteMask)"
          >
            2026
          </text>
          
          {biteMarks.map(bite => {
            const opacity = getBloodOpacity(bite.createdAt)
            if (opacity <= 0) return null
            
            return (
              <g 
                key={`edge-${bite.id}`} 
                transform={`translate(${bite.x}, ${bite.y}) rotate(${bite.rotation})`}
                opacity={opacity}
              >
                <circle 
                  cx="0" 
                  cy="0" 
                  r={bite.size * 0.55} 
                  fill="none" 
                  stroke="rgba(255, 50, 100, 0.7)" 
                  strokeWidth="3"
                />
                <line
                  x1={-bite.size * 0.2}
                  y1={bite.size * 0.4}
                  x2={-bite.size * 0.15}
                  y2={bite.size * 0.9}
                  stroke="rgba(255, 50, 100, 0.8)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1={bite.size * 0.1}
                  y1={bite.size * 0.45}
                  x2={bite.size * 0.15}
                  y2={bite.size * 1.1}
                  stroke="rgba(255, 50, 100, 0.6)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            )
          })}
        </svg>
      </div>
    </>
  )
}

export default EatableText
