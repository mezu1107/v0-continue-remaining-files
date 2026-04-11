"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const demoExamples = [
  {
    question: "How can I grow my revenue by 50%?",
    response: "Based on your industry, here are 5 proven strategies:\n\n1. Implement AI automation to reduce costs by 30%\n2. Launch targeted marketing campaigns\n3. Create upsell opportunities\n4. Optimize your pricing\n5. Build strategic partnerships",
  },
  {
    question: "What's the best CRM for my business?",
    response: "I recommend a hybrid approach:\n\n- HubSpot for enterprise features\n- Custom API integration with your system\n- AI automation for lead scoring\n- Real-time sync with all platforms\n\nEstimated ROI: 300% in first year",
  },
  {
    question: "How to automate customer support?",
    response: "Three-tier automation strategy:\n\nTier 1: AI chatbot for common questions (70% handled)\nTier 2: Smart routing for complex issues\nTier 3: Human team for custom solutions\n\nResult: 40% cost reduction, improved CSAT",
  },
]

export function LiveAIDemo() {
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
    { role: "assistant", text: "Hi! I'm AM's AI Assistant. Ask me anything about growing your business." },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const example = demoExamples[Math.floor(Math.random() * demoExamples.length)]
      setMessages((prev) => [...prev, { role: "assistant", text: example.response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          Try Our AI Assistant Live
        </h2>
        <p className="text-lg text-muted-foreground">
          See how our AI understands your business and provides actionable insights
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border rounded-lg shadow-xl overflow-hidden"
      >
        {/* Chat Container */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-muted/30">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
              <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
            </motion.div>
          )}
        </div>

        {/* Input Section */}
        <form onSubmit={handleSubmit} className="border-t p-4 bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Ask our AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by AI - Try questions above or ask your own
          </p>
        </form>
      </motion.div>
    </section>
  )
}
