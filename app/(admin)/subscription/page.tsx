"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate } from "@/lib/mock-api"
import {
  CreditCard, Check, Zap, Users, FolderKanban, HardDrive, Headphones,
  ArrowRight, Download,
} from "lucide-react"
import { toast } from "sonner"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    description: "Perfect for small teams getting started",
    features: [
      "Up to 5 users",
      "10 active projects",
      "5 GB storage",
      "Email support",
      "Basic analytics",
    ],
    limits: { users: 5, projects: 10, storage: 5 },
  },
  {
    id: "professional",
    name: "Professional",
    price: 149,
    description: "For growing teams with more needs",
    features: [
      "Up to 20 users",
      "Unlimited projects",
      "50 GB storage",
      "Priority support",
      "Advanced analytics",
      "API access",
      "Custom branding",
    ],
    limits: { users: 20, projects: -1, storage: 50 },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    description: "For large organizations with custom needs",
    features: [
      "Unlimited users",
      "Unlimited projects",
      "500 GB storage",
      "24/7 dedicated support",
      "Custom analytics",
      "Full API access",
      "White-label option",
      "SSO & SAML",
      "Custom integrations",
    ],
    limits: { users: -1, projects: -1, storage: 500 },
  },
]

const currentPlan = plans[2] // Enterprise
const usage = {
  users: 6,
  projects: 5,
  storage: 23.5,
}

const invoiceHistory = [
  { id: 1, date: "2026-02-01", amount: 299, status: "paid" },
  { id: 2, date: "2026-01-01", amount: 299, status: "paid" },
  { id: 3, date: "2025-12-01", amount: 299, status: "paid" },
  { id: 4, date: "2025-11-01", amount: 299, status: "paid" },
]

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")
  const annualDiscount = 0.2

  const getPrice = (price: number) =>
    billingCycle === "annual" ? price * (1 - annualDiscount) : price

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Subscription"
        description="Manage your subscription and billing."
        breadcrumbs={[{ label: "Subscription" }]}
      />

      <Card className="border-0 shadow-sm bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Zap className="size-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{currentPlan.name} Plan</h2>
                  <Badge className="bg-primary">Current</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(currentPlan.price)}/month &middot; Billed annually
                </p>
                <p className="text-xs text-muted-foreground mt-1">Next billing date: March 1, 2026</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Cancel Plan</Button>
              <Button>Upgrade</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" /> Users
              </div>
              <span className="text-sm font-medium text-foreground">
                {usage.users} / {currentPlan.limits.users === -1 ? "Unlimited" : currentPlan.limits.users}
              </span>
            </div>
            <Progress
              value={currentPlan.limits.users === -1 ? 10 : (usage.users / currentPlan.limits.users) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderKanban className="size-4" /> Projects
              </div>
              <span className="text-sm font-medium text-foreground">
                {usage.projects} / {currentPlan.limits.projects === -1 ? "Unlimited" : currentPlan.limits.projects}
              </span>
            </div>
            <Progress
              value={currentPlan.limits.projects === -1 ? 5 : (usage.projects / currentPlan.limits.projects) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HardDrive className="size-4" /> Storage
              </div>
              <span className="text-sm font-medium text-foreground">
                {usage.storage} GB / {currentPlan.limits.storage} GB
              </span>
            </div>
            <Progress value={(usage.storage / currentPlan.limits.storage) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Available Plans</CardTitle>
              <CardDescription>Choose the plan that fits your needs</CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  billingCycle === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  billingCycle === "annual" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                Annual
                <Badge variant="secondary" className="ml-1.5 text-xs">Save 20%</Badge>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-colors ${
                  plan.id === currentPlan.id
                    ? "border-primary bg-primary/5"
                    : plan.popular
                    ? "border-primary/50"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {formatCurrency(getPrice(plan.price))}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {billingCycle === "annual" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed as {formatCurrency(getPrice(plan.price) * 12)}/year
                    </p>
                  )}
                </div>

                <ul className="mb-6 flex flex-col gap-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === currentPlan.id ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => toast.success(`Switching to ${plan.name} plan`)}
                  >
                    {plans.indexOf(plan) > plans.indexOf(currentPlan) ? "Upgrade" : "Downgrade"}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <CreditCard className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                </div>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-fit">
              <CreditCard className="mr-2 size-4" /> Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {invoiceHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatDate(invoice.date)}</p>
                    <p className="text-xs text-muted-foreground">Invoice #{invoice.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{formatCurrency(invoice.amount)}</span>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                      Paid
                    </Badge>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Headphones className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Need help with your subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is available 24/7 to assist you with any questions.
              </p>
            </div>
            <Button variant="outline">Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
