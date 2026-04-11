"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium">Ready to Get Started?</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Let's Build Something{" "}
            <span className="gradient-text">Amazing Together</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Transform your ideas into reality with our expert team. Whether it's a website, 
            mobile app, or enterprise solution, we're here to help you succeed.
          </p>

          {/* CTA Buttons - Single Primary Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all glow-primary group px-8 w-full sm:w-auto"
              >
                Start Your Project
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
