"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { GraduationCap, Eye, EyeOff } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8" style={{ color: '#f89880' }} />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-navy-800">Join My College Map</CardTitle>
          <CardDescription className="text-center text-navy-600">
            Create your account to start tracking your college applications, summer programs, internships, and academic progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-navy-800">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
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
                <Label htmlFor="lastName" className="text-navy-800">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={isLoading}
                       className="border-gray-300"
                       style={{ 
                         focusBorderColor: '#f89880',
                         focusRingColor: '#f89880'
                       }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-800">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
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
              <Label htmlFor="password" className="text-navy-800">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-navy-800">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highSchool" className="text-navy-800">High School</Label>
              <Input
                id="highSchool"
                placeholder="Your High School Name"
                value={formData.highSchool}
                onChange={(e) => handleChange("highSchool", e.target.value)}
                disabled={isLoading}
                       className="border-gray-300"
                       style={{ 
                         focusBorderColor: '#f89880',
                         focusRingColor: '#f89880'
                       }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="text-navy-800">Expected Graduation Year</Label>
              <Select
                value={formData.graduationYear}
                onValueChange={(value) => handleChange("graduationYear", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-navy-600">Already have an account? </span>
                <Link href="/auth/login" className="hover:underline" style={{ color: '#f89880' }}>
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
