"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Target, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MyCollegeMap</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Your College Journey
            <span className="text-blue-600"> Simplified</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Track your GPA, test scores, extracurriculars, and college applications all in one place. Get personalized
            insights and stay organized throughout your college application process.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-3">
                Start Tracking Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <CardTitle>GPA Tracking</CardTitle>
              <CardDescription>
                Monitor your weighted and unweighted GPA with detailed course breakdowns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-green-600" />
              <CardTitle>Test Scores</CardTitle>
              <CardDescription>Track SAT, ACT, and AP scores with goal setting and progress monitoring</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600" />
              <CardTitle>Activities</CardTitle>
              <CardDescription>Document extracurriculars, volunteer work, and leadership experiences</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="h-8 w-8 text-orange-600" />
              <CardTitle>College Apps</CardTitle>
              <CardDescription>Organize applications, deadlines, and admission requirements</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are successfully managing their college applications
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
