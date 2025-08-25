import { type NextRequest, NextResponse } from "next/server"
import { supabase, isDemoMode } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // In demo mode, just return success without actually sending email
    if (isDemoMode) {
      console.log("Demo mode: Password reset requested for:", email)
      return NextResponse.json({ 
        message: "Password reset email sent (demo mode)", 
        success: true 
      }, { status: 200 })
    }

    // In a real app, you would:
    // 1. Check if the user exists
    // 2. Generate a secure reset token
    // 3. Store the token with expiration
    // 4. Send an email with the reset link

    try {
      // Check if user exists
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email")
        .eq("email", email)
        .single()

      if (userError || !user) {
        // Don't reveal if user exists or not for security
        return NextResponse.json({ 
          message: "If an account with that email exists, a password reset link has been sent",
          success: true 
        }, { status: 200 })
      }

      // Generate reset token (in a real app, use a secure token)
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      
      // Store reset token with expiration (1 hour)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      
      const { error: tokenError } = await supabase
        .from("password_reset_tokens")
        .upsert({
          user_id: user.id,
          token: resetToken,
          expires_at: expiresAt.toISOString(),
          used: false
        })

      if (tokenError) {
        console.error("Error storing reset token:", tokenError)
        return NextResponse.json({ 
          message: "If an account with that email exists, a password reset link has been sent",
          success: true 
        }, { status: 200 })
      }

      // In a real app, send email here
      console.log("Password reset token generated:", resetToken)
      console.log("Reset link would be:", `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)

      return NextResponse.json({ 
        message: "If an account with that email exists, a password reset link has been sent",
        success: true 
      }, { status: 200 })

    } catch (error) {
      console.error("Database error:", error)
      return NextResponse.json({ 
        message: "If an account with that email exists, a password reset link has been sent",
        success: true 
      }, { status: 200 })
    }

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request" 
    }, { status: 500 })
  }
}

