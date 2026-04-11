"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const suggestions = [
  "E-Commerce Store",
  "CRM System",
  "Automation Platform",
  "AI Chatbot",
  "Dashboard",
]

export function HeroSection() {
  const [input, setInput] = useState("")

  const handleGenerate = () => {
    if (input.trim()) {
      // Track the input and navigate to wizard/demo
      localStorage.setItem("systemDescription", input)
      window.location.href = "/get-started"
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Clean Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background z-0" />
      
      {/* Subtle Floating Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-1" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-1" />

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Business Systems</span>
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Build Your AI-Powered
              <span className="block gradient-text">Business System Instantly</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe what you want to build, and our AI will design a custom system tailored to your business needs.
            </p>
          </motion.div>

          {/* Input Box with Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-3 shadow-lg">
              <Input
                type="text"
                placeholder="Describe what you want to build…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                className="border-0 bg-transparent text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
              <Button
                onClick={handleGenerate}
                className="gap-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all whitespace-nowrap"
                size="lg"
              >
                Generate My System
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setInput(suggestion)
                    localStorage.setItem("systemDescription", suggestion)
                    window.location.href = "/get-started"
                  }}
                  className="px-4 py-2 text-sm rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 pt-12 border-t border-primary/10"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-sm text-muted-foreground">Systems Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
