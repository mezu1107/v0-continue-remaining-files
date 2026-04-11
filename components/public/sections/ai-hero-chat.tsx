"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const suggestions = [
  "Build ecommerce system",
  "Automate my business",
  "Create CRM",
  "Setup marketing automation",
  "Launch SaaS",
]

export function AIHeroChat() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })

      const data = await res.json()
      setResponse(data.plan || "Processing your request...")
    } catch (error) {
      console.error("Error:", error)
      setResponse("Unable to process request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          AI-Powered System Planning
        </h2>
        <p className="text-lg text-muted-foreground">
          Tell our AI what you want to build, and get instant architecture, pricing & timeline
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-card rounded-lg border p-8 shadow-lg"
      >
        {/* Input Section */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative mb-4">
            <Input
              placeholder="What do you want to build?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pr-12 h-14 text-base"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </form>

        {/* Response Section */}
        {isLoading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/5" />
          </div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 bg-muted/50 p-6 rounded-lg border border-primary/20"
          >
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Your System Plan
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {response}
            </div>
            <Button className="w-full">
              Get Custom Proposal <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
