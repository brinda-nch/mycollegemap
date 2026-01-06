import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function PATCH(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { graduationYear, highSchool } = body

    // Validation
    if (!graduationYear || !highSchool) {
      return NextResponse.json(
        { error: "Graduation year and high school are required" },
        { status: 400 }
      )
    }

    // Update user profile in database
    const { error } = await supabase
      .from("users")
      .update({
        graduation_year: parseInt(graduationYear),
        high_school: highSchool,
        updated_at: new Date().toISOString(),
      })
      .eq("email", session.user.email)

    if (error) {
      console.error("Error updating user profile:", error)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}









