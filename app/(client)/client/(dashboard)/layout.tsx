import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { ClientHeader } from "@/components/client/client-header"
import { TranslationProvider } from "@/lib/i18n/context"

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/client/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role === "admin" || profile.role === "manager") {
    redirect("/admin-dashboard")
  }

  return (
    <TranslationProvider>
      <div className="min-h-screen bg-background">
        <ClientSidebar profile={profile} />
        <div className="lg:pl-72">
          <ClientHeader profile={profile} />
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </TranslationProvider>
  )
}
