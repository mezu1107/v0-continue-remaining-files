"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedCounter } from "@/components/animated-counter"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Megaphone, Mail, Users, TrendingUp, Send, Calendar, Target,
  MousePointer, Eye, DollarSign,
} from "lucide-react"
import { toast } from "sonner"

const campaignData = [
  { month: "Sep", leads: 45, conversions: 12 },
  { month: "Oct", leads: 58, conversions: 18 },
  { month: "Nov", leads: 62, conversions: 20 },
  { month: "Dec", leads: 75, conversions: 25 },
  { month: "Jan", leads: 88, conversions: 32 },
  { month: "Feb", leads: 95, conversions: 38 },
]

const emailMetrics = [
  { campaign: "Newsletter", sent: 5000, opened: 2250, clicked: 450 },
  { campaign: "Product Launch", sent: 3200, opened: 1920, clicked: 640 },
  { campaign: "Follow-up", sent: 1500, opened: 900, clicked: 180 },
]

const activeCampaigns = [
  { id: 1, name: "Spring 2026 Launch", type: "Email", status: "active", budget: 5000, spent: 3200, leads: 145 },
  { id: 2, name: "LinkedIn Ads", type: "Social", status: "active", budget: 3000, spent: 1800, leads: 68 },
  { id: 3, name: "Google Ads", type: "PPC", status: "paused", budget: 8000, spent: 4500, leads: 210 },
  { id: 4, name: "Referral Program", type: "Referral", status: "active", budget: 2000, spent: 800, leads: 32 },
]

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-card-foreground)",
}

export default function MarketingPage() {
  const totalLeads = 455
  const conversionRate = 35
  const totalSpent = 10300
  const roi = 285

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Marketing"
        description="Manage campaigns, email marketing, and lead generation."
        breadcrumbs={[{ label: "Marketing" }]}
        actions={
          <Button>
            <Megaphone className="mr-2 size-4" /> New Campaign
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter end={totalLeads} />
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+18% this month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Target className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <Progress value={conversionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ad Spend</p>
                <p className="text-2xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <DollarSign className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold text-foreground">{roi}%</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10">
                <TrendingUp className="size-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+42% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <div className="grid gap-4">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                        <Badge variant="secondary" className="text-xs">{campaign.type}</Badge>
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={`text-xs ${campaign.status === "active" ? "bg-emerald-600" : ""}`}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3" />
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {campaign.leads} leads
                        </span>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Budget Used</span>
                        <span className="font-medium text-foreground">
                          {Math.round((campaign.spent / campaign.budget) * 100)}%
                        </span>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="email" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Email Performance</CardTitle>
                <CardDescription>Open and click rates by campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {emailMetrics.map((metric) => (
                    <div key={metric.campaign} className="rounded-lg border border-border p-4">
                      <p className="font-medium text-foreground mb-3">{metric.campaign}</p>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                            <Send className="size-3" /> Sent
                          </div>
                          <p className="text-lg font-bold text-foreground">{metric.sent.toLocaleString()}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                            <Eye className="size-3" /> Opened
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {Math.round((metric.opened / metric.sent) * 100)}%
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                            <MousePointer className="size-3" /> Clicked
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {Math.round((metric.clicked / metric.sent) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Quick Email</CardTitle>
                <CardDescription>Send a quick campaign email</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    toast.success("Email scheduled")
                  }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <Label>Subject Line</Label>
                    <Input placeholder="Enter email subject" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Recipients</Label>
                    <Input placeholder="All subscribers" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Content</Label>
                    <Textarea placeholder="Write your email content..." className="min-h-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="schedule" />
                    <Label htmlFor="schedule">Schedule for later</Label>
                  </div>
                  <Button type="submit">
                    <Send className="mr-2 size-4" /> Send Email
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Lead Generation Trend</CardTitle>
                <CardDescription>Monthly leads vs conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="leads" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 4 }} name="Leads" />
                    <Line type="monotone" dataKey="conversions" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 4 }} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Campaign Performance</CardTitle>
                <CardDescription>Leads by campaign type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={activeCampaigns}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="leads" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
