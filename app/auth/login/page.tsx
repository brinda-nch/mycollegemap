"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { GraduationCap, Eye, EyeOff } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8" style={{ color: '#f89880' }} />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-navy-800">Welcome to My College Map</CardTitle>
          <CardDescription className="text-center text-navy-600">
            Sign in to access your college and summer program application tracker and manage your academic journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-800">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                     className="border-gray-300"
                     style={{ 
                       focusBorderColor: '#f89880',
                       focusRingColor: '#f89880'
                     }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy-800">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                     className="border-gray-300"
                     style={{ 
                       focusBorderColor: '#f89880',
                       focusRingColor: '#f89880'
                     }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-navy-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm hover:underline" style={{ color: '#f89880' }}>
                  Forgot your password?
                </Link>
              </div>
            </div>

                 <Button 
                   type="submit" 
                   className="w-full text-white" 
                   disabled={isLoading}
                   style={{ 
                     backgroundColor: '#f89880',
                     borderColor: '#f89880'
                   }}
                   onMouseEnter={(e) => {
                     if (!isLoading) {
                       e.currentTarget.style.backgroundColor = '#f5856b';
                       e.currentTarget.style.borderColor = '#f5856b';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (!isLoading) {
                       e.currentTarget.style.backgroundColor = '#f89880';
                       e.currentTarget.style.borderColor = '#f89880';
                     }
                   }}
                 >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>



          <div className="mt-6 text-center text-sm">
            <span className="text-navy-600">Don't have an account? </span>
                <Link href="/auth/signup" className="hover:underline" style={{ color: '#f89880' }}>
              Sign up
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
