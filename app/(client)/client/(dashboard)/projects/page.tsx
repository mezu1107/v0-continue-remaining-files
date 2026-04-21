import { createClient } from "@/lib/supabase/server"
import { ProjectsContent } from "@/components/client/projects-content"

export const metadata = {
  title: "Projects | Client Portal",
}

export default async function ClientProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      project_files(count),
      project_comments(count)
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  return <ProjectsContent projects={projects || []} />
}
