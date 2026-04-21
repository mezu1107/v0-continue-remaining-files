"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function clientLogin(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if user is a client
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profile?.role === "admin" || profile?.role === "manager") {
    return { error: "Please use the admin login portal" }
  }

  redirect("/client/dashboard")
}

export async function clientLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/client/login")
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? process.env.NEXT_PUBLIC_SITE_URL}/client/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { error: "Password is required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/client/dashboard")
}

export async function getClientProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

export async function updateClientProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "Not authenticated" }
  }

  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const companyName = formData.get("companyName") as string
  const language = formData.get("language") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      company_name: companyName,
      language,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function changeClientPassword(formData: FormData) {
  const supabase = await createClient()
  
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  // Verify current password
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) {
    return { error: "Not authenticated" }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (signInError) {
    return { error: "Current password is incorrect" }
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
