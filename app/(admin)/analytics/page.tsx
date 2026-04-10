"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

const revenueBreakdown = [
  { month: "Sep", revenue: 42000, expenses: 28000 }, { month: "Oct", revenue: 55000, expenses: 32000 },
  { month: "Nov", revenue: 48000, expenses: 29000 }, { month: "Dec", revenue: 62000, expenses: 35000 },
  { month: "Jan", revenue: 71000, expenses: 38000 }, { month: "Feb", revenue: 85000, expenses: 41000 },
]

const countryRevenue = [
  { country: "United States", revenue: 245000 }, { country: "United Kingdom", revenue: 89000 },
  { country: "Canada", revenue: 67000 }, { country: "Germany", revenue: 45000 },
  { country: "Australia", revenue: 38000 }, { country: "India", revenue: 29000 },
]

const servicePerformance = [
  { name: "Web Dev", value: 40 }, { name: "Mobile", value: 25 },
  { name: "Marketing", value: 20 }, { name: "Cloud", value: 15 },
]

const conversionData = [
  { month: "Sep", rate: 12 }, { month: "Oct", rate: 15 }, { month: "Nov", rate: 13 },
  { month: "Dec", rate: 18 }, { month: "Jan", rate: 22 }, { month: "Feb", rate: 25 },
]

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"]

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-card-foreground)",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics & Reports" description="Deep insights into your business performance." breadcrumbs={[{ label: "Analytics" }]} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "$513K", change: "+18.2%" },
          { label: "Avg Deal Size", value: "$28.5K", change: "+5.4%" },
          { label: "Conversion Rate", value: "25%", change: "+7.1%" },
          { label: "Client Retention", value: "92%", change: "+2.3%" },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">{s.change} vs last quarter</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
            <CardDescription>Composed chart showing revenue and cost trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueBreakdown}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="var(--color-chart-3)" strokeWidth={2} name="Expenses" dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revenue by Country</CardTitle>
            <CardDescription>Top performing regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis dataKey="country" type="category" width={100} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`, "Revenue"]} />
                <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Service Performance</CardTitle>
            <CardDescription>Revenue share by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={servicePerformance} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {servicePerformance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Conversion Rate</CardTitle>
            <CardDescription>Lead to client conversion trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Conversion"]} />
                <Area type="monotone" dataKey="rate" fill="var(--color-chart-2)" fillOpacity={0.1} stroke="var(--color-chart-2)" strokeWidth={2} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-chart-2)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
