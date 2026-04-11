'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Zap, Gift, TrendingUp, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface LeadMagnet {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  fileSize: string
  value: string
  conversionRate: number
  relevanceScore: number
}

interface UserProfile {
  pageViews: number
  timeOnSite: number
  hasClicked: boolean
  interests: string[]
}

const AvailableMagnets: LeadMagnet[] = [
  {
    id: 'seo-checklist',
    title: 'SEO Mastery Checklist',
    description: 'Complete 50-point SEO optimization guide',
    icon: <TrendingUp className="w-6 h-6" />,
    fileSize: '2.5 MB',
    value: '$47',
    conversionRate: 8.2,
    relevanceScore: 0,
  },
  {
    id: 'digital-strategy',
    title: 'Digital Strategy Template',
    description: 'Ready-to-use framework used by agencies',
    icon: <Zap className="w-6 h-6" />,
    fileSize: '1.8 MB',
    value: '$29',
    conversionRate: 6.5,
    relevanceScore: 0,
  },
  {
    id: 'web-audit-tool',
    title: 'Website Audit Tool',
    description: 'Automated analysis revealing hidden issues',
    icon: <Download className="w-6 h-6" />,
    fileSize: '3.2 MB',
    value: '$99',
    conversionRate: 4.3,
    relevanceScore: 0,
  },
  {
    id: 'conversion-guide',
    title: 'Conversion Optimization Guide',
    description: '10 proven strategies to boost conversions',
    icon: <Gift className="w-6 h-6" />,
    fileSize: '1.5 MB',
    value: '$37',
    conversionRate: 7.1,
    relevanceScore: 0,
  },
]

export function LeadMagnetEngine() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    pageViews: 1,
    timeOnSite: 0,
    hasClicked: false,
    interests: [],
  })
  const [selectedMagnet, setSelectedMagnet] = useState<LeadMagnet | null>(null)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Track user behavior and select best magnet
  useEffect(() => {
    const timer = setInterval(() => {
      setUserProfile((prev) => ({
        ...prev,
        timeOnSite: prev.timeOnSite + 1,
      }))
    }, 1000)

    // Calculate relevance scores
    const magnetsWithScores = AvailableMagnets.map((magnet) => {
      let score = magnet.conversionRate

      // Boost relevance based on time spent
      if (userProfile.timeOnSite > 30) score += 10
      if (userProfile.timeOnSite > 60) score += 15

      // Boost based on page views
      if (userProfile.pageViews > 2) score += 8
      if (userProfile.pageViews > 5) score += 12

      return { ...magnet, relevanceScore: score }
    })

    // Select magnet with highest relevance
    const bestMagnet = magnetsWithScores.reduce((prev, current) =>
      current.relevanceScore > prev.relevanceScore ? current : prev
    )

    setSelectedMagnet(bestMagnet)
    setLoading(false)

    return () => clearInterval(timer)
  }, [userProfile.pageViews, userProfile.timeOnSite])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !selectedMagnet) return

    try {
      // Send to API
      const response = await fetch('/api/leads/magnet-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          magnetId: selectedMagnet.id,
          magnetTitle: selectedMagnet.title,
          userProfile,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        toast.success(`${selectedMagnet.title} is being sent to your email!`)
      } else {
        toast.error('Failed to process your request')
      }
    } catch (error) {
      console.error('Lead magnet submission error:', error)
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Analyzing your interests...</div>
  }

  if (!selectedMagnet) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30 overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                Unlock Your Free Resource
              </CardTitle>
              <CardDescription className="text-base">
                Get instant access to {selectedMagnet.title.toLowerCase()}
              </CardDescription>
            </div>
            <div className="text-4xl">{selectedMagnet.icon}</div>
          </div>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <div className="space-y-6">
              {/* Magnet Details */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {selectedMagnet.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedMagnet.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-400">VALUE</p>
                    <p className="text-lg font-bold text-green-400">
                      {selectedMagnet.value}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">FILE SIZE</p>
                    <p className="text-lg font-bold text-blue-400">
                      {selectedMagnet.fileSize}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">FORMAT</p>
                    <p className="text-lg font-bold text-purple-400">PDF + Bonus</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 placeholder-gray-400"
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Get Free Access
                </Button>
              </form>

              {/* Trust Signals */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Instant download
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Privacy guaranteed
                </div>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="text-center space-y-4 py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex justify-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">
                Check Your Email!
              </h3>
              <p className="text-gray-400">
                {selectedMagnet.title} has been sent to <span className="font-semibold text-white">{email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Also look for our complimentary video walkthrough in your inbox
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
