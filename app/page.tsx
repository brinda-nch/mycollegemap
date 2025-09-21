"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { GraduationCap, BookOpen, Trophy, FileText, Target, Award, Users, Calendar, Briefcase } from "lucide-react"
import { PngLogo } from "@/components/png-logo"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if explicitly authenticated
    if (status === "authenticated" && session) {
      router.push("/dashboard")
    }
  }, [status, session, router])

  // Show loading state only briefly, then show content anyway
  if (status === "loading") {
    // Continue to show content even if loading
  }

  if (status === "authenticated") {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen">
      {/* Logo in top-left corner */}
      <div className="absolute top-8 left-8 z-10">
        <PngLogo size="lg" className="h-16 w-16" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Main heading and description */}
        <div className="text-center mb-16 pt-20">
          <h1 className="text-5xl font-bold mb-6 font-geist text-navy-800">
            My College Map
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-navy-600">
            Streamline your college and summer program application process with our comprehensive tracking tool. 
            Manage your GPA, test scores, extracurriculars, essays, internships, and educational programs all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <GraduationCap className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              GPA Tracking
            </h3>
            <p className="text-sm text-navy-600">
              Monitor your academic performance with detailed GPA tracking and analysis.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <BookOpen className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              Test Scores
            </h3>
            <p className="text-sm text-navy-600">
              Keep track of all your standardized test scores in one organized location.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <Trophy className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              Activities & Awards
            </h3>
            <p className="text-sm text-navy-600">
              Document your extracurricular activities, honors, and achievements.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <FileText className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              Essay Management
            </h3>
            <p className="text-sm text-navy-600">
              Organize and track your college essays with progress monitoring.
            </p>
          </div>

        <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
          <Target className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
          <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
            College List
          </h3>
          <p className="text-sm text-navy-600">
            Build and manage your college application list with detailed information.
          </p>
        </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <Award className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              AI Analysis
            </h3>
            <p className="text-sm text-navy-600">
              Get AI-powered insights to strengthen your activities and honors.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <Users className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              Progress Tracking
            </h3>
            <p className="text-sm text-navy-600">
              Visualize your application progress with comprehensive dashboards.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <Calendar className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              Deadline Management
            </h3>
            <p className="text-sm text-navy-600">
              Never miss important deadlines with our comprehensive calendar system.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm">
            <Briefcase className="mx-auto h-10 w-10 mb-4" style={{ color: '#f89880' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist text-navy-800">
              Summer Programs & Internships
            </h3>
            <p className="text-sm text-navy-600">
              Track applications for summer programs, internships, and educational opportunities.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="rounded-lg p-8 max-w-2xl mx-auto border border-gray-200 bg-white/90 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 font-geist text-navy-800">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="mb-8 text-navy-600">
              Join thousands of students who are already using My College Map to organize their college applications, summer programs, internships, and track their academic progress.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-colors text-white border focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: '#f89880',
                  borderColor: '#f89880'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5856b';
                  e.currentTarget.style.borderColor = '#f5856b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f89880';
                  e.currentTarget.style.borderColor = '#f89880';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #f89880';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#f89880',
                  borderColor: '#f89880'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f89880';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#f89880';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #f89880';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
