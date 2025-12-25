"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white/5 border-white/20 hover:bg-white/10 hover:border-pink-500/50 transition-all"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-pink-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="bg-black/80 backdrop-blur-xl border-white/20"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4 text-pink-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
        >
          <span className="mr-2 h-4 w-4 flex items-center justify-center text-purple-400">⚙</span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToggle

