"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Lock, Award, Cloud, Cpu } from "lucide-react"

const badges = [
  { icon: Shield, label: "99.9% Uptime", desc: "Enterprise-grade reliability" },
  { icon: Zap, label: "Sub-100ms", desc: "Lightning fast performance" },
  { icon: Lock, label: "Enterprise Security", desc: "ISO 27001 certified" },
  { icon: Award, label: "SOC 2 Compliant", desc: "Full audit trail" },
  { icon: Cloud, label: "Global Infrastructure", desc: "Multi-region deployment" },
  { icon: Cpu, label: "AI-Powered", desc: "Latest ML algorithms" },
]

export function TrustBadges() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Trust</h2>
        <p className="text-muted-foreground">Built for scale, security, and reliability</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {badges.map((badge, idx) => {
          const Icon = badge.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="font-bold mb-1">{badge.label}</h3>
              <p className="text-sm text-muted-foreground">{badge.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
