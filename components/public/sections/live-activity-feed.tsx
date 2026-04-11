"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Zap, Users, Rocket } from "lucide-react"

const activities = [
  { icon: Rocket, text: "New automation deployed for TechCorp", time: "2 mins ago" },
  { icon: Users, text: "Client onboarding completed - 5 new systems live", time: "15 mins ago" },
  { icon: Zap, text: "AI system updated with 10 new features", time: "1 hour ago" },
  { icon: CheckCircle2, text: "Daily optimization run completed - 12% efficiency gain", time: "3 hours ago" },
  { icon: Rocket, text: "New integration: Stripe + Custom CRM", time: "5 hours ago" },
]

export function LiveActivityFeed() {
  const [displayedActivities, setDisplayedActivities] = useState(activities.slice(0, 3))

  useEffect(() => {
    // Simulate real-time activity updates
    const interval = setInterval(() => {
      setDisplayedActivities((prev) => {
        const newActivity = activities[Math.floor(Math.random() * activities.length)]
        return [newActivity, ...prev.slice(0, 2)]
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 px-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Live Activity Feed</h2>
        <p className="text-muted-foreground">See what we're building right now</p>
      </motion.div>

      <div className="bg-card border rounded-lg p-6 space-y-4">
        {displayedActivities.map((activity, idx) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Icon className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500"
              />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
