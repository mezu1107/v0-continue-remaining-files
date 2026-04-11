'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Zap, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  price?: number
  duration?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/modules/services')
        const data = await response.json()
        setServices(data.services || [])
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored for your business growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No services available yet</p>
              <Button>View Our Portfolio</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 mb-6 py-4 border-y border-white/10">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {service.price && (
                      <div className="text-sm text-gray-400">
                        From <span className="text-white font-semibold">${service.price}</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group/btn"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Let&apos;s discuss which services are right for your business
          </p>
          <Button size="lg" className="px-8">
            Schedule a Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </main>
  )
}
