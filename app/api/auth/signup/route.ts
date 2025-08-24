import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase, isDemoMode } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, graduationYear, highSchool } = body

    // Validation
    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Email, password, and first name are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // In demo mode, just return success without actually creating a user
    if (isDemoMode) {
      return NextResponse.json({ 
        message: "Account created successfully (demo mode)", 
        userId: "demo-user-" + Date.now() 
      }, { status: 201 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName || null,
        graduation_year: graduationYear ? Number.parseInt(graduationYear) : null,
        high_school: highSchool || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
