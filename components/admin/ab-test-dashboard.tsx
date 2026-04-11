'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ABTest, ABVariant } from '@/lib/ab-testing/engine'

interface TestWithData extends ABTest {
  views: number[]
  conversions: number[]
  ctr: number[]
}

export function ABTestDashboard() {
  const [tests, setTests] = useState<TestWithData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('/api/admin/ab-tests')
        const data = await response.json()
        setTests(data.tests || [])
      } catch (error) {
        console.error('Failed to fetch tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
    const interval = setInterval(fetchTests, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading tests...</div>
  }

  if (tests.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle>No Active Tests</CardTitle>
          <CardDescription>
            Create your first A/B test to start optimizing conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Create New Test</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {tests.map((test, index) => (
        <motion.div
          key={test.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    {test.name}
                  </CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </div>
                <Badge variant={test.status === 'active' ? 'default' : 'secondary'}>
                  {test.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Variants Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {test.variants.map((variant) => (
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <h4 className="font-semibold text-white mb-3">{variant.name}</h4>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Views</span>
                          <span className="text-white font-semibold">
                            {variant.views.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Conversions</span>
                          <span className="text-white font-semibold">
                            {variant.conversions.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Conversion Rate</span>
                          <span className="text-green-400 font-semibold">
                            {(variant.conversionRate * 100).toFixed(2)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={variant.conversionRate * 100}
                          className="h-1.5"
                        />
                      </div>

                      {variant.confidence > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            {variant.confidence > 95 ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                Significant (95%)
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-yellow-500" />
                                Testing ({variant.confidence.toFixed(0)}%)
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <div className="h-64 bg-white/5 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={test.variants.map((v) => ({
                      name: v.name,
                      views: v.views,
                      conversions: v.conversions,
                      rate: v.conversionRate * 100,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="conversions" fill="#6366f1" name="Conversions" />
                    <Bar dataKey="views" fill="#8b5cf6" name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Winner Recommendation */}
              {test.winner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Winner Detected</p>
                      <p className="text-sm text-green-300 mt-1">
                        {test.variants.find((v) => v.id === test.winner)?.name} is
                        performing better. Ready to deploy?
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button className="w-full">View Detailed Report</Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
