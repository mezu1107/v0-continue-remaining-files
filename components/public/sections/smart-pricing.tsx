"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const pricingPlans = {
  startup: {
    name: "Startup",
    basePrice: 999,
    description: "Perfect for growing businesses",
    features: ["Up to 5 users", "Basic automation", "Email support", "Monthly reports"],
  },
  business: {
    name: "Business",
    basePrice: 2999,
    description: "For established companies",
    features: [
      "Unlimited users",
      "Advanced automation",
      "Priority support",
      "Real-time analytics",
      "Custom integrations",
    ],
  },
  enterprise: {
    name: "Enterprise",
    basePrice: 9999,
    description: "For large organizations",
    features: [
      "Dedicated support",
      "AI-powered features",
      "Custom development",
      "SLA guarantee",
      "White-label option",
    ],
  },
}

export function SmartPricing() {
  const [users, setUsers] = useState(5)
  const [recommended, setRecommended] = useState("business")

  const calculatePrice = (plan: string) => {
    const base = pricingPlans[plan as keyof typeof pricingPlans].basePrice
    const userMultiplier = Math.max(1, users / 5)
    return Math.round(base * userMultiplier)
  }

  // Recommend plan based on user count
  React.useEffect(() => {
    if (users <= 5) setRecommended("startup")
    else if (users <= 50) setRecommended("business")
    else setRecommended("enterprise")
  }, [users])

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">Smart Pricing</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Adjust for your team size and see instant recommendation
        </p>

        {/* User Slider */}
        <div className="bg-card border rounded-lg p-8 mb-12 max-w-md mx-auto">
          <label className="block text-sm font-semibold mb-4">Team Size: {users} users</label>
          <Slider
            value={[users]}
            onValueChange={([val]) => setUsers(val)}
            min={1}
            max={100}
            step={1}
            className="mb-4"
          />
          <p className="text-xs text-muted-foreground">
            Drag to adjust team size and see pricing updates
          </p>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(pricingPlans).map(([key, plan], idx) => {
          const isRecommended = key === recommended
          const price = calculatePrice(key)

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-lg p-8 relative transition-all ${
                isRecommended ? "ring-2 ring-primary scale-105 shadow-xl" : ""
              }`}
            >
              {isRecommended && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full flex items-center gap-1 text-sm font-semibold"
                >
                  <Sparkles className="w-4 h-4" />
                  Best for You
                </motion.div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

              {/* Price Display */}
              <motion.div
                key={price}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <div className="text-4xl font-bold">
                  ${price.toLocaleString()}
                  <span className="text-lg text-muted-foreground">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Billed monthly, scales with team</p>
              </motion.div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, fidx) => (
                  <motion.div
                    key={fidx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: fidx * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button className="w-full" variant={isRecommended ? "default" : "outline"}>
                Get Started
              </Button>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
