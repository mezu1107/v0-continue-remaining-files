"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  FileText,
  CreditCard,
  MessageSquare,
  TicketCheck,
  Bell,
  Calendar,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react"

interface DashboardData {
  profile: {
    full_name: string | null
    company_name: string | null
  } | null
  stats: {
    activeProjects: number
    totalInvoices: number
    paidInvoices: number
    unpaidInvoices: number
    remainingBalance: number
    unreadMessages: number
    openTickets: number
    unreadNotifications: number
  }
  projects: Array<{
    id: string
    title: string
    status: string
    progress: number
    deadline: string | null
  }>
  upcomingMeetings: Array<{
    id: string
    title: string
    meeting_date: string
    meeting_type: string
  }>
  recentActivity: Array<{
    id: string
    action: string
    entity_type: string
    created_at: string
    details: Record<string, unknown> | null
  }>
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  review: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  on_hold: "bg-gray-500/10 text-gray-600 border-gray-500/20",
}

export function ClientDashboardContent({ data }: { data: DashboardData }) {
  const { t } = useTranslation()

  const statCards = [
    {
      title: t.dashboard.activeProjects,
      value: data.stats.activeProjects,
      icon: FolderKanban,
      href: "/client/projects",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t.dashboard.totalInvoices,
      value: data.stats.totalInvoices,
      icon: FileText,
      href: "/client/invoices",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      subtitle: `${data.stats.paidInvoices} ${t.invoices.statusPaid}`,
    },
    {
      title: t.dashboard.unpaidInvoices,
      value: data.stats.unpaidInvoices,
      icon: CreditCard,
      href: "/client/invoices?status=pending",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: t.dashboard.remainingBalance,
      value: `$${data.stats.remainingBalance.toLocaleString()}`,
      icon: TrendingUp,
      href: "/client/invoices",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      isAmount: true,
    },
    {
      title: t.dashboard.unreadMessages,
      value: data.stats.unreadMessages,
      icon: MessageSquare,
      href: "/client/messages",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t.dashboard.openTickets,
      value: data.stats.openTickets,
      icon: TicketCheck,
      href: "/client/tickets",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t.dashboard.welcome}, {data.profile?.full_name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            {data.profile?.company_name || t.dashboard.overview}
          </p>
        </div>
        {data.stats.unreadNotifications > 0 && (
          <Link href="/client/notifications">
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              {data.stats.unreadNotifications} {t.notifications.title}
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">{t.dashboard.projectProgress}</CardTitle>
              <CardDescription>{t.dashboard.activeProjects}</CardDescription>
            </div>
            <Link href="/client/projects">
              <Button variant="ghost" size="sm" className="gap-1">
                {t.dashboard.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t.projects.noProjects}
              </div>
            ) : (
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <Link key={project.id} href={`/client/projects/${project.id}`}>
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium truncate">{project.title}</span>
                        <Badge variant="outline" className={statusColors[project.status] || ""}>
                          {t.projects[`status${project.status.charAt(0).toUpperCase() + project.status.slice(1).replace("_", "")}` as keyof typeof t.projects] || project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-10">{project.progress}%</span>
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">{t.dashboard.upcomingMeetings}</CardTitle>
              <CardDescription>{t.meetings.myMeetings}</CardDescription>
            </div>
            <Link href="/client/meetings">
              <Button variant="ghost" size="sm" className="gap-1">
                {t.dashboard.viewAll}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingMeetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t.dashboard.noMeetings}
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingMeetings.map((meeting) => (
                  <Link key={meeting.id} href={`/client/meetings/${meeting.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(meeting.meeting_date).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {t.meetings[`type${meeting.meeting_type.charAt(0).toUpperCase() + meeting.meeting_type.slice(1)}` as keyof typeof t.meetings] || meeting.meeting_type}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.dashboard.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.dashboard.noActivity}
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      {" - "}
                      <span className="text-muted-foreground">{activity.entity_type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.dashboard.quickActions}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Link href="/client/tickets/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <TicketCheck className="w-4 h-4" />
                {t.tickets.newTicket}
              </Button>
            </Link>
            <Link href="/client/messages/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="w-4 h-4" />
                {t.messages.newMessage}
              </Button>
            </Link>
            <Link href="/client/meetings/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" />
                {t.meetings.scheduleMeeting}
              </Button>
            </Link>
            <Link href="/client/revisions/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                {t.revisions.requestRevision}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
