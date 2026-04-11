"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    title: "Business Type",
    options: ["Startup", "Agency", "Enterprise", "E-commerce"],
  },
  {
    title: "Your Goal",
    options: ["Automation", "Growth", "Cost Reduction", "Integration"],
  },
  {
    title: "Budget Range",
    options: ["<$1k", "$1-5k", "$5-20k", "$20k+"],
  },
]

export function SystemWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (option: string) => {
    setSelections((prev) => ({ ...prev, [currentStep]: option }))
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setShowResult(true)
      }
    }, 300)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <section className="py-20 px-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8" />
          Build Your Perfect System
        </h2>
        <p className="text-lg text-muted-foreground">
          Answer 3 quick questions and get a custom architecture plan
        </p>
      </motion.div>

      <div className="bg-card border rounded-lg p-8">
        {!showResult ? (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-6">{steps[currentStep].title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {steps[currentStep].options.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => handleSelect(option)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selections[currentStep] === option
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selections[currentStep] === option && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold">Your Custom Plan is Ready!</h3>
            <div className="bg-muted/50 p-6 rounded-lg space-y-3 text-left">
              <p>
                <strong>Business:</strong> {selections[0]}
              </p>
              <p>
                <strong>Goal:</strong> {selections[1]}
              </p>
              <p>
                <strong>Budget:</strong> {selections[2]}
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
              <p className="font-semibold text-lg mb-2">Recommended Architecture</p>
              <p className="text-sm text-muted-foreground">
                Full-stack AI-powered system with real-time automation, custom integrations, and
                24/7 support. Timeline: 4-8 weeks. Expected ROI: 300%+
              </p>
            </div>
            <Button size="lg" className="w-full">
              Get Detailed Proposal <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
