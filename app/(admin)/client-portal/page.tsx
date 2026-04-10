"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { fetchProjects, fetchInvoices, fetchTickets, formatCurrency, formatDate } from "@/lib/mock-api"
import type { Project, Invoice, Ticket } from "@/lib/types"
import {
  FolderKanban, FileText, Headphones, DollarSign, Clock, CheckCircle2,
  AlertCircle, Download, MessageSquare, Plus,
} from "lucide-react"
import { toast } from "sonner"

export default function ClientPortalPage() {
  const { company, user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProjects(company.id),
      fetchInvoices(company.id),
      fetchTickets(company.id),
    ]).then(([p, i, t]) => {
      setProjects(p)
      setInvoices(i)
      setTickets(t)
      setLoading(false)
    })
  }, [company.id])

  const activeProjects = projects.filter((p) => p.status === "in-progress")
  const pendingInvoices = invoices.filter((i) => i.status === "pending" || i.status === "overdue")
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in-progress")

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((a, i) => a + i.total, 0)
  const totalPending = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((a, i) => a + i.total, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Client Portal"
        description={`Welcome back, ${user?.name ?? "Client"}. Here is your project overview.`}
        breadcrumbs={[{ label: "Client Portal" }]}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold text-foreground">{activeProjects.length}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <FolderKanban className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Invoices</p>
                <p className="text-2xl font-bold text-foreground">{pendingInvoices.length}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <FileText className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-foreground">{openTickets.length}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10">
                <Headphones className="size-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <div className="grid gap-4">
            {projects.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <FolderKanban className="mx-auto size-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No projects yet</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{project.name}</h3>
                          <StatusBadge status={project.status} />
                          <Badge
                            variant={project.priority === "high" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {project.priority}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                        <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            Deadline: {formatDate(project.deadline)}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            {project.tasks.filter((t) => t.status === "done").length}/{project.tasks.length} tasks done
                          </span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          {totalPending > 0 && (
            <Card className="border-0 shadow-sm bg-amber-500/5 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-foreground">Outstanding Balance</p>
                      <p className="text-sm text-muted-foreground">You have pending invoices</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(totalPending)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {formatDate(invoice.issueDate)} &middot; Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-foreground">{formatCurrency(invoice.total)}</p>
                      <StatusBadge status={invoice.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toast.info("Downloading PDF...")}
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => toast.success("Support ticket form opened")}>
              <Plus className="mr-2 size-4" /> New Ticket
            </Button>
          </div>

          <div className="grid gap-3">
            {tickets.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Headphones className="mx-auto size-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No support tickets</p>
                  <p className="text-sm text-muted-foreground">Create a ticket if you need help</p>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-lg ${
                            ticket.status === "open" || ticket.status === "in-progress"
                              ? "bg-amber-500/10"
                              : "bg-emerald-500/10"
                          }`}
                        >
                          <MessageSquare
                            className={`size-5 ${
                              ticket.status === "open" || ticket.status === "in-progress"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground">
                            #{ticket.id} &middot; {ticket.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={ticket.priority === "high" ? "destructive" : "secondary"}
                          className="text-xs capitalize"
                        >
                          {ticket.priority}
                        </Badge>
                        <StatusBadge status={ticket.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
