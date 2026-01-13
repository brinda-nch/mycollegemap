import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase, isDemoMode } from "@/lib/supabase"

// Server-side validation helpers
const validateName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z][A-Za-z\s'-]*$/
  return nameRegex.test(name.trim())
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
}

const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" }
  }
  const allowedCharsRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:',.<>?\/\\`~"]+$/
  if (!allowedCharsRegex.test(password)) {
    return { valid: false, message: "Password contains invalid characters" }
  }
  return { valid: true, message: "" }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, graduationYear, highSchool } = body

    // Validation
    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Email, password, and first name are required" }, { status: 400 })
    }

    // Validate first name
    if (!validateName(firstName)) {
      return NextResponse.json({ error: "First name should only contain letters" }, { status: 400 })
    }

    // Validate last name if provided
    if (lastName && !validateName(lastName)) {
      return NextResponse.json({ error: "Last name should only contain letters" }, { status: 400 })
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
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
      return NextResponse.json({ 
        error: "Failed to create user account. Please check your database connection and try again." 
      }, { status: 500 })
    }

    // Platform is now free - no trial subscription needed

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
