"use client"

import { LaserFlow } from "@/components/laser-flow"
import { Countdown } from "@/components/countdown"
import { ModeToggle } from "@/components/mode-toggle"
import SplashCursor from "@/components/splash-cursor"
import { EatableText } from "@/components/eatable-text"

// New Year 2026 - January 1st, 2026 at midnight
const NEW_YEAR_2026 = new Date("2026-01-01T00:00:00")

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060010]">
      {/* LaserFlow Background */}
      <div className="fixed inset-0 z-0">
        <LaserFlow
          color="#FF79C6"
          horizontalBeamOffset={0.0}
          verticalBeamOffset={-0.2}
          verticalSizing={2.5}
          horizontalSizing={0.6}
          fogIntensity={0.5}
          wispIntensity={6.0}
        />
      </div>

      {/* Splash Cursor Effect */}
      <SplashCursor 
        SPLAT_RADIUS={0.15}
        SPLAT_FORCE={5000}
        DENSITY_DISSIPATION={2.5}
        VELOCITY_DISSIPATION={1.5}
        COLOR_UPDATE_SPEED={8}
        CURL={5}
      />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ModeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4">
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,121,198,0.5)]">
              NEW YEAR
            </span>
          </h1>
          {/* Eatable 2026 with Ghouls */}
          <EatableText />
        </div>

        {/* Countdown Timer */}
        <Countdown targetDate={NEW_YEAR_2026} />

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-pink-500 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-40" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: "1.5s" }} />

        {/* Footer Message */}
        <p className="mt-20 text-sm md:text-base text-white/50 text-center max-w-md">
          Defend 2026! The ghouls are eating it! Hover over them to destroy them! 👻🦷
        </p>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Ensure dark mode background persists */
        .dark body,
        body {
          background-color: #060010 !important;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #060010;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF79C6, #BD93F9);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #FF79C6, #8BE9FD);
        }
      `}</style>
    </main>
  )
}
