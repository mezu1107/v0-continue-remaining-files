"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, LogOut, Settings, User, Globe, Check, ChevronDown } from "lucide-react"
import Link from "next/link"

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

interface Notification {
  id: string
  title: string
  content: string | null
  is_read: boolean
  created_at: string
  type: string
  link: string | null
}

export function ClientHeader({ profile }: { profile: Profile }) {
  const router = useRouter()
  const { t, language, setLanguage } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
  }

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
    
    fetchNotifications()
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", profile.id)
      .eq("is_read", false)
    
    fetchNotifications()
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/client/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="lg:hidden w-12" />
        
        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "en" ? "English" : "اردو"}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2">
                {language === "en" && <Check className="w-4 h-4" />}
                <span className={language !== "en" ? "ml-6" : ""}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ur")} className="gap-2">
                {language === "ur" && <Check className="w-4 h-4" />}
                <span className={language !== "ur" ? "ml-6" : ""}>اردو</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t.notifications.title}</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary"
                    onClick={markAllAsRead}
                  >
                    {t.notifications.markAllRead}
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t.notifications.noNotifications}
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.is_read ? "bg-muted/50" : ""}`}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.link) {
                        router.push(notification.link)
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="font-medium text-sm">{notification.title}</span>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {notification.content && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {notification.content}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
              {notifications.length > 5 && (
                <>
                  <DropdownMenuSeparator />
                  <Link href="/client/notifications" className="block">
                    <DropdownMenuItem className="text-center text-primary">
                      {t.dashboard.viewAll}
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                  {profile.full_name?.charAt(0) || profile.email?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {profile.full_name || "User"}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile.full_name || "User"}</span>
                  <span className="text-xs font-normal text-muted-foreground">{profile.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/client/settings">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  {t.nav.profile}
                </DropdownMenuItem>
              </Link>
              <Link href="/client/settings">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  {t.nav.settings}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                {t.auth.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
