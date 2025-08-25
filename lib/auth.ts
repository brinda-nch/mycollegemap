import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { supabase, isDemoMode } from "./supabase"

export const authOptions: NextAuthOptions = {
  // Use dynamic URL for production
  url: process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'production' 
    ? process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : undefined
    : 'http://localhost:3000'),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Demo mode authentication
        if (isDemoMode) {
          if (credentials.email === "demo@example.com" && credentials.password === "demo123") {
            return {
              id: "demo-user-id",
              email: credentials.email,
              name: "Demo User",
              firstName: "Demo",
              lastName: "User",
              graduationYear: 2025,
              highSchool: "Demo High School",
            }
          }
          throw new Error("Invalid credentials")
        }

        try {
          const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

          if (error || !user) {
            throw new Error("Invalid credentials")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            graduationYear: user.graduation_year,
            highSchool: user.high_school,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.graduationYear = user.graduationYear
        token.highSchool = user.highSchool
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.graduationYear = token.graduationYear as number
        session.user.highSchool = token.highSchool as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
}
