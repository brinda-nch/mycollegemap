"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", { email, password })
    setError("")
    setIsLoading(true)

    try {
      console.log("Attempting to sign in...")
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        console.error("Sign in error:", result.error)
        setError("Invalid email or password")
      } else {
        console.log("Sign in successful, checking session...")
        // Get the session to ensure it's properly set
        const session = await getSession()
        console.log("Session:", session)
        if (session) {
          console.log("Session found, redirecting to dashboard...")
          router.push("/dashboard")
          router.refresh()
        } else {
          console.log("No session found, retrying...")
          // If no session, try again after a short delay
          setTimeout(async () => {
            const retrySession = await getSession()
            console.log("Retry session:", retrySession)
            if (retrySession) {
              router.push("/dashboard")
              router.refresh()
            } else {
              setError("Login successful but session not established. Please try again.")
            }
          }, 1000)
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#1e293b' }}>
              MyCollegeMap
            </Link>
            <Link 
              href="/features" 
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/auth/signup"
              className="px-5 py-2 text-sm font-medium rounded-full text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#f89880' }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>
                Welcome back
              </h1>
              <p className="text-slate-600">
                Sign in to continue your college journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880] pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                <div className="text-right">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm hover:underline transition-colors" 
                    style={{ color: '#f89880' }}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:scale-105" 
                disabled={isLoading}
                style={{ 
                  backgroundColor: '#f89880',
                }}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-600">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-base border-2 border-gray-300 bg-white hover:bg-gray-50 text-slate-700 transition-all hover:shadow-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <span className="text-slate-600">Don't have an account? </span>
              <Link 
                href="/auth/signup" 
                className="font-semibold hover:underline transition-colors" 
                style={{ color: '#f89880' }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
