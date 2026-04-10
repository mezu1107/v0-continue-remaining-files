"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Loader2, Search, X, Trash, Pencil } from "lucide-react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Service = {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  pricing: { basic: number; pro: number; enterprise: number }
  active: boolean
  created_at: string
}

type FormState = {
  id?: string          // for edit
  name: string
  category: string
  description: string
  featureInput: string
  features: string[]
  pricing: { basic: number; pro: number; enterprise: number }
  active: boolean
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(n)

export default function ServicesCRUDPage() {
  const supabase = createClient()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [mode, setMode] = useState<"add" | "edit">("add")
  const [currentService, setCurrentService] = useState<Service | null>(null)

  const [form, setForm] = useState<FormState>({
    name: "", category: "", description: "", featureInput: "", features: [],
    pricing: { basic: 0, pro: 0, enterprise: 0 }, active: true,
  })

  const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

  // ─────────────────────────────────────────────
  // Load services
  // ─────────────────────────────────────────────
  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Could not load services: " + error.message)
      console.error(error)
    } else {
      setServices(data || [])
    }
    setLoading(false)
  }

  // ─────────────────────────────────────────────
  // Search + categories
  // ─────────────────────────────────────────────
  const filtered = useMemo(() =>
  services.filter(s => s.name && s.name.toLowerCase().includes(search.toLowerCase())),
[services, search])

  const categories = [...new Set(filtered.map(s => s.category || "Uncategorized"))]

  // ─────────────────────────────────────────────
  // Form logic
  // ─────────────────────────────────────────────
  const validate = () => {
    const err: typeof errors = {}
    if (!form.name.trim()) err.name = "Name is required"
    if (!form.description.trim()) err.description = "Description is required"
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const resetForm = () => {
    setForm({
      name: "", category: "", description: "", featureInput: "", features: [],
      pricing: { basic: 0, pro: 0, enterprise: 0 }, active: true,
    })
    setErrors({})
    setMode("add")
    setCurrentService(null)
  }

  const openAdd = () => {
    resetForm()
    setOpenDialog(true)
  }

  const openEdit = (service: Service) => {
    setMode("edit")
    setCurrentService(service)
    setForm({
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      featureInput: "",
      features: [...service.features],
      pricing: { ...service.pricing },
      active: service.active,
    })
    setOpenDialog(true)
  }

  const addFeature = () => {
    if (!form.featureInput.trim()) return
    setForm(p => ({ ...p, features: [...p.features, p.featureInput.trim()], featureInput: "" }))
  }

  const removeFeature = (idx: number) => {
    setForm(p => ({ ...p, features: p.features.filter((_, i) => i !== idx) }))
  }

  const handlePrice = (tier: "basic" | "pro" | "enterprise", val: string) => {
    setForm(p => ({
      ...p,
      pricing: { ...p.pricing, [tier]: Number(val) || 0 },
    }))
  }

  // ─────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────
  const saveService = async () => {
    if (!validate()) {
      toast.error("Please fix the errors")
      return
    }

    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("You must be logged in")
      setIsSubmitting(false)
      return
    }

    const payload = {
      company_id: user.id,
      name: form.name.trim(),
      category: form.category.trim() || "Uncategorized",
      description: form.description.trim(),
      features: form.features,
      pricing: form.pricing,
      active: form.active,
    }

    let result
    let error

    if (mode === "add") {
      result = await supabase.from("services").insert(payload).select().single()
    } else {
      result = await supabase
        .from("services")
        .update(payload)
        .eq("id", form.id!)
        .select()
        .single()
    }

    ({ data: result.data, error } = result)

    setIsSubmitting(false)

    if (error) {
      toast.error(`${mode === "add" ? "Add" : "Update"} failed: ${error.message}`)
      console.error(error)
      return
    }

    if (mode === "add") {
      setServices([result.data, ...services])
      toast.success("Service created")
    } else {
      setServices(services.map(s => s.id === result.data.id ? result.data : s))
      toast.success("Service updated")
    }

    setOpenDialog(false)
    resetForm()
  }

  const toggleActive = async (id: string, wasActive: boolean) => {
    const newActive = !wasActive
    setServices(services.map(s => s.id === id ? { ...s, active: newActive } : s))

    const { error } = await supabase
      .from("services")
      .update({ active: newActive })
      .eq("id", id)

    if (error) {
      toast.error("Could not update status")
      setServices(services.map(s => s.id === id ? { ...s, active: wasActive } : s))
    }
  }

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id)

    if (error) {
      toast.error("Delete failed: " + error.message)
      console.error(error)
    } else {
      setServices(services.filter(s => s.id !== id))
      toast.success("Service deleted")
    }
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-9 w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No services yet. Click "Add Service" to create one.
        </div>
      ) : (

        /* Categories + Cards */
        categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{cat}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered
                .filter(s => (s.category || "Uncategorized") === cat)
                .map(service => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="h-full transition-shadow hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-3">
                          <CardTitle className="text-xl leading-tight">{service.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={service.active}
                              onCheckedChange={() => toggleActive(service.id, service.active)}
                            />
                            <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete "{service.name}"?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => deleteService(service.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1.5">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center mb-6">
                          {["basic", "pro", "enterprise"].map(tier => (
                            <div key={tier}>
                              <div className="text-xs uppercase text-muted-foreground font-medium">{tier}</div>
                              <div className="text-lg font-bold">{formatCurrency(service.pricing[tier as keyof typeof service.pricing])}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {service.features.map((f, i) => (
                            <Badge key={i} variant="secondary">{f}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={v => { setOpenDialog(v); if (!v) resetForm() }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add New Service" : "Edit Service"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">

            <div className="space-y-2">
              <Label>Name <span className="text-red-600">*</span></Label>
              <Input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Professional Website Development"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                placeholder="e.g. Web Development, Graphic Design"
              />
            </div>

            <div className="space-y-2">
              <Label>Description <span className="text-red-600">*</span></Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Detailed description of what the service includes..."
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label>Pricing (PKR)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["basic", "pro", "enterprise"].map(tier => (
                  <div key={tier} className="space-y-1">
                    <Label className="capitalize">{tier}</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.pricing[tier as keyof typeof form.pricing] || ""}
                      onChange={e => handlePrice(tier as any, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add feature (press Enter)"
                  value={form.featureInput}
                  onChange={e => setForm(p => ({ ...p, featureInput: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }}
                />
                <Button type="button" variant="secondary" onClick={addFeature}>Add</Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 min-h-[2.5rem]">
                {form.features.map((f, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="pl-3 pr-2 py-1.5 text-sm cursor-pointer hover:bg-destructive/10"
                    onClick={() => removeFeature(i)}
                  >
                    {f} <X className="ml-1.5 h-3.5 w-3.5" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={checked => setForm(p => ({ ...p, active: checked }))}
              />
              <Label htmlFor="active">Active (visible to public)</Label>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={saveService}
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}