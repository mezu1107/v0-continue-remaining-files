// app/(public)/layout.tsx
import { PublicNavbar } from "@/components/public/public-navbar"
import { PublicFooter } from "@/components/public/public-footer"
import { FloatingActionMenu } from "@/components/public/FloatingActionMenu"
import { FloatingTicketWidget } from "@/components/public/floating-ticket-widget"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      {/* Navbar - Top fixed ya sticky */}
      <PublicNavbar />

      {/* Main Content - Flexible grow karega */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <PublicFooter />

      {/* Floating Action Menu (teen icons wala) - Bottom right sticky */}
      <FloatingActionMenu />

      {/* Floating Ticket Widget - Support access */}
      <FloatingTicketWidget />
    </div>
  )
}
