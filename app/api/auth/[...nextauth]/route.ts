import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// Validate configuration before creating handler
if (!process.env.NEXTAUTH_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ NEXTAUTH_SECRET is required for production!')
  }
  // In development, NextAuth will generate a warning but still work
}

let handler: ReturnType<typeof NextAuth>

try {
  handler = NextAuth(authOptions)
} catch (error) {
  console.error('❌ Failed to initialize NextAuth:', error)
  // Create a fallback handler that returns an error
  const errorHandler = async (req: NextRequest) => {
    return NextResponse.json(
      { error: 'Authentication server error. Check server logs.' },
      { status: 500 }
    )
  }
  handler = errorHandler as any
}

export { handler as GET, handler as POST }
