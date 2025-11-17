"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    graduationYear: "",
    highSchool: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 8 }, (_, i) => currentYear + i)

  // If user already has graduation year and high school, skip to step 2
  useEffect(() => {
    if (session?.user?.graduationYear && session?.user?.highSchool) {
      setStep(2)
    }
  }, [session])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Update user profile with graduation year and high school
      const response = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          graduationYear: formData.graduationYear,
          highSchool: formData.highSchool,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to update profile")
        return
      }

      // Move to next step
      setStep(2)
    } catch (error) {
      console.error("Profile update error:", error)
      setError("An error occurred while updating your profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f89880] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Step 1: Complete Profile */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f89880] mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#0f172a' }}>
                Welcome, {session?.user?.name?.split(' ')[0]}! 🎉
              </h1>
              <p className="text-xl text-slate-600">
                Let's complete your profile to get started
              </p>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl" style={{ color: '#0f172a' }}>Complete Your Profile</CardTitle>
                <CardDescription className="text-base">
                  Tell us a bit about your college journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="highSchool" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                      High School *
                    </Label>
                    <Input
                      id="highSchool"
                      placeholder="Your High School Name"
                      value={formData.highSchool}
                      onChange={(e) => handleChange("highSchool", e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl border-gray-300 focus:border-[#f89880] focus:ring-[#f89880]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear" className="text-sm font-medium" style={{ color: '#0f172a' }}>
                      Expected Graduation Year *
                    </Label>
                    <Select
                      value={formData.graduationYear}
                      onValueChange={(value) => handleChange("graduationYear", value)}
                      disabled={isLoading}
                      required
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
                    style={{ backgroundColor: '#f89880' }}
                  >
                    {isLoading ? "Saving..." : "Continue"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Get Started */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f89880] mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#0f172a' }}>
                You're all set! 🚀
              </h1>
              <p className="text-xl text-slate-600">
                Start tracking your college application journey
              </p>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl" style={{ color: '#0f172a' }}>Quick Start Guide</CardTitle>
                <CardDescription className="text-base">
                  Here are some things you can do to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 rounded-xl justify-center text-center font-medium hover:bg-[#f89880] hover:text-white hover:border-[#f89880] transition-all"
                  >
                    <a href="/gpa">Add Your GPA Records</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 rounded-xl justify-center text-center font-medium hover:bg-[#f89880] hover:text-white hover:border-[#f89880] transition-all"
                  >
                    <a href="/test-scores">Track Test Scores (SAT, ACT, AP)</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 rounded-xl justify-center text-center font-medium hover:bg-[#f89880] hover:text-white hover:border-[#f89880] transition-all"
                  >
                    <a href="/extracurriculars">Log Activities & Leadership</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 rounded-xl justify-center text-center font-medium hover:bg-[#f89880] hover:text-white hover:border-[#f89880] transition-all"
                  >
                    <a href="/essays">Start Working on Essays</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
