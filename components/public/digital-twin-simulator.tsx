'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, DollarSign, Zap } from 'lucide-react'

interface SimulationData {
  monthlyRevenue: number
  clientsAcquired: number
  conversionRate: number
  averageOrderValue: number
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export function DigitalTwinSimulator() {
  const [monthlyVisitors, setMonthlyVisitors] = useState([5000])
  const [conversionRate, setConversionRate] = useState([2.5])
  const [avgOrderValue, setAvgOrderValue] = useState([500])
  const [marketingBudget, setMarketingBudget] = useState([5000])

  // Calculate projections
  const monthlyLeads = Math.floor(monthlyVisitors[0] * (conversionRate[0] / 100))
  const monthlyRevenue = monthlyLeads * avgOrderValue[0]
  const roi = monthlyBudget > 0 ? ((monthlyRevenue - marketingBudget[0]) / marketingBudget[0] * 100).toFixed(0) : 0

  // Generate 12-month projection
  const projection = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: monthlyRevenue * (1 + i * 0.05), // 5% growth per month
    leads: monthlyLeads * (1 + i * 0.05),
  }))

  const monthlyBudget = marketingBudget[0]

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Monthly Revenue</p>
              <p className="text-3xl font-bold text-white mt-1">
                ${monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Monthly Leads</p>
              <p className="text-3xl font-bold text-white mt-1">
                {monthlyLeads}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversion Rate</p>
              <p className="text-3xl font-bold text-white mt-1">
                {conversionRate[0].toFixed(1)}%
              </p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">ROI</p>
              <p className="text-3xl font-bold text-white mt-1">
                {roi}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Sliders */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle>Adjust Variables</CardTitle>
          <CardDescription>See how changes impact your business metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white">Monthly Visitors</label>
              <span className="text-sm text-primary">{monthlyVisitors[0].toLocaleString()}</span>
            </div>
            <Slider
              value={monthlyVisitors}
              onValueChange={setMonthlyVisitors}
              min={100}
              max={50000}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-gray-400">Typical range: 1,000 - 50,000</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white">Conversion Rate (%)</label>
              <span className="text-sm text-primary">{conversionRate[0].toFixed(2)}%</span>
            </div>
            <Slider
              value={conversionRate}
              onValueChange={setConversionRate}
              min={0.5}
              max={10}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-gray-400">Industry average: 2-3%</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white">Average Order Value ($)</label>
              <span className="text-sm text-primary">${avgOrderValue[0]}</span>
            </div>
            <Slider
              value={avgOrderValue}
              onValueChange={setAvgOrderValue}
              min={100}
              max={5000}
              step={50}
              className="w-full"
            />
            <p className="text-xs text-gray-400">Typical range: $200 - $2,000</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-white">Monthly Marketing Budget ($)</label>
              <span className="text-sm text-primary">${marketingBudget}</span>
            </div>
            <Slider
              value={marketingBudget}
              onValueChange={setMarketingBudget}
              min={0}
              max={50000}
              step={500}
              className="w-full"
            />
            <p className="text-xs text-gray-400">Recommended: 5-15% of revenue</p>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">12-Month Revenue Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Lead Generation Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="leads" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {monthlyRevenue > monthlyBudget * 10 ? (
            <p className="text-green-400 text-sm">Great ROI! Consider increasing marketing budget to scale faster.</p>
          ) : (
            <p className="text-yellow-400 text-sm">Current ROI is modest. Optimize conversion rate or increase visitors.</p>
          )}
          {conversionRate[0] < 2 && (
            <p className="text-blue-400 text-sm">Your conversion rate is below industry average. We can help optimize this.</p>
          )}
          {monthlyVisitors[0] < 5000 && (
            <p className="text-purple-400 text-sm">Increasing traffic through SEO could significantly boost revenue.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
