"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { AnimatedCounter } from "@/components/animated-counter"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ZAxis,
} from "recharts"
import { CheckCircle2, Clock, Users, TrendingUp } from "lucide-react"

const taskCompletion = [
  { name: "Amir", tasks: 45, hours: 160 }, { name: "Sara", tasks: 38, hours: 150 },
  { name: "Dev", tasks: 52, hours: 175 }, { name: "Nadia", tasks: 33, hours: 140 },
  { name: "Ahmed", tasks: 28, hours: 120 },
]

const workHours = [
  { week: "W1", hours: 42 }, { week: "W2", hours: 38 }, { week: "W3", hours: 45 },
  { week: "W4", hours: 40 }, { week: "W5", hours: 44 }, { week: "W6", hours: 41 },
  { week: "W7", hours: 39 }, { week: "W8", hours: 43 },
]

const attendanceData = [
  { date: "2026-02-02", present: true }, { date: "2026-02-03", present: true },
  { date: "2026-02-04", present: true }, { date: "2026-02-05", present: false },
  { date: "2026-02-06", present: true }, { date: "2026-02-09", present: true },
  { date: "2026-02-10", present: true }, { date: "2026-02-11", present: true },
  { date: "2026-02-12", present: true }, { date: "2026-02-13", present: false },
  { date: "2026-02-16", present: true }, { date: "2026-02-17", present: true },
  { date: "2026-02-18", present: true }, { date: "2026-02-19", present: true },
  { date: "2026-02-20", present: true }, { date: "2026-02-23", present: true },
  { date: "2026-02-24", present: true }, { date: "2026-02-25", present: true },
  { date: "2026-02-26", present: true }, { date: "2026-02-27", present: true },
]

const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", color: "var(--color-card-foreground)" }

const kpis = [
  { title: "Tasks Completed", value: 196, icon: CheckCircle2, color: "from-emerald-600 to-emerald-400" },
  { title: "Avg Hours/Week", value: 41.5, icon: Clock, color: "from-blue-600 to-blue-400", decimals: 1 },
  { title: "Team Members", value: 5, icon: Users, color: "from-amber-600 to-amber-400" },
  { title: "Productivity", value: 94, suffix: "%", icon: TrendingUp, color: "from-rose-600 to-rose-400" },
]

export default function TeamPerformancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Team Performance" description="Track productivity and team metrics." breadcrumbs={[{ label: "Team Performance" }]} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="relative overflow-hidden border-0 shadow-sm">
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-[0.06]`} />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    <AnimatedCounter end={kpi.value} suffix={kpi.suffix} decimals={kpi.decimals} />
                  </p>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.color} text-white`}>
                  <kpi.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Task Completion vs Hours</CardTitle>
            <CardDescription>Scatter plot of tasks completed by work hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hours" name="Hours" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} label={{ value: "Hours Worked", position: "bottom", fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis dataKey="tasks" name="Tasks" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} label={{ value: "Tasks", angle: -90, position: "insideLeft", fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <ZAxis dataKey="name" name="Member" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Scatter name="Team Members" data={taskCompletion} fill="var(--color-chart-1)" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Weekly Work Hours</CardTitle>
            <CardDescription>Team average hours per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={workHours}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} domain={[30, 50]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="hours" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Attendance Calendar - February 2026</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: 0 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const day = i + 1
              const dateStr = `2026-02-${String(day).padStart(2, "0")}`
              const record = attendanceData.find((a) => a.date === dateStr)
              const isWeekend = new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6
              return (
                <div
                  key={day}
                  className={`rounded-lg p-2 text-xs font-medium ${
                    isWeekend
                      ? "bg-muted/30 text-muted-foreground"
                      : record?.present
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : record?.present === false
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded bg-emerald-500/20" />
              <span className="text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded bg-red-500/20" />
              <span className="text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded bg-muted/30" />
              <span className="text-muted-foreground">Weekend</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {taskCompletion.map((member) => (
              <div key={member.name} className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">{member.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.tasks} tasks &middot; {member.hours}h</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
