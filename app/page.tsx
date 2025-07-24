"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Target, BarChart3, Trophy, FileText, Calculator, Users, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
              <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">MyCollegeMap</span>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Complete College Application Tracker</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Organize your GPA, test scores, extracurriculars, essays, and college applications all in one place. Get
            personalized insights and stay on track for your dream schools.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-3">
                Start Tracking Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools to manage every aspect of your college application journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>GPA Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Track weighted and unweighted GPA with detailed course analysis</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Test Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Manage SAT, ACT, and AP scores with improvement tracking</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Extracurriculars</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Document activities, leadership roles, and time commitments</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Honors & Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Showcase achievements and recognition you've earned</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calculator className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>College Estimations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Get admission probability estimates for your target schools</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Essay Grading</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Write, edit, and get feedback on your application essays</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <CardTitle>Grade Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Analyze how future grades will affect your overall GPA</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <CardTitle>Application Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Centralized view of all your college application progress</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Organized?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are successfully managing their college applications
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              <span className="text-lg font-semibold">MyCollegeMap</span>
            </div>
            <p className="text-gray-400">© 2024 MyCollegeMap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
