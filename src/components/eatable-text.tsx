"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Ghouls } from './ghouls'

interface BiteMark {
  id: number
  x: number  // SVG viewBox coordinates (0-500)
  y: number  // SVG viewBox coordinates (0-180)
  size: number
  rotation: number
}

export function EatableText() {
  const [biteMarks, setBiteMarks] = useState<BiteMark[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  const handleBite = useCallback((ghoulX: number, ghoulY: number) => {
    // ghoulX and ghoulY are percentages (0-100) of the viewport
    // We need to convert them to SVG viewBox coordinates (0-500 for x, 0-180 for y)
    
    if (!svgRef.current) return
    
    const svgRect = svgRef.current.getBoundingClientRect()
    
    // Convert viewport percentage to actual pixel position
    const viewportX = (ghoulX / 100) * window.innerWidth
    const viewportY = (ghoulY / 100) * window.innerHeight
    
    // Check if the ghoul is actually over the SVG element
    const relativeX = viewportX - svgRect.left
    const relativeY = viewportY - svgRect.top
    
    // Convert pixel position to SVG viewBox coordinates
    // viewBox is "0 0 500 180"
    const svgX = (relativeX / svgRect.width) * 500
    const svgY = (relativeY / svgRect.height) * 180
    
    // Only add bite if it's within the text area (with some margin)
    if (svgX >= -50 && svgX <= 550 && svgY >= -50 && svgY <= 230) {
      const newBite: BiteMark = {
        id: Date.now() + Math.random(),
        x: svgX,
        y: svgY,
        size: 20 + Math.random() * 30,
        rotation: Math.random() * 360
      }
      
      setBiteMarks(prev => [...prev, newBite])
    }
  }, [])

  return (
    <>
      <Ghouls onBite={handleBite} />
      
      <div className="relative w-full max-w-[900px] mx-auto">
        {/* SVG container for the text with mask */}
        <svg 
          ref={svgRef}
          viewBox="0 0 500 180" 
          className="w-full h-auto"
          style={{ overflow: 'visible' }}
          preserveAspectRatio="xMidYMid meet"
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
              {/* White = visible */}
              <rect x="-100" y="-50" width="700" height="300" fill="white" />
              
              {/* Bite marks as black shapes that "eat away" the text */}
              {biteMarks.map(bite => (
                <g key={bite.id} transform={`translate(${bite.x}, ${bite.y}) rotate(${bite.rotation})`}>
                  {/* Jagged bite shape - multiple overlapping circles for realistic bite */}
                  <circle cx="0" cy="0" r={bite.size * 0.5} fill="black" />
                  <circle cx={bite.size * 0.3} cy={-bite.size * 0.2} r={bite.size * 0.35} fill="black" />
                  <circle cx={-bite.size * 0.25} cy={bite.size * 0.2} r={bite.size * 0.3} fill="black" />
                  <circle cx={bite.size * 0.15} cy={bite.size * 0.3} r={bite.size * 0.25} fill="black" />
                  <circle cx={-bite.size * 0.35} cy={-bite.size * 0.15} r={bite.size * 0.28} fill="black" />
                </g>
              ))}
            </mask>
            
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background glow */}
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
          
          {/* Main text with bite mask */}
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
          
          {/* Bite mark edges with blood drips */}
          {biteMarks.map(bite => (
            <g key={`edge-${bite.id}`} transform={`translate(${bite.x}, ${bite.y}) rotate(${bite.rotation})`}>
              {/* Glowing edge around bite */}
              <circle 
                cx="0" 
                cy="0" 
                r={bite.size * 0.55} 
                fill="none" 
                stroke="rgba(255, 50, 100, 0.5)" 
                strokeWidth="3"
              />
              {/* Blood drips */}
              <line
                x1={-bite.size * 0.2}
                y1={bite.size * 0.4}
                x2={-bite.size * 0.15}
                y2={bite.size * 0.9}
                stroke="rgba(255, 50, 100, 0.6)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1={bite.size * 0.1}
                y1={bite.size * 0.45}
                x2={bite.size * 0.15}
                y2={bite.size * 1.1}
                stroke="rgba(255, 50, 100, 0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx={-bite.size * 0.15}
                cy={bite.size * 0.95}
                r="4"
                fill="rgba(255, 50, 100, 0.5)"
              />
              <circle
                cx={bite.size * 0.15}
                cy={bite.size * 1.15}
                r="3"
                fill="rgba(255, 50, 100, 0.4)"
              />
            </g>
          ))}
        </svg>
        
        {/* Damage warning overlay */}
        {biteMarks.length > 5 && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              boxShadow: `inset 0 0 ${Math.min(biteMarks.length * 10, 100)}px rgba(255, 0, 0, ${Math.min(biteMarks.length * 0.03, 0.4)})`,
            }}
          />
        )}
      </div>
    </>
  )
}

export default EatableText
