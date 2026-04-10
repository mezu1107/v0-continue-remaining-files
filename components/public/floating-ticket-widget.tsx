"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Ticket, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FloatingTicketWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl flex items-center justify-center hover:shadow-emerald-500/50 transition-all duration-300 group"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Ticket className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
          </motion.div>
          
          {/* Pulse Animation */}
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-green-400 opacity-50"
            />
          )}
        </motion.button>
      </motion.div>

      {/* Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-8 z-40 w-80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Ticket className="w-5 h-5" />
                <h3 className="font-bold text-lg">Support Ticket</h3>
              </div>
              <p className="text-sm text-white/80">
                Get instant help from our support team
              </p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Quick Actions:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Submit a support ticket</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Track your requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Get instant responses</span>
                  </li>
                </ul>
              </div>

              <Link href="/tickets" className="block w-full">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 group"
                  onClick={() => setIsOpen(false)}
                >
                  Open Support Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">24/7</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-500">Instant</div>
                  <div className="text-xs text-muted-foreground">Responses</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
