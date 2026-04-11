"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Zap, TrendingUp, Shield } from "lucide-react"

const metrics = [
  { icon: Activity, label: "Projects Delivered", value: 150, suffix: "+", color: "text-blue-500" },
  { icon: Zap, label: "Automation Systems", value: 89, suffix: "", color: "text-yellow-500" },
  { icon: TrendingUp, label: "AI Requests/Day", value: 15000, suffix: "+", color: "text-green-500" },
  { icon: Shield, label: "System Uptime", value: 99, suffix: "%", color: "text-purple-500" },
]

function AnimatedMetric({ icon: Icon, label, value, suffix, color }: any) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = value / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`w-16 h-16 rounded-full ${color} bg-opacity-20 flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className={`w-8 h-8 ${color}`} />
      </motion.div>
      <div className="text-4xl font-bold mb-2">
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  )
}

export function LiveMetrics() {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">Live Performance Metrics</h2>
        <p className="text-lg text-muted-foreground">Real-time stats from our platform</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-8">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <AnimatedMetric {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-6 bg-card border rounded-lg text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-green-500"
          />
          <span className="font-semibold">All Systems Operational</span>
        </div>
        <p className="text-sm text-muted-foreground">Last checked: 2 minutes ago</p>
      </motion.div>
    </section>
  )
}
