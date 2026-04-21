import { createClient } from "@/lib/supabase/server"
import { ClientDashboardContent } from "@/components/client/dashboard-content"

export const metadata = {
  title: "Dashboard | Client Portal",
}

async function getDashboardData(userId: string) {
  const supabase = await createClient()

  const [
    { data: profile },
    { data: projects },
    { data: invoices },
    { data: notifications },
    { data: meetings },
    { data: tickets },
    { data: messages },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("projects").select("*").eq("client_id", userId),
    supabase.from("invoices").select("*").eq("client_id", userId),
    supabase.from("notifications").select("*").eq("user_id", userId).eq("is_read", false).limit(5),
    supabase.from("meetings").select("*").eq("client_id", userId).eq("status", "scheduled").gte("meeting_date", new Date().toISOString()).order("meeting_date", { ascending: true }).limit(5),
    supabase.from("tickets").select("*").eq("client_id", userId).in("status", ["open", "in_progress"]),
    supabase.from("messages").select("*").eq("receiver_id", userId).eq("is_read", false),
    supabase.from("activity_log").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
  ])

  // Calculate stats
  const activeProjects = projects?.filter(p => p.status === "in_progress" || p.status === "pending" || p.status === "review").length || 0
  const totalInvoices = invoices?.length || 0
  const paidInvoices = invoices?.filter(i => i.status === "paid").length || 0
  const unpaidInvoices = invoices?.filter(i => i.status === "pending" || i.status === "overdue").length || 0
  const remainingBalance = invoices?.filter(i => i.status === "pending" || i.status === "overdue").reduce((sum, i) => sum + Number(i.total), 0) || 0
  const unreadMessages = messages?.length || 0
  const openTickets = tickets?.length || 0
  const unreadNotifications = notifications?.length || 0

  return {
    profile,
    stats: {
      activeProjects,
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      remainingBalance,
      unreadMessages,
      openTickets,
      unreadNotifications,
    },
    projects: projects?.slice(0, 5) || [],
    upcomingMeetings: meetings || [],
    recentActivity: recentActivity || [],
  }
}

export default async function ClientDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const data = await getDashboardData(user.id)

  return <ClientDashboardContent data={data} />
}
