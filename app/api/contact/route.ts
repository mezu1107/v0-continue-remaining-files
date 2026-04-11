import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, service, budget, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Store in database (leads table)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey || "",
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        company,
        service,
        budget,
        notes: { message },
        source: "contact_form",
        status: "new",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to save contact")
    }

    // Return success
    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        data: await response.json(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
