// app/dashboard/services/new/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Service | Your Company Dashboard",
  description: "Create a new professional service offering with pricing, features, and category for your business.",
  keywords: "add service, create service, business service management, pricing plans",
  robots: { index: false }, // ← usually noindex for dashboard pages
}

export default function NewServicePage() {
  // same form logic as your dialog → just not in DialogContent
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Add New Service</h1>
      {/* your form here */}
    </div>
  )
}