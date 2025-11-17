import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { selectSubscriptionPlan } from "@/lib/trial-utils"

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan } = body

    // Validation - only "standard" plan allowed
    if (!plan || plan !== 'standard') {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'standard'" },
        { status: 400 }
      )
    }

    // Update subscription plan
    const success = await selectSubscriptionPlan(
      session.user.id,
      'standard'
    )

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update subscription plan" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: "Plan selected successfully",
        plan: plan
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Plan selection error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

