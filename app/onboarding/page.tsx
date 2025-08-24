"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { PngLogo } from "@/components/png-logo"

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleComplete = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <PngLogo size="lg" className="mx-auto mb-4 h-20 w-20" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to College Application Tracker!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's set up your profile to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Welcome to your college application journey! This tool will help you track your progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <a href="/gpa">Add GPA Records</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/test-scores">Add Test Scores</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/extracurriculars">Add Activities</a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href="/essays">Start Essays</a>
              </Button>
            </div>
            

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
