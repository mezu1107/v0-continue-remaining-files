"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Moon, Search, Sun } from "lucide-react"

export function AdminTopbar() {
  const { company, companies, switchCompany } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("am_theme")
    if (stored === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("am_theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("am_theme", "light")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-9 bg-secondary/50 border-0"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Select value={String(company.id)} onValueChange={(v) => switchCompany(Number(v))}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-9">
              <Bell className="size-4" />
              <Badge className="absolute -right-0.5 -top-0.5 size-4 p-0 text-[10px] flex items-center justify-center" variant="destructive">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-2 text-sm font-medium">Notifications</div>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 p-3">
              <span className="text-sm">New lead assigned</span>
              <span className="text-xs text-muted-foreground">John Smith from NewCorp - 5m ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 p-3">
              <span className="text-sm">Invoice INV-002 pending</span>
              <span className="text-xs text-muted-foreground">GreenLeaf Solutions - 1h ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 p-3">
              <span className="text-sm">Ticket #1 needs attention</span>
              <span className="text-xs text-muted-foreground">Login page not loading - 2h ago</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="size-9">
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
