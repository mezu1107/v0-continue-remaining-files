import { HeroSection } from "@/components/public/sections/hero-section"
import { ServicesSection } from "@/components/public/sections/services-section"
import { PortfolioSection } from "@/components/public/sections/portfolio-section"
import { TestimonialsSection } from "@/components/public/sections/testimonials-section"
import { PricingSection } from "@/components/public/sections/pricing-section"
import { CTASection } from "@/components/public/sections/cta-section"

export const metadata = {
  title: "AM Enterprises | AI-Powered Digital Solutions",
  description: "Enterprise automation, web development, and AI systems for Islamabad, Rawalpindi & UK",
}

export default function HomePage() {
  return (
    <>
      {/* Hero - Input & Suggestion Chips */}
      <HeroSection />

      {/* Services - What We Offer */}
      <ServicesSection />

      {/* Portfolio - Social Proof */}
      <PortfolioSection />

      {/* Testimonials - Trust Signals */}
      <TestimonialsSection />

      {/* Pricing - Transparent Options */}
      <PricingSection />

      {/* Final CTA - Start Project */}
      <CTASection />
    </>
  )
}
