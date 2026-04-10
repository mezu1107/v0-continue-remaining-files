"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const supabase = createClient()

// Lead type
type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  service: string | null
  budget: string | null
  notes: { message: string } | null
  source: string
  status: string
  created_at: string
  created_by: { id: string; email: string } | null
}

export default function MessagesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false) // connect with your global theme toggle

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("leads")
        .select(`
          id,
          name,
          email,
          phone,
          company,
          service,
          budget,
          notes,
          source,
          status,
          created_at,
          created_by:created_by (id, email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Supabase returns created_by as array, extract first element safely
      const parsedLeads: Lead[] = (data || []).map((l: any) => ({
        ...l,
        created_by: Array.isArray(l.created_by) ? l.created_by[0] || null : l.created_by,
      }))

      setLeads(parsedLeads)
    } catch (err: any) {
      console.error("Error fetching leads:", err)
      toast.error(err.message || "Failed to fetch leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(filter.toLowerCase()) ||
      lead.email.toLowerCase().includes(filter.toLowerCase()) ||
      lead.service?.toLowerCase().includes(filter.toLowerCase()) ||
      lead.status.toLowerCase().includes(filter.toLowerCase())
  )

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen p-8`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Leads Dashboard</h1>
        <Input
          placeholder="Search by name, email, service, status..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/20 to-accent/20">
          <CardContent>
            <CardTitle>Total Leads</CardTitle>
            <CardDescription className="text-2xl font-bold">{leads.length}</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-300/20 to-green-500/20">
          <CardContent>
            <CardTitle>New Leads</CardTitle>
            <CardDescription className="text-2xl font-bold">{leads.filter((l) => l.status === "new").length}</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-300/20 to-yellow-500/20">
          <CardContent>
            <CardTitle>In Progress</CardTitle>
            <CardDescription className="text-2xl font-bold">{leads.filter((l) => l.status === "in-progress").length}</CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-300/20 to-red-500/20">
          <CardContent>
            <CardTitle>Completed</CardTitle>
            <CardDescription className="text-2xl font-bold">{leads.filter((l) => l.status === "completed").length}</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Lead Cards */}
      {loading ? (
        <p>Loading leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <motion.div key={lead.id} variants={itemVariants}>
              <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} glass-card`}>
                <CardHeader>
                  <CardTitle>{lead.name}</CardTitle>
                  <CardDescription className="text-sm">{lead.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Phone:</strong> {lead.phone || "-"}</p>
                  <p><strong>Company:</strong> {lead.company || "-"}</p>
                  <p><strong>Service:</strong> {lead.service || "-"}</p>
                  <p><strong>Budget:</strong> {lead.budget || "-"}</p>
                  <p><strong>Status:</strong> <span className={`${lead.status === "new" ? "text-blue-400" : lead.status === "in-progress" ? "text-yellow-400" : "text-green-400"} font-semibold`}>{lead.status}</span></p>
                  <p><strong>Notes:</strong> {lead.notes?.message || "-"}</p>
                  <p><strong>Source:</strong> {lead.source}</p>
                  <p><strong>Created At:</strong> {new Date(lead.created_at).toLocaleString()}</p>
                  <p><strong>Created By:</strong> {lead.created_by?.email || "Unknown"}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}