"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { fetchLeads } from "@/lib/mock-api"
import type { Lead } from "@/lib/types"
import { toast } from "sonner"

const pipelineStages = ["new", "contacted", "qualified", "proposal", "closed-won", "closed-lost"] as const

const emailTemplates = [
  { id: 1, name: "Welcome Email", subject: "Welcome to AM Enterprises!", body: "Hi {{name}},\n\nThank you for your interest in our services..." },
  { id: 2, name: "Follow-Up", subject: "Following up on our conversation", body: "Hi {{name}},\n\nI wanted to follow up on our recent discussion..." },
  { id: 3, name: "Proposal Sent", subject: "Your Proposal is Ready", body: "Hi {{name}},\n\nPlease find attached the proposal for {{service}}..." },
]

export default function CRMPage() {
  const { company } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [autoFollowUp, setAutoFollowUp] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0])

  useEffect(() => {
    fetchLeads(company.id).then((data) => { setLeads(data); setLoading(false) })
  }, [company.id])

  const getLeadsByStage = (stage: string) => leads.filter((l) => l.status === stage)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="CRM Automation" description="Automate your sales pipeline and follow-ups." breadcrumbs={[{ label: "CRM Automation" }]} />

      <div className="flex items-center gap-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Switch checked={autoFollowUp} onCheckedChange={setAutoFollowUp} id="auto-followup" />
          <Label htmlFor="auto-followup">Auto Follow-Up</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch defaultChecked id="lead-scoring" />
          <Label htmlFor="lead-scoring">Auto Lead Scoring</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="email-sequence" />
          <Label htmlFor="email-sequence">Email Sequences</Label>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <div key={stage} className="flex min-w-64 flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-sm font-medium capitalize text-foreground">{stage.replace(/-/g, " ")}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {getLeadsByStage(stage).length}
              </span>
            </div>
            {getLeadsByStage(stage).map((lead) => (
              <Card key={lead.id} className="border shadow-sm cursor-grab hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    <StatusBadge status={stage} />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Lead Score</span>
                      <span className="font-medium text-foreground">{lead.score}/10</span>
                    </div>
                    <Progress value={lead.score * 10} className="h-1.5" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{lead.source}</p>
                </CardContent>
              </Card>
            ))}
            {getLeadsByStage(stage).length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                No leads in this stage
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Email Template Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {emailTemplates.map((t) => (
                  <Button
                    key={t.id}
                    variant={selectedTemplate.id === t.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTemplate(t)}
                  >
                    {t.name}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Subject</Label>
                <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={selectedTemplate.subject} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Body</Label>
                <Textarea className="min-h-32" defaultValue={selectedTemplate.body} />
              </div>
              <p className="text-xs text-muted-foreground">{"Available placeholders: {{name}}, {{company}}, {{service}}"}</p>
              <Button onClick={() => toast.success("Template saved")}>Save Template</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Lead Scoring Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {leads.sort((a, b) => b.score - a.score).map((lead) => (
                <div key={lead.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.company}</p>
                  </div>
                  <div className="w-24">
                    <Progress value={lead.score * 10} className="h-2" />
                  </div>
                  <span className={`text-sm font-bold ${lead.score >= 8 ? "text-emerald-600 dark:text-emerald-400" : lead.score >= 5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                    {lead.score}/10
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
