"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface DiaTextProps {
  words: string[]
  duration?: number
  className?: string
}

export function DiaText({ words, duration = 2000, className }: DiaTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayWord, setDisplayWord] = useState(words[0])
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      
      // After exit animation, change word
      setTimeout(() => {
        const nextIndex = (currentIndex + 1) % words.length
        setCurrentIndex(nextIndex)
        setDisplayWord(words[nextIndex])
        setIsAnimating(false)
      }, 400)
    }, duration)

    return () => clearInterval(interval)
  }, [currentIndex, duration, words])

  return (
    <span
      ref={containerRef}
      className={cn(
        "inline-block relative overflow-hidden",
        className
      )}
    >
      <span
        className={cn(
          "inline-block transition-all duration-400 ease-out",
          isAnimating
            ? "opacity-0 blur-sm translate-y-4 scale-95"
            : "opacity-100 blur-0 translate-y-0 scale-100"
        )}
        style={{
          background: isAnimating 
            ? "linear-gradient(90deg, #FF79C6, #BD93F9, #8BE9FD, #FF79C6)"
            : "linear-gradient(90deg, #FF79C6, #BD93F9)",
          backgroundSize: isAnimating ? "200% 100%" : "100% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: isAnimating ? "none" : "gradient-shift 3s ease infinite",
        }}
      >
        {displayWord}
      </span>
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </span>
  )
}

export default DiaText

