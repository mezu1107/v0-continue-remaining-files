'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Zap } from 'lucide-react'

export function ROICalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(10000)
  const [annualCost, setAnnualCost] = useState(5000)
  const [expectedGrowth, setExpectedGrowth] = useState(25)

  const roi = annualCost > 0 ? ((expectedGrowth * monthlyRevenue * 12 - annualCost) / annualCost) * 100 : 0
  const projectedAnnualRevenue = monthlyRevenue * 12
  const projectedRevenueWithGrowth = projectedAnnualRevenue * (1 + expectedGrowth / 100)
  const netGain = projectedRevenueWithGrowth - projectedAnnualRevenue - annualCost
  const paybackMonths = annualCost > 0 ? (annualCost / (monthlyRevenue * (expectedGrowth / 100 / 12))).toFixed(1) : '0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            ROI Calculator
          </CardTitle>
          <CardDescription>
            See the return on investing in our services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Current Monthly Revenue ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="number"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value) || 0)}
                  className="pl-8 bg-card/50"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Annual Service Cost ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="number"
                  value={annualCost}
                  onChange={(e) => setAnnualCost(Number(e.target.value) || 0)}
                  className="pl-8 bg-card/50"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Expected Growth (%)
              </label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
                <Input
                  type="number"
                  value={expectedGrowth}
                  onChange={(e) => setExpectedGrowth(Number(e.target.value) || 0)}
                  className="pl-8 bg-card/50"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-4"
            >
              <p className="text-xs text-gray-400 mb-1">ROI</p>
              <p className="text-3xl font-bold text-green-400">
                {roi.toFixed(0)}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-4"
            >
              <p className="text-xs text-gray-400 mb-1">Payback Period</p>
              <p className="text-3xl font-bold text-blue-400">
                {paybackMonths} mo
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-4"
            >
              <p className="text-xs text-gray-400 mb-1">Annual Gain</p>
              <p className="text-3xl font-bold text-purple-400">
                ${netGain.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 rounded-lg p-4"
            >
              <p className="text-xs text-gray-400 mb-1">Revenue Growth</p>
              <p className="text-3xl font-bold text-pink-400">
                ${(monthlyRevenue * 12 * expectedGrowth / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </motion.div>
          </div>

          {/* Insight */}
          <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <p className="text-sm text-indigo-300">
              {roi > 200
                ? 'Outstanding ROI! This investment would pay for itself many times over within the first year.'
                : roi > 100
                ? 'Excellent ROI! Strong financial justification for our services.'
                : roi > 0
                ? 'Positive ROI expected. With our growth strategies, you&apos;ll see returns within the first year.'
                : 'Let&apos;s discuss how we can improve your growth metrics.'}
            </p>
          </div>

          <Button className="w-full" size="lg">
            Get Detailed ROI Analysis
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
