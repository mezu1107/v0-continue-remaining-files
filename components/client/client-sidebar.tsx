"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CreditCard,
  Files,
  MessageSquare,
  TicketCheck,
  Calendar,
  FileSignature,
  BarChart3,
  Target,
  GitBranch,
  Clock,
  Settings,
  Menu,
  Building2,
  X,
} from "lucide-react"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  company_name: string | null
  avatar_url: string | null
}

const navItems = [
  { href: "/client/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/client/projects", icon: FolderKanban, labelKey: "projects" },
  { href: "/client/invoices", icon: FileText, labelKey: "invoices" },
  { href: "/client/payments", icon: CreditCard, labelKey: "payments" },
  { href: "/client/files", icon: Files, labelKey: "files" },
  { href: "/client/messages", icon: MessageSquare, labelKey: "messages" },
  { href: "/client/tickets", icon: TicketCheck, labelKey: "tickets" },
  { href: "/client/meetings", icon: Calendar, labelKey: "meetings" },
  { href: "/client/contracts", icon: FileSignature, labelKey: "contracts" },
  { href: "/client/reports", icon: BarChart3, labelKey: "reports" },
  { href: "/client/goals", icon: Target, labelKey: "goals" },
  { href: "/client/revisions", icon: GitBranch, labelKey: "revisions" },
  { href: "/client/time-tracking", icon: Clock, labelKey: "timeTracking" },
  { href: "/client/settings", icon: Settings, labelKey: "settings" },
]

export function ClientSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/50">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">AM Enterprises</span>
          <span className="text-xs text-muted-foreground">Client Portal</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-border/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {profile.full_name?.charAt(0) || profile.email?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{profile.company_name || profile.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const label = t.nav[item.labelKey as keyof typeof t.nav]

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          &copy; 2024 AM Enterprises
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 border-r border-border/50 bg-card">
        <NavContent />
      </aside>
    </>
  )
}
