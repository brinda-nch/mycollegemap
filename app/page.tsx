"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { GraduationCap, BookOpen, Trophy, FileText, Target, Award, Users, Calendar } from "lucide-react"
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
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Logo in top-left corner */}
      <div className="absolute top-8 left-8 z-10">
        <PngLogo size="lg" className="h-16 w-16" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Main heading and description */}
        <div className="text-center mb-16 pt-20">
          <h1 
            className="text-5xl font-bold mb-6 font-geist"
            style={{ color: '#B0E298' }}
          >
            My College Map
          </h1>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: '#3D3B8E' }}
          >
            Streamline your college application process with our comprehensive tracking tool. 
            Manage your GPA, test scores, extracurriculars, essays, and more in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <GraduationCap className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              GPA Tracking
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Monitor your academic performance with detailed GPA tracking and analysis.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <BookOpen className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              Test Scores
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Keep track of all your standardized test scores in one organized location.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <Trophy className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              Activities & Awards
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Document your extracurricular activities, honors, and achievements.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <FileText className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              Essay Management
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Organize and track your college essays with progress monitoring.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <Target className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              College List
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Build and manage your college application list with detailed information.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <Award className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              AI Analysis
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Get AI-powered insights to strengthen your activities and honors.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <Users className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              Progress Tracking
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Visualize your application progress with comprehensive dashboards.
            </p>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <Calendar className="mx-auto h-10 w-10 mb-4" style={{ color: '#E072A4' }} />
            <h3 className="text-lg font-semibold mb-2 font-geist" style={{ color: '#3D3B8E' }}>
              Deadline Management
            </h3>
            <p className="text-sm" style={{ color: '#3D3B8E' }}>
              Never miss important deadlines with our comprehensive calendar system.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div 
            className="rounded-lg p-8 max-w-2xl mx-auto border"
            style={{ 
              borderColor: '#6883BA',
              borderWidth: '1px',
              backgroundColor: 'white'
            }}
          >
            <h2 
              className="text-3xl font-bold mb-4 font-geist"
              style={{ color: '#3D3B8E' }}
            >
              Ready to Start Your College Journey?
            </h2>
            <p 
              className="mb-8"
              style={{ color: '#3D3B8E' }}
            >
              Join thousands of students who are already using our platform to organize their college applications.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center relative z-20">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                style={{ 
                  backgroundColor: '#E072A4',
                  color: 'white',
                  border: '1px solid #E072A4',
                  position: 'relative',
                  zIndex: 30
                }}
                onClick={() => {
                  console.log('Create Account clicked!');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d06594';
                  e.currentTarget.style.borderColor = '#d06594';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E072A4';
                  e.currentTarget.style.borderColor = '#E072A4';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #E072A4';
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
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#E072A4',
                  border: '1px solid #E072A4',
                  position: 'relative',
                  zIndex: 30
                }}
                onClick={() => {
                  console.log('Sign In clicked!');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E072A4';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#E072A4';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #E072A4';
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
