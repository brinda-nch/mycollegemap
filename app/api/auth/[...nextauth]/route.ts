import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// Validate required environment variables
const missingVars: string[] = []
if (!process.env.NEXTAUTH_SECRET) {
  missingVars.push('NEXTAUTH_SECRET')
  console.error('❌ NEXTAUTH_SECRET is missing! This will cause authentication to fail.')
}

// Create error handler for missing configuration
const createErrorHandler = (message: string) => {
  return async (req: NextRequest) => {
    console.error('NextAuth Error:', message)
    return NextResponse.json(
      { 
        error: 'Authentication configuration error',
        message: message,
        missingVars: missingVars.length > 0 ? missingVars : undefined
      },
      { status: 500 }
    )
  }
}

// Initialize NextAuth handler
let handler: ReturnType<typeof NextAuth>

try {
  // Check if required vars are missing
  if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
    handler = createErrorHandler(
      `Missing required environment variables: ${missingVars.join(', ')}. Please add them in Vercel Dashboard → Settings → Environment Variables.`
    ) as any
  } else {
    handler = NextAuth(authOptions)
  }
} catch (error: any) {
  console.error('❌ Failed to initialize NextAuth:', error)
  const errorMessage = error?.message || 'Unknown error during NextAuth initialization'
  handler = createErrorHandler(`NextAuth initialization failed: ${errorMessage}`) as any
}

export { handler as GET, handler as POST }
