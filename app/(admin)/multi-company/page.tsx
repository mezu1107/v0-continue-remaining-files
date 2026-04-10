"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { fetchCompanies, formatCurrency } from "@/lib/mock-api"
import { useAuth } from "@/lib/auth-context"
import type { Company } from "@/lib/types"
import { Plus, Building2, Globe, Users, DollarSign, Settings, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const companyStats: Record<number, { users: number; revenue: number; projects: number }> = {
  1: { users: 6, revenue: 513000, projects: 5 },
  2: { users: 4, revenue: 287000, projects: 3 },
  3: { users: 8, revenue: 892000, projects: 12 },
}

export default function MultiCompanyPage() {
  const { company: currentCompany, setCompany } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchCompanies().then((data) => {
      setCompanies(data)
      setLoading(false)
    })
  }, [])

  const handleSwitchCompany = (company: Company) => {
    setCompany(company)
    toast.success(`Switched to ${company.name}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Multi-Company Management"
        description="Manage multiple companies from a single dashboard."
        breadcrumbs={[{ label: "Multi-Company" }]}
        actions={
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" /> Add Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
                <DialogDescription>Create a new company workspace.</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Company created")
                  setShowCreate(false)
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Enter company name" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Industry</Label>
                  <Input placeholder="e.g., Technology, Finance" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="contact@company.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input placeholder="+1 555-0000" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Address</Label>
                  <Input placeholder="Company address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Currency</Label>
                    <Input placeholder="USD" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Timezone</Label>
                    <Input placeholder="America/New_York" />
                  </div>
                </div>
                <Button type="submit">Create Company</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-0 shadow-sm bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {currentCompany.logo}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">{currentCompany.name}</h2>
                <p className="text-sm text-muted-foreground">{currentCompany.industry}</p>
                <Badge className="mt-1 bg-primary">Current Workspace</Badge>
              </div>
            </div>
            <Button variant="outline" onClick={() => toast.info("Settings opened")}>
              <Settings className="mr-2 size-4" /> Company Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Building2 className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Companies</p>
              <p className="text-2xl font-bold text-foreground">{companies.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Users className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {Object.values(companyStats).reduce((a, s) => a + s.users, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <DollarSign className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Combined Revenue</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(Object.values(companyStats).reduce((a, s) => a + s.revenue, 0))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All Companies</CardTitle>
          <CardDescription>Click on a company to switch workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => {
              const stats = companyStats[company.id] || { users: 0, revenue: 0, projects: 0 }
              const isCurrent = company.id === currentCompany.id

              return (
                <Card
                  key={company.id}
                  className={`border transition-all cursor-pointer hover:shadow-md ${
                    isCurrent ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => !isCurrent && handleSwitchCompany(company)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-12">
                          <AvatarFallback
                            className={`text-sm font-bold ${
                              isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {company.logo}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{company.name}</h3>
                          <p className="text-xs text-muted-foreground">{company.industry}</p>
                        </div>
                      </div>
                      {isCurrent && (
                        <Badge variant="default" className="bg-primary text-xs">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-bold text-foreground">{stats.users}</p>
                        <p className="text-xs text-muted-foreground">Users</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-lg font-bold text-foreground">{stats.projects}</p>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-sm font-bold text-foreground">${Math.round(stats.revenue / 1000)}k</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="size-3" /> {company.timezone.split("/")[1]}
                      </span>
                      {!isCurrent && (
                        <span className="flex items-center gap-1 text-primary">
                          Switch <ArrowRight className="size-3" />
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Cross-Company Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Unified Reporting</p>
              <p className="text-xs text-muted-foreground">View aggregated reports across all companies</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Shared User Access</p>
              <p className="text-xs text-muted-foreground">Allow users to access multiple companies</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Consolidated Billing</p>
              <p className="text-xs text-muted-foreground">Single invoice for all companies</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
