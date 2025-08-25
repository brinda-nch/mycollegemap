import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase, isDemoMode } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { token, password, email } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // If email is provided, we're doing a direct reset without token validation
    if (email && !token) {
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
      }
    } else if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // In demo mode, just return success
    if (isDemoMode) {
      if (email) {
        console.log("Demo mode: Direct password reset for email:", email)
        console.log("Demo mode: New password:", password)
      } else {
        console.log("Demo mode: Password reset with token:", token)
        console.log("Demo mode: New password:", password)
      }
      return NextResponse.json({ 
        message: "Password reset successful (demo mode)", 
        success: true 
      }, { status: 200 })
    }

    try {
      let userId: string

      if (email) {
        // Direct reset by email (for demo mode or admin reset)
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single()

        if (userError || !user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        userId = user.id
      } else {
        // Token-based reset
        const { data: resetToken, error: tokenError } = await supabase
          .from("password_reset_tokens")
          .select("*")
          .eq("token", token)
          .eq("used", false)
          .single()

        if (tokenError || !resetToken) {
          return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
        }

        // Check if token has expired
        const expiresAt = new Date(resetToken.expires_at)
        if (expiresAt < new Date()) {
          return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
        }

        userId = resetToken.user_id
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Update the user's password
      const { error: updateError } = await supabase
        .from("users")
        .update({ password_hash: hashedPassword })
        .eq("id", userId)

      if (updateError) {
        console.error("Error updating password:", updateError)
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
      }

      // Mark the token as used (only for token-based resets)
      if (!email && token) {
        const { error: markUsedError } = await supabase
          .from("password_reset_tokens")
          .update({ used: true })
          .eq("token", token)

        if (markUsedError) {
          console.error("Error marking token as used:", markUsedError)
          // Don't fail the request if this fails
        }
      }

      return NextResponse.json({ 
        message: "Password reset successful", 
        success: true 
      }, { status: 200 })

    } catch (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
    }

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ 
      error: "An error occurred while processing your request" 
    }, { status: 500 })
  }
}
