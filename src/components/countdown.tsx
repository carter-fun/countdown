"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownProps {
  targetDate: Date
  className?: string
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ]

  if (!mounted) {
    return (
      <div className={cn("flex gap-4 md:gap-8", className)}>
        {timeUnits.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="countdown-box">
              <span className="countdown-number">--</span>
            </div>
            <span className="countdown-label">Loading</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex gap-4 md:gap-8", className)}>
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="countdown-box">
            <span className="countdown-number">
              {unit.value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="countdown-label">{unit.label}</span>
        </div>
      ))}

      <style jsx>{`
        .countdown-box {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 121, 198, 0.3);
          border-radius: 16px;
          padding: 1.5rem 2rem;
          min-width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 0 30px rgba(255, 121, 198, 0.2),
            inset 0 0 30px rgba(255, 121, 198, 0.05);
          transition: all 0.3s ease;
        }

        .countdown-box:hover {
          border-color: rgba(255, 121, 198, 0.6);
          box-shadow: 
            0 0 50px rgba(255, 121, 198, 0.4),
            inset 0 0 30px rgba(255, 121, 198, 0.1);
          transform: translateY(-4px);
        }

        .countdown-number {
          font-size: 3rem;
          font-weight: 700;
          font-family: var(--font-geist-mono), monospace;
          color: white;
          text-shadow: 
            0 0 20px rgba(255, 121, 198, 0.8),
            0 0 40px rgba(255, 121, 198, 0.4);
          line-height: 1;
        }

        .countdown-label {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @media (max-width: 640px) {
          .countdown-box {
            padding: 1rem 1.25rem;
            min-width: 60px;
            border-radius: 12px;
          }

          .countdown-number {
            font-size: 1.75rem;
          }

          .countdown-label {
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Countdown

