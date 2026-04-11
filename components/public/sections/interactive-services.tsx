"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Zap, Code, BarChart3, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "automation",
    title: "AI Automation",
    description: "Smart workflow automation",
    icon: Workflow,
    process: [
      "Step 1: Map your current process",
      "Step 2: Identify automation points",
      "Step 3: Deploy AI automation",
      "Step 4: Monitor & optimize",
    ],
    pricing: "From $5,000/month",
    example: "Reduce manual work by 80%",
  },
  {
    id: "web-dev",
    title: "Web Development",
    description: "Custom web applications",
    icon: Code,
    process: [
      "Step 1: Requirements gathering",
      "Step 2: Design & architecture",
      "Step 3: Development & testing",
      "Step 4: Deployment & support",
    ],
    pricing: "From $3,000",
    example: "Production-ready in 4-8 weeks",
  },
  {
    id: "analytics",
    title: "Analytics & BI",
    description: "Data-driven insights",
    icon: BarChart3,
    process: [
      "Step 1: Data integration",
      "Step 2: Dashboard creation",
      "Step 3: Report automation",
      "Step 4: Action planning",
    ],
    pricing: "From $2,000/month",
    example: "150%+ ROI improvement",
  },
  {
    id: "seo",
    title: "SEO & Growth",
    description: "Organic traffic growth",
    icon: Zap,
    process: [
      "Step 1: Site audit & keywords",
      "Step 2: Content strategy",
      "Step 3: Technical optimization",
      "Step 4: Ranking & conversion",
    ],
    pricing: "From $1,500/month",
    example: "300% traffic increase (6 months)",
  },
]

export function InteractiveServices() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">Our Services (Click to Expand)</h2>
        <p className="text-lg text-muted-foreground">
          See our full process, pricing, and expected outcomes
        </p>
      </motion.div>

      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon
          const isExpanded = expanded === service.id

          return (
            <motion.div
              key={service.id}
              layout
              className="border rounded-lg bg-card overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : service.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <Icon className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t px-6 py-6 bg-muted/30"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Process Flow */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          Process Flow
                        </h4>
                        <div className="space-y-3">
                          {service.process.map((step, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex gap-3"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                                {idx + 1}
                              </div>
                              <p className="text-sm leading-relaxed">{step}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pricing</p>
                          <p className="text-2xl font-bold text-primary">{service.pricing}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Expected Outcome</p>
                          <p className="text-lg font-semibold">{service.example}</p>
                        </div>

                        <Button className="w-full">Get Custom Quote</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
