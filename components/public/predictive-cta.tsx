'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Zap, TrendingUp, Clock } from 'lucide-react'

type UserBehavior = 'browsing' | 'interested' | 'ready' | 'evaluating'
type CTAVariant = {
  text: string
  subtext: string
  icon: React.ReactNode
  color: string
  action: string
}

const CTAVariants: Record<UserBehavior, CTAVariant> = {
  browsing: {
    text: 'Learn More',
    subtext: 'Explore our solutions',
    icon: <ArrowRight className="w-4 h-4" />,
    color: 'bg-blue-600 hover:bg-blue-700',
    action: 'explore',
  },
  interested: {
    text: 'See Demo',
    subtext: 'Watch how it works',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-purple-600 hover:bg-purple-700',
    action: 'demo',
  },
  evaluating: {
    text: 'Compare Plans',
    subtext: 'Find the right fit',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'bg-amber-600 hover:bg-amber-700',
    action: 'compare',
  },
  ready: {
    text: 'Start Now',
    subtext: 'Get started in 5 minutes',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-green-600 hover:bg-green-700',
    action: 'start',
  },
}

export function PredictiveCTA() {
  const [behavior, setBehavior] = useState<UserBehavior>('browsing')
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [scrollDepth, setScrollDepth] = useState(0)

  // Track user behavior
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage((prev) => prev + 1)
    }, 1000)

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const depth = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollDepth(Math.min(depth, 100))
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Predict behavior based on metrics
  useEffect(() => {
    if (timeOnPage > 120 && scrollDepth > 70) {
      setBehavior('ready')
    } else if (timeOnPage > 60 && scrollDepth > 50) {
      setBehavior('evaluating')
    } else if (timeOnPage > 30 || scrollDepth > 30) {
      setBehavior('interested')
    } else {
      setBehavior('browsing')
    }
  }, [timeOnPage, scrollDepth])

  const cta = CTAVariants[behavior]
  const confidence = Math.min(100, timeOnPage * 2 + scrollDepth)

  return (
    <motion.div
      layout
      className="fixed bottom-6 right-6 z-40 max-w-sm"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={behavior}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl border border-white/10 p-6 backdrop-blur-md"
        >
          <div className="space-y-4">
            {/* AI Confidence Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">AI-OPTIMIZED CTA</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">{confidence.toFixed(0)}% confident</span>
              </div>
            </div>

            {/* CTA Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{cta.icon}</span>
                <h3 className="font-bold text-white text-lg">{cta.text}</h3>
              </div>
              <p className="text-sm text-gray-400">{cta.subtext}</p>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 rounded-lg px-3 py-2">
              <Clock className="w-3 h-3" />
              <span>{Math.floor(timeOnPage)}s on page</span>
              <span>•</span>
              <span>{Math.floor(scrollDepth)}% scrolled</span>
            </div>

            {/* Button */}
            <Button
              className={`w-full ${cta.color} text-white font-semibold`}
              size="sm"
            >
              {cta.text}
              {cta.icon}
            </Button>

            {/* AI Explanation */}
            <p className="text-xs text-gray-500 text-center">
              {behavior === 'browsing' && 'We noticed you&apos;re exploring. Let&apos;s show you what makes us special.'}
              {behavior === 'interested' && 'You seem interested! See how our solution works.'}
              {behavior === 'evaluating' && 'Ready to compare? Find the perfect plan for you.'}
              {behavior === 'ready' && 'You&apos;re ready to get started! Join thousands of satisfied customers.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
