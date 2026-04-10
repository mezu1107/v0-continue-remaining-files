"use client"

import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Lightbulb, 
  PenTool, 
  Code, 
  TestTube, 
  Rocket 
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Discovery",
    description: "We start by understanding your business goals, target audience, and project requirements through detailed consultations.",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Strategy",
    description: "Our team develops a comprehensive roadmap with clear milestones, timelines, and deliverables tailored to your needs.",
  },
  {
    icon: PenTool,
    number: "03",
    title: "Design",
    description: "We create intuitive wireframes and stunning visual designs that align with your brand and delight your users.",
  },
  {
    icon: Code,
    number: "04",
    title: "Development",
    description: "Our engineers build your solution using cutting-edge technologies with clean, maintainable, and scalable code.",
  },
  {
    icon: TestTube,
    number: "05",
    title: "Testing",
    description: "Rigorous quality assurance ensures your product is bug-free, performant, and ready for real-world use.",
  },
  {
    icon: Rocket,
    number: "06",
    title: "Launch",
    description: "We deploy your solution and provide ongoing support, maintenance, and optimization for continued success.",
  },
]

export function ProcessSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="process">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6 text-balance">
            From Idea to{" "}
            <span className="gradient-text">Reality</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our proven development process ensures your project is delivered on time, within budget, and exceeds expectations.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative lg:grid lg:grid-cols-2 lg:gap-8 items-center",
                  index % 2 === 0 ? "" : "lg:direction-rtl"
                )}
              >
                {/* Content */}
                <div className={cn(
                  "lg:text-right",
                  index % 2 === 1 && "lg:text-left lg:col-start-2"
                )}>
                  <div className={cn(
                    "inline-flex items-center gap-4 mb-4",
                    index % 2 === 1 && "lg:flex-row-reverse"
                  )}>
                    <span className="text-5xl font-bold text-muted-foreground/20">{step.number}</span>
                    <div className="size-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <step.icon className="size-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Timeline Node */}
                <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="size-4 rounded-full bg-gradient-to-br from-primary to-accent ring-4 ring-background"
                  />
                </div>

                {/* Empty space for grid alignment */}
                <div className={cn(
                  "hidden lg:block",
                  index % 2 === 1 && "lg:col-start-1 lg:row-start-1"
                )} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
