"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  inactive: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-700 dark:text-zinc-400",
  overdue: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
  draft: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-700 dark:text-zinc-400",
  open: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  "in-progress": "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  closed: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-700 dark:text-zinc-400",
  done: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  todo: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-700 dark:text-zinc-400",
  new: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  contacted: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
  qualified: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  proposal: "bg-primary/10 text-primary border-primary/20",
  "closed-won": "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  "closed-lost": "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  expired: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  sent: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  rejected: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  failed: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  paused: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
  high: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400",
  low: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs capitalize font-medium", statusColors[status] ?? "")}>
      {status.replace(/-/g, " ")}
    </Badge>
  )
}
