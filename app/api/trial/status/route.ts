import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserTrialStatus } from "@/lib/trial-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const status = await getUserTrialStatus(userId)

    if (!status) {
      return NextResponse.json(
        { error: "Failed to get trial status" },
        { status: 500 }
      )
    }

    return NextResponse.json({ status }, { status: 200 })
  } catch (error: any) {
    console.error("Error getting trial status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

