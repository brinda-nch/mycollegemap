"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    graduationYear: "",
    highSchool: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup form submitted with:", formData)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      console.log("Sending signup request...")
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          graduationYear: formData.graduationYear,
          highSchool: formData.highSchool,
        }),
      })

      console.log("Signup response status:", response.status)
      const data = await response.json()
      console.log("Signup response data:", data)

      if (!response.ok) {
        setError(data.error || "An error occurred during signup")
        return
      }

      console.log("Signup successful, redirecting to login...")
      // Redirect to login page with success message
      router.push("/auth/login?message=Account created successfully. Please sign in.")
    } catch (error) {
      console.error("Signup error:", error)
      setError("An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-8">
            <Link href="/" className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#1e293b' }}>
              MyCollegeMap
            </Link>
            <Link 
              href="/features" 
              className="hidden sm:inline-block text-sm lg:text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="hidden sm:inline-block text-sm lg:text-base font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center">
            <Link
              href="/auth/login"
              className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Form */}
      <div className="flex items-center justify-center min-h-screen py-20 sm:py-12 px-3 sm:px-4 lg:px-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-5 sm:mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0f172a' }}>
                Create your account
              </h1>
              <p className="text-sm sm:text-base text-slate-600">
                Start your college journey today
              </p>
            </div>

            {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                disabled={isLoading}
                className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880] pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highSchool" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                High School
              </Label>
              <Input
                id="highSchool"
                placeholder="Your High School Name"
                value={formData.highSchool}
                onChange={(e) => handleChange("highSchool", e.target.value)}
                disabled={isLoading}
                className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                Expected Graduation Year
              </Label>
              <Select
                value={formData.graduationYear}
                onValueChange={(value) => handleChange("graduationYear", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]">
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {graduationYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-white rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:scale-105" 
              disabled={isLoading}
              style={{ 
                backgroundColor: '#f89880',
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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

            {/* Google Sign Up */}
            <Button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-base border-2 border-gray-300 bg-white hover:bg-gray-50 text-slate-700 transition-all hover:shadow-lg flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
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
              Sign up with Google
            </Button>

            {/* Sign in link */}
            <div className="mt-5 sm:mt-6 lg:mt-8 text-center">
              <span className="text-xs sm:text-sm text-slate-600">Already have an account? </span>
              <Link 
                href="/auth/login" 
                className="text-xs sm:text-sm font-semibold hover:underline transition-colors" 
                style={{ color: '#f89880' }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
