// app/(public)/our-services/page.tsx
import { createClient } from "@/lib/supabase/server"
import ServicesClient from "./services-client"
import type { Metadata } from "next"
import type { Service } from "./types/type" // shared type import
import { ParticlesBackground } from "@/components/public/particles-background"

export const metadata: Metadata = {
  title:
    "Top IT Services Company in Islamabad & Rawalpindi | Web, App & AI Solutions",
  description:
    "Leading digital agency in Islamabad & Rawalpindi providing web development, mobile apps, AI solutions, cloud services & branding. Serving Pakistan and international clients.",
  keywords: [
    "IT company Islamabad",
    "IT services Rawalpindi",
    "Web development Islamabad",
    "Mobile app development Pakistan",
    "AI solutions company",
    "Software house Rawalpindi",
    "International IT services",
  ],
  openGraph: {
    title: "Top IT Services Company in Islamabad & Rawalpindi",
    description:
      "Professional web, mobile, AI & cloud services for local and international businesses.",
    type: "website",
  },
}

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("order", { ascending: true })

  // 🟢 Map admin data to frontend Service type including 'category'
  const mappedServices: Service[] = (services || []).map((s: any) => ({
    id: s.id,
    title: s.title || s.name || "Untitled Service",
    category: s.category || "Uncategorized", // new: category included
    description: s.description || "",
    features: s.features || [],
    gradient: s.gradient || "from-teal-500 to-green-500",
    order: s.order || 0,
    icon_name: s.icon_name || "Code2",
    created_at: s.created_at,
  }))

  return <ServicesClient services={mappedServices} />
}