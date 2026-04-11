'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PersonalityMode, PersonalityModes, savePersonalityPreference } from '@/lib/ai/personality-engine'
import { Sparkles, Briefcase, Heart, Code } from 'lucide-react'

export function PersonalityModeSwitcher() {
  const [mode, setMode] = useState<PersonalityMode>('professional')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('personality_mode')
      if (saved && ['professional', 'friendly', 'technical'].includes(saved)) {
        setMode(saved as PersonalityMode)
      }
    }
  }, [])

  const handleModeChange = (newMode: PersonalityMode) => {
    setMode(newMode)
    savePersonalityPreference(newMode)
    
    // Trigger page reload or state update for personality-aware content
    window.location.hash = `personality=${newMode}`
  }

  if (!mounted) return null

  const icons: Record<PersonalityMode, React.ReactNode> = {
    professional: <Briefcase className="w-4 h-4" />,
    friendly: <Heart className="w-4 h-4" />,
    technical: <Code className="w-4 h-4" />,
  }

  const currentProfile = PersonalityModes[mode]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30 backdrop-blur-md hover:bg-indigo-600/30"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="capitalize">{mode} Mode</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {Object.entries(PersonalityModes).map(([key, profile]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleModeChange(key as PersonalityMode)}
              className="cursor-pointer flex items-center gap-2"
            >
              {icons[key as PersonalityMode]}
              <div className="flex-1">
                <div className="font-semibold capitalize">{key}</div>
                <div className="text-xs text-gray-400">{profile.tone}</div>
              </div>
              {mode === key && <div className="w-2 h-2 rounded-full bg-green-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Current Mode Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-xs text-gray-400 max-w-40"
      >
        Content is tailored to {mode} audience • {currentProfile.cta}
      </motion.div>
    </motion.div>
  )
}
