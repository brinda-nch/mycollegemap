"use client"

import { useRouter } from "next/navigation"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

interface PlanSelectorModalProps {
  userId: string
  isTrialExpired?: boolean
}

const features = [
  "GPA Tracking & Analytics",
  "Application Tracking & Deadlines",
  "Extra-Curricular & Awards Management",
  "Test Score Tracking",
  "AI Essay Proofreader",
  "Activities & Awards Analyzer",
  "Student Profile Generation with Spike Analysis",
  "Advice from Admissions Officers",
  "Application Narrative Tool",
  "Access Opportunities to Grow",
  "Major Recommendation Tool",
  "College List Builder",
  "Unlimited Updates & Cloud Storage",
  "Email Support"
]

export function PlanSelectorModal({ userId, isTrialExpired = false }: PlanSelectorModalProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10" style={{ color: '#f89880' }} />
            <h1 className="text-5xl md:text-6xl font-bold" style={{ color: '#0f172a' }}>
              MyCollegeMap is Free!
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-4">
            Everything you need to stand out in your college applications
          </p>
          <p className="text-lg font-semibold" style={{ color: '#f89880' }}>
            No subscriptions • No hidden fees • Forever free
          </p>
        </div>

        {/* Single Plan Card */}
        <div className="relative rounded-3xl bg-white border-4 overflow-hidden shadow-2xl"
          style={{ borderColor: '#f89880' }}
        >
          {/* Badge */}
          <div 
            className="py-3 text-center text-white text-base font-bold"
            style={{ backgroundColor: '#f89880' }}
          >
            🎉 100% Free Platform
          </div>

          <div className="p-10">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="text-7xl font-bold mb-4" style={{ color: '#f89880' }}>
                $0
              </div>
              <p className="text-2xl text-slate-600">
                No subscriptions ever
              </p>
            </div>

            {/* Features - Two Columns */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check 
                    className="w-5 h-5 flex-shrink-0 mt-0.5" 
                    style={{ color: '#f89880' }} 
                  />
                  <span className="text-slate-700 text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* Go to Dashboard Button */}
            <Link
              href="/dashboard"
              className="block w-full py-5 px-8 rounded-full font-bold text-xl text-white text-center transition-all hover:shadow-2xl hover:scale-105"
              style={{ backgroundColor: '#f89880' }}
            >
              Go to Dashboard
            </Link>

            {/* Info */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <p className="text-center text-sm text-slate-700">
                <strong>✨ All features included</strong> • No payment needed
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Join thousands of students who got into their dream schools with MyCollegeMap
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            {'★★★★★'}
            <span className="text-slate-600 ml-2">4.9/5 from 2,000+ reviews</span>
          </div>
        </div>
      </div>
    </div>
  )
}

