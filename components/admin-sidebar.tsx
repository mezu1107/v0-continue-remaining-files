"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Package, HelpCircle } from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard, Users, Briefcase, FolderKanban, Wrench, FileText, Target,
  BookOpen, Headphones, Settings, BarChart3, Shield, Zap, FileSignature,
  ScrollText, TrendingUp, BookMarked, HardDrive, Megaphone, Building2,
  UserCircle, CreditCard, LogOut, ChevronUp, ImageIcon, 
} from "lucide-react"
import type { Role } from "@/lib/types"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Dev", "Client"] },
      { title: "Analytics", href: "/analytics", icon: BarChart3, roles: ["Admin", "Manager"] },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Users & Roles", href: "/users", icon: Users, roles: ["Admin"] },
      { title: "Clients", href: "/clients", icon: Briefcase, roles: ["Admin", "Manager"] },
      { title: "Projects", href: "/projects", icon: FolderKanban, roles: ["Admin", "Manager", "Dev"] },
      { title: "Services", href: "/services", icon: Wrench, roles: ["Admin", "Manager"] },
       { title: "Portfolio", href: "/admin/portfolio", icon: ImageIcon, roles: ["Admin", "Manager"] },
      // New additions for content management
      { title: "Packages / Pricing", href: "/packages", icon: Package, roles: ["Admin", "Manager"] },
      { title: "FAQs", href: "/admin-faqs", icon: HelpCircle, roles: ["Admin"] },
      { title: "Terms & Conditions", href: "/terms", icon: FileText, roles: ["Admin"] },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Invoices", href: "/invoices", icon: FileText, roles: ["Admin", "Manager", "Client"] },
      { title: "Leads", href: "/leads", icon: Target, roles: ["Admin", "Manager"] },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Blog / CMS", href: "/blog", icon: BookOpen, roles: ["Admin", "Manager"] },
      { title: "Knowledge Base", href: "/knowledge-base", icon: BookMarked, roles: ["Admin", "Manager", "Dev"] },
    ],
  },
  {
    label: "Support",
    items: [
      { title: "Tickets", href: "/tickets", icon: Headphones, roles: ["Admin", "Manager", "Dev", "Client"] },
      { title: "CRM Automation", href: "/crm", icon: Zap, roles: ["Admin", "Manager"] },
    ],
  },
  {
    label: "Documents",
    items: [
      { title: "Proposals", href: "/proposals", icon: FileSignature, roles: ["Admin", "Manager"] },
      { title: "Contracts", href: "/contracts", icon: ScrollText, roles: ["Admin", "Manager"] },
    ],
  },
  {
    label: "Team",
    items: [
      { title: "Performance", href: "/team-performance", icon: TrendingUp, roles: ["Admin", "Manager"] },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Security", href: "/security", icon: Shield, roles: ["Admin"] },
      { title: "Backup", href: "/backup", icon: HardDrive, roles: ["Admin"] },
      { title: "Marketing", href: "/marketing", icon: Megaphone, roles: ["Admin", "Manager"] },
      { title: "Multi-Company", href: "/multi-company", icon: Building2, roles: ["Admin"] },
      { title: "Settings", href: "/settings", icon: Settings, roles: ["Admin", "Manager"] },
    ],
  },
  {
    label: "Portal",
    items: [
      { title: "Client Portal", href: "/client-portal", icon: UserCircle, roles: ["Client"] },
      { title: "Subscription", href: "/subscription", icon: CreditCard, roles: ["Admin"] },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const userRole = user?.role ?? "Admin"

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                  AM
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">AM Enterprises</span>
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(userRole as Role))
          if (visibleItems.length === 0) return null
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user?.avatar ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-sm">{user?.name ?? "User"}</span>
                    <span className="text-xs text-muted-foreground">{user?.role ?? "Role"}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 size-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
