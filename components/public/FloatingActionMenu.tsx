"use client"
/**
 * AM ENTERPRISES - PUBLIC FLOATING ACTION MENU
 * =====================================================================
 * 
 * YE PURA COMPLETE CODE HAI – HAR CHEEZ DEEP DETAIL MEIN EXPLAIN KI GAYI HAI
 * 
 * KYA KYA INCLUDE HAI (DEEP EXPLANATION):
 * 
 * 1. Floating Main Button (bottom right) → click karne pe menu open hota hai
 * 2. Sirf EK WhatsApp Icon (green) → dono numbers (03173712950 aur +447717229638) message mein mention hain
 *    → Menu clean aur professional dikhta hai (do-do WhatsApp icons nahi)
 * 3. Naya LIVE CHAT Icon (indigo color + Headphones icon) → future mein tawk.to integrate karne ke liye
 *    → Abhi click pe toast aayega "Live Chat coming soon!" 
 *    → Jab tawk.to add karoge to is button pe `window.Tawk_API.toggle()` laga sakte ho
 * 4. Proposal Form Button (blue) → bohot deep aur detailed form
 * 
 * TOTAL 3 ICONS: WhatsApp (green), Live Chat (indigo), Proposal (blue)
 * 
 * Har icon:
 * - Rounded full circle (h-12 w-12)
 * - Shadow + hover effect
 * - Clear title tooltip (hover karne pe text dikhega)
 * - Framer Motion animation (smooth pop-in)
 * 
 * Proposal Form Features (deep):
 * - 7 fields with * required
 * - Professional placeholders (customer ko guide karta hai)
 * - Real-time validation (production level)
 * - Supabase mein lead save hota hai (Admin Panel mein dikhega)
 * - Email ready (amenterprises1105@gmail.com) – next step edge function
 * 
 * Sab kuch real data ke sath: WhatsApp numbers, company email, source tracking
 * 
 * COPY-PASTE READY FOR PUBLIC PAGE
 * Koi bhi change nahi karna – bas yeh file replace kar do
 */

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { MessageCircle, FileText, Loader2, X, Headphones, Ticket } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"

// ─────────────────────────────────────────────
// 🔹 TYPE DEFINITIONS - DEEP BUSINESS STRUCTURE
// ─────────────────────────────────────────────
type ProposalForm = {
    name: string          // Customer ka full name
    email: string         // Professional email
    phone: string         // International format phone
    company_name: string  // Company/Brand name
    project_type: string  // Website, App, etc.
    budget: string        // PKR budget range
    timeline: string      // Project completion time
    message: string       // Detailed project description
}

// ─────────────────────────────────────────────
// 🔹 MAIN COMPONENT
// ─────────────────────────────────────────────
export function FloatingActionMenu() {
    // ────── STATE MANAGEMENT ──────
    const [isOpen, setIsOpen] = useState(false)           // Floating menu open/close
    const [proposalOpen, setProposalOpen] = useState(false) // Proposal dialog
    const [isSubmitting, setIsSubmitting] = useState(false) // Submit button loading

    // Supabase client (client-side)
    const supabase = createClient()

    // Form state with initial empty values
    const [form, setForm] = useState<ProposalForm>({
        name: "",
        email: "",
        phone: "",
        company_name: "",
        project_type: "",
        budget: "",
        timeline: "",
        message: "",
    })

    // Real-time error messages
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // ─────────────────────────────────────────────
    // 🔹 REAL WHATSAPP LINK (SIRF EK BUTTON)
    //    Dono numbers message mein hain
    // ─────────────────────────────────────────────
    const whatsappLink =
        "https://wa.me/923173712950?text=Hello%20AM%20Enterprises%2C%20I%20want%20to%20discuss%20a%20project.%20%0A%0APakistan%20Number%3A%20%2B923173712950%0AUK%20Number%3A%20%2B447717229638"

    // ─────────────────────────────────────────────
    // 🔹 VALIDATION FUNCTION - PRODUCTION LEVEL
    // ─────────────────────────────────────────────
    const validateForm = () => {
        const newErrors: typeof errors = {}

        if (!form.name.trim()) newErrors.name = "Full name is required"
        if (!form.email.trim()) newErrors.email = "Email is required"
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
            newErrors.email = "Please enter a valid email address"

        if (!form.phone.trim()) newErrors.phone = "Phone number is required"
        else if (!/^\+?\d{10,15}$/.test(form.phone))
            newErrors.phone = "Enter valid international phone (e.g. +923173712950)"

        if (!form.company_name.trim())
            newErrors.company_name = "Company / Brand name is required"

        if (!form.project_type) newErrors.project_type = "Please select project type"
        if (!form.budget) newErrors.budget = "Please select estimated budget"
        if (!form.timeline) newErrors.timeline = "Please select expected timeline"

        if (!form.message.trim() || form.message.length < 20)
            newErrors.message = "Please describe your project in detail (minimum 20 characters)"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // ─────────────────────────────────────────────
    // 🔹 SUBMIT HANDLER - SUPABASE + EMAIL READY
    // ─────────────────────────────────────────────
    const handleProposalSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            // 1. Save to Supabase (Admin Panel mein dikhega)
            const { error } = await supabase
                .from("leads")
                .insert({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    company_name: form.company_name.trim(),
                    project_type: form.project_type,
                    budget: form.budget,
                    timeline: form.timeline,
                    message: form.message.trim(),
                    source: "Public Floating Menu",
                    status: "new",
                    created_at: new Date().toISOString(),
                })

            if (error) throw error

            // Success message
            toast.success("✅ Proposal submitted successfully! AM Enterprises will contact you within 24 hours.")

            // Reset everything
            setProposalOpen(false)
            setForm({
                name: "", email: "", phone: "", company_name: "",
                project_type: "", budget: "", timeline: "", message: "",
            })
            setErrors({})

        } catch (err) {
            console.error("Lead submission error:", err)
            toast.error("Submission failed. Please try again or contact us on WhatsApp.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // ─────────────────────────────────────────────
    // 🔹 UI RETURN - COMPLETE LAYOUT
    // ─────────────────────────────────────────────
    return (
        <>
            {/* ==================== MAIN FLOATING BUTTON ==================== */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full h-16 w-16 bg-gradient-to-r from-primary to-accent shadow-2xl hover:scale-110 transition-transform"
                    title="Open Quick Actions Menu"
                >
                    {isOpen ? (
                        <X className="h-7 w-7 text-white" />
                    ) : (
                        <MessageCircle className="h-7 w-7 text-white" />
                    )}
                </Button>
            </motion.div>

            {/* ==================== EXPANDED 3 ICONS ==================== */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed bottom-24 right-6 flex flex-col gap-4 items-end z-50">

                        {/* 1. WHATSAPP ICON (GREEN) - EK HI BUTTON */}
                        <motion.a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0, y: 20 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Button 
                                className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700 shadow-xl"
                                title="WhatsApp Chat (Pakistan +923173712950 | UK +447717229638)"
                            >
                                <MessageCircle className="h-6 w-6 text-white" />
                            </Button>
                        </motion.a>

                        {/* 2. LIVE CHAT ICON (INDIGO) - FUTURE TAWK.TO */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0, y: 20 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => {
                                // ←←← TAWK.TO INTEGRATION YAHAN KAREIN ←←←
                                // Example: if (window.Tawk_API) window.Tawk_API.toggle()
                                toast.info("🟣 Live Chat is coming soon! For now, use WhatsApp or submit proposal.")
                            }}
                        >
                            <Button 
                                className="rounded-full h-12 w-12 bg-indigo-600 hover:bg-indigo-700 shadow-xl"
                                title="Live Chat Support - Ask Anything! (tawk.to ready)"
                            >
                                <Headphones className="h-6 w-6 text-white" />
                            </Button>
                        </motion.div>

                        {/* 2.5 SUPPORT TICKET ICON (GREEN) */}
                        <Link href="/tickets">
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: 20 }}
                                transition={{ delay: 0.25 }}
                            >
                                <Button 
                                    className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700 shadow-xl"
                                    title="Submit Support Ticket"
                                >
                                    <Ticket className="h-6 w-6 text-white" />
                                </Button>
                            </motion.div>
                        </Link>

                        {/* 3. PROPOSAL FORM ICON (BLUE) */}
                        <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-xl"
                                    title="Request Custom Proposal"
                                >
                                    <FileText className="h-6 w-6 text-white" />
                                </Button>
                            </DialogTrigger>

                            {/* ==================== DEEP DETAILED PROPOSAL FORM ==================== */}
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Request Custom Proposal</DialogTitle>
                                    <DialogDescription className="text-base">
                                        Fill every detail below. Our team will review your requirements and send you a complete professional proposal within 24 hours.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">

                                    {/* FULL NAME */}
                                    <div>
                                        <Label>Full Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="e.g. Ahmed Khan"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <Label>Email Address <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="email"
                                            placeholder="yourname@company.com"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                                    </div>

                                    {/* PHONE */}
                                    <div>
                                        <Label>Phone Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="+923173712950 or +447717229638"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                        />
                                        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* COMPANY / BRAND */}
                                    <div>
                                        <Label>Company / Brand Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="e.g. ABC Corporation"
                                            value={form.company_name}
                                            onChange={e => setForm({ ...form, company_name: e.target.value })}
                                        />
                                        {errors.company_name && <p className="text-sm text-destructive mt-1">{errors.company_name}</p>}
                                    </div>

                                    {/* PROJECT TYPE */}
                                    <div>
                                        <Label>Project Type <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={form.project_type}
                                            onValueChange={value => setForm({ ...form, project_type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select what you need" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Website Development">Website Development</SelectItem>
                                                <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                                                <SelectItem value="E-commerce Platform">E-commerce Platform</SelectItem>
                                                <SelectItem value="Custom CRM / ERP">Custom CRM / ERP System</SelectItem>
                                                <SelectItem value="SEO & Digital Marketing">SEO & Digital Marketing</SelectItem>
                                                <SelectItem value="UI/UX Design & Branding">UI/UX Design & Branding</SelectItem>
                                                <SelectItem value="Custom Software Solution">Custom Software Solution</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.project_type && <p className="text-sm text-destructive mt-1">{errors.project_type}</p>}
                                    </div>

                                    {/* BUDGET */}
                                    <div>
                                        <Label>Estimated Budget (PKR) <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={form.budget}
                                            onValueChange={value => setForm({ ...form, budget: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select budget range" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Under 50k">Under 50,000 PKR</SelectItem>
                                                <SelectItem value="50k-150k">50,000 - 150,000 PKR</SelectItem>
                                                <SelectItem value="150k-400k">150,000 - 400,000 PKR</SelectItem>
                                                <SelectItem value="400k+">400,000+ PKR (Enterprise)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
                                    </div>

                                    {/* TIMELINE */}
                                    <div>
                                        <Label>Expected Timeline <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={form.timeline}
                                            onValueChange={value => setForm({ ...form, timeline: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="When do you need it?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Urgent (2 weeks)">Urgent - Within 2 Weeks</SelectItem>
                                                <SelectItem value="1 month">1 Month</SelectItem>
                                                <SelectItem value="1-3 months">1-3 Months</SelectItem>
                                                <SelectItem value="3-6 months">3-6 Months</SelectItem>
                                                <SelectItem value="6+ months">6+ Months (Flexible)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.timeline && <p className="text-sm text-destructive mt-1">{errors.timeline}</p>}
                                    </div>

                                    {/* PROJECT DETAILS */}
                                    <div>
                                        <Label>Project Details <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            rows={6}
                                            placeholder="Describe your project in detail...&#10;Example:&#10;• Goal: Increase online sales by 300%&#10;• Target audience: Pakistan market&#10;• Must have: Payment gateway, mobile responsive, SEO&#10;• Current challenge: Old website is slow"
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                        />
                                        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        onClick={handleProposalSubmit}
                                        disabled={isSubmitting}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending Proposal...
                                            </>
                                        ) : (
                                            "Submit Proposal Request"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
