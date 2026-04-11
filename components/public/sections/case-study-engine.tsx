"use client"

import { motion } from "framer-motion"
import { TrendingUp, Zap, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const caseStudies = [
  {
    company: "TechStartup Inc",
    industry: "SaaS",
    problem: "Manual customer onboarding taking 2 weeks per client",
    solution: "AI-powered automation workflow",
    result: "Reduced to 2 hours per client",
    metrics: [
      { icon: Clock, label: "Time Saved", value: "98%" },
      { icon: TrendingUp, label: "Revenue Growth", value: "+45%" },
      { icon: Zap, label: "Automation Rate", value: "95%" },
    ],
  },
  {
    company: "Digital Agency Co",
    industry: "Agency",
    problem: "Struggling to manage multiple client campaigns",
    solution: "Custom CRM + AI analytics dashboard",
    result: "Unified management platform with predictive insights",
    metrics: [
      { icon: BarChart3, label: "Conversion Rate", value: "+35%" },
      { icon: TrendingUp, label: "Efficiency", value: "3x" },
      { icon: Zap, label: "Response Time", value: "-70%" },
    ],
  },
  {
    company: "E-Commerce Store",
    industry: "Retail",
    problem: "Low customer retention and engagement",
    solution: "AI recommendation engine + email automation",
    result: "Personalized customer experience",
    metrics: [
      { icon: TrendingUp, label: "Repeat Purchases", value: "+60%" },
      { icon: BarChart3, label: "AOV Increase", value: "+42%" },
      { icon: Zap, label: "Churn Reduction", value: "-48%" },
    ],
  },
]

export function CaseStudyEngine() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">Proven Results</h2>
        <p className="text-lg text-muted-foreground">Real projects, real impact</p>
      </motion.div>

      <div className="space-y-8">
        {caseStudies.map((study, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8 bg-card">
              {/* Left Side - Problem & Solution */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase">
                    {study.industry}
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{study.company}</h3>
                </div>

                <div>
                  <h4 className="font-semibold text-red-500 mb-2">The Challenge</h4>
                  <p className="text-muted-foreground">{study.problem}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-500 mb-2">Our Solution</h4>
                  <p className="text-muted-foreground">{study.solution}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-500 mb-2">The Result</h4>
                  <p className="text-lg font-semibold text-green-600">{study.result}</p>
                </div>

                <Button>View Full Case Study</Button>
              </div>

              {/* Right Side - Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {study.metrics.map((metric, midx) => {
                  const Icon = metric.icon
                  return (
                    <motion.div
                      key={midx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: midx * 0.1 }}
                      className="bg-muted/50 p-4 rounded-lg text-center"
                    >
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
