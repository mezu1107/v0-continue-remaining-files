"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate } from "@/lib/mock-api"
import { Plus, FileSignature, Send, Download, Clock, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

const proposals = [
  { id: 1, title: "E-Commerce Platform Development", client: "TechCorp Inc.", value: 45000, status: "sent", createdAt: "2026-02-20", expiresAt: "2026-03-20", template: "development" },
  { id: 2, title: "Mobile App MVP", client: "GreenLeaf Solutions", value: 80000, status: "draft", createdAt: "2026-02-25", expiresAt: "2026-03-25", template: "mobile" },
  { id: 3, title: "Cloud Migration Services", client: "Summit Partners", value: 120000, status: "accepted", createdAt: "2026-02-10", expiresAt: "2026-03-10", template: "enterprise" },
  { id: 4, title: "SEO & Marketing Package", client: "BlueSky Media", value: 15000, status: "rejected", createdAt: "2026-02-05", expiresAt: "2026-03-05", template: "marketing" },
  { id: 5, title: "CRM Integration Project", client: "NovaTech Labs", value: 35000, status: "sent", createdAt: "2026-02-18", expiresAt: "2026-03-18", template: "development" },
]

const templates = [
  { id: "development", name: "Software Development", description: "For web and software projects" },
  { id: "mobile", name: "Mobile App Development", description: "For iOS/Android apps" },
  { id: "enterprise", name: "Enterprise Solution", description: "For large-scale projects" },
  { id: "marketing", name: "Marketing Services", description: "For SEO and digital marketing" },
]

export default function ProposalsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
      case "rejected":
        return <XCircle className="size-4 text-red-600 dark:text-red-400" />
      case "sent":
        return <Send className="size-4 text-blue-600 dark:text-blue-400" />
      default:
        return <Clock className="size-4 text-muted-foreground" />
    }
  }

  const sentCount = proposals.filter((p) => p.status === "sent").length
  const acceptedCount = proposals.filter((p) => p.status === "accepted").length
  const totalValue = proposals.filter((p) => p.status === "accepted").reduce((a, p) => a + p.value, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Proposals"
        description="Create and manage client proposals."
        breadcrumbs={[{ label: "Proposals" }]}
        actions={
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" /> New Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Proposal</DialogTitle>
                <DialogDescription>Generate a professional proposal from a template.</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Proposal created")
                  setShowCreate(false)
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input placeholder="Proposal title" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Client</Label>
                    <Input placeholder="Select client" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Value ($)</Label>
                    <Input type="number" placeholder="0" required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Template</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplate(t)}
                        className={`rounded-lg border p-3 text-left transition-colors ${
                          selectedTemplate.id === t.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Custom Notes</Label>
                  <Textarea placeholder="Add any custom notes..." className="min-h-24" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Proposal</Button>
                  <Button type="button" variant="outline" onClick={() => toast.success("Saved as draft")}>
                    Save Draft
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Send className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">{sentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-2xl font-bold text-foreground">{acceptedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileSignature className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Won Value</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                        {getStatusIcon(proposal.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">{proposal.client}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {formatDate(proposal.createdAt)}</span>
                          <span>Expires: {formatDate(proposal.expiresAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-bold text-foreground">{formatCurrency(proposal.value)}</p>
                      <StatusBadge status={proposal.status} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    <Badge variant="secondary" className="text-xs">
                      {templates.find((t) => t.id === proposal.template)?.name}
                    </Badge>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 size-3" /> Download
                      </Button>
                      {proposal.status === "draft" && (
                        <Button size="sm">
                          <Send className="mr-2 size-3" /> Send
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {["draft", "sent", "accepted", "rejected"].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid gap-4">
              {proposals
                .filter((p) => p.status === status)
                .map((proposal) => (
                  <Card key={proposal.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                            {getStatusIcon(proposal.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{proposal.title}</h3>
                            <p className="text-sm text-muted-foreground">{proposal.client}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(proposal.value)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {proposals.filter((p) => p.status === status).length === 0 && (
                <div className="py-12 text-center text-muted-foreground">No {status} proposals</div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
