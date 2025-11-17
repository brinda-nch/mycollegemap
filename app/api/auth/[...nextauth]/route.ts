import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// Validate required environment variables
const missingVars: string[] = []
// Check NEXTAUTH_SECRET - log what we actually have for debugging
if (!process.env.NEXTAUTH_SECRET) {
  missingVars.push('NEXTAUTH_SECRET')
  console.error('❌ NEXTAUTH_SECRET is missing!', {
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('NEXTAUTH') || k.includes('AUTH'))
  })
} else {
  console.log('✅ NEXTAUTH_SECRET is set', {
    hasSecret: true,
    secretLength: process.env.NEXTAUTH_SECRET.length,
    nodeEnv: process.env.NODE_ENV
  })
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
