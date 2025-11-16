import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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

        // Demo mode authentication - accept any email/password
        if (isDemoMode) {
          // Extract name from email for demo purposes
          const emailName = credentials.email.split('@')[0]
          const [firstName, lastName] = emailName.split('.')
          
          return {
            id: "demo-user-" + Date.now(),
            email: credentials.email,
            name: firstName ? `${firstName} ${lastName || ''}`.trim() : emailName,
            firstName: firstName || emailName,
            lastName: lastName || null,
            graduationYear: 2025,
            highSchool: "Demo High School",
          }
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
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google" && user.email) {
        try {
          // Check if user exists in database
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single()

          if (!existingUser) {
            // Create new user for Google OAuth (from signup page)
            const nameParts = user.name?.split(" ") || []
            const firstName = nameParts[0] || ""
            const lastName = nameParts.slice(1).join(" ") || ""

            const { data: newUser } = await supabase.from("users").insert({
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              oauth_provider: "google",
              oauth_id: user.id,
              avatar_url: user.image,
              created_at: new Date().toISOString(),
            }).select().single()

            // Create trial subscription for new OAuth user (14 days)
            if (newUser) {
              const trialEnd = new Date()
              trialEnd.setDate(trialEnd.getDate() + 14)

              await supabase.from("user_subscriptions").insert({
                user_id: newUser.id,
                subscription_tier: 'trial',
                status: 'trialing',
                trial_start: new Date().toISOString(),
                trial_end: trialEnd.toISOString(),
                has_selected_plan: false
              })
            }
          } else if (!existingUser.oauth_provider) {
            // Link Google account to existing email/password account
            await supabase
              .from("users")
              .update({
                oauth_provider: "google",
                oauth_id: user.id,
                avatar_url: user.image,
              })
              .eq("email", user.email)
          }
        } catch (error) {
          console.error("Error creating/updating Google user:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.graduationYear = user.graduationYear
        token.highSchool = user.highSchool
      }

      // For Google OAuth, fetch user data from database
      if (account?.provider === "google" && token.email) {
        try {
          const { data: dbUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", token.email)
            .single()

          if (dbUser) {
            token.firstName = dbUser.first_name
            token.lastName = dbUser.last_name
            token.graduationYear = dbUser.graduation_year
            token.highSchool = dbUser.high_school
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
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
