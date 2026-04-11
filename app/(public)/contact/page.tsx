"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ParticlesBackground } from "@/components/public/particles-background"
import { toast } from "sonner"

// --------------------------
// Contact Info Section
// --------------------------
const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "contact@amenterprises.tech",
    href: "mailto:contact@amenterprises.tech",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+92 317 371 2950",
    href: "tel:+923173712950",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Islamabad, Pakistan & London, UK",
    href: "#",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Fri: 9AM - 6PM",
    href: "#",
  },
]

// --------------------------
// Services dropdown options
// --------------------------
const services = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Cloud Solutions",
  "AI & Machine Learning",
  "E-Commerce",
  "Other",
]

// --------------------------
// Main Contact Page Component
// --------------------------
export default function ContactPage() {
  // --------------------------
  // Form state
  // --------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --------------------------
  // Submit Contact Form
  // --------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast.error("Please fill in all required fields.")
        setIsSubmitting(false)
        return
      }

      // Send to backend API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          service: formData.service || null,
          budget: formData.budget || null,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send message")
      }

      // Show success
      toast.success(
        "Message sent successfully! We'll get back to you within 24 hours."
      )

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        budget: "",
        message: "",
      })
    } catch (err: any) {
      console.error("Error submitting contact form:", err)
      toast.error(err.message || "Failed to send message. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --------------------------
  // UI
  // --------------------------
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6 text-balance">
              Let's Start a <span className="gradient-text">Conversation</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Have a project in mind? We'd love to hear about it. Get in
              touch and let's create something amazing together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of the following channels. We
                  typically respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-xl glass-card hover:border-primary/30 transition-all group"
                  >
                    <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <info.icon className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-card rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                    {/* NOTE: Phone optional, validation will be added later */}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="Your Company"
                    />
                  </div>

                  {/* Service */}
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interested In</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData({ ...formData, service: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem
                            key={service}
                            value={service.toLowerCase()}
                          >
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) =>
                        setFormData({ ...formData, budget: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5k">Less than $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="message">Project Details *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={6}
                    required
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MessageSquare className="size-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our FAQ section for quick answers to common questions.
            </p>
            <Button variant="outline">View FAQ</Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
