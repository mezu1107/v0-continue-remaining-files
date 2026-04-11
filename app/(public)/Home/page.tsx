import { HeroSection } from "@/components/public/sections/hero-section"
import { AIHeroChat } from "@/components/public/sections/ai-hero-chat"
import { LiveAIDemo } from "@/components/public/sections/live-ai-demo"
import { InteractiveServices } from "@/components/public/sections/interactive-services"
import { LiveMetrics } from "@/components/public/sections/live-metrics"
import { SmartPricing } from "@/components/public/sections/smart-pricing"
import { SystemWizard } from "@/components/public/sections/system-wizard"
import { CaseStudyEngine } from "@/components/public/sections/case-study-engine"
import { LiveActivityFeed } from "@/components/public/sections/live-activity-feed"
import { TrustBadges } from "@/components/public/sections/trust-badges"
import { ServicesSection } from "@/components/public/sections/services-section"
import QuizSection from "@/components/public/sections/quiz-section"
import { ProcessSection } from "@/components/public/sections/process-section"
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
      {/* Original Hero */}
      <HeroSection />

      {/* New AI-First Features */}
      <AIHeroChat />
      <LiveMetrics />
      <LiveAIDemo />
      <InteractiveServices />
      <SystemWizard />
      <SmartPricing />
      <CaseStudyEngine />
      <LiveActivityFeed />

      {/* Trust & Credibility */}
      <TrustBadges />

      {/* Existing Sections */}
      <ServicesSection />
      <QuizSection />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
