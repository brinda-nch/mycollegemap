"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Sparkles, Crown } from "lucide-react"

interface PlanSelectorModalProps {
  userId: string
  isTrialExpired?: boolean
}

const standardPlan = {
  id: "standard",
  name: "MyCollegeMap Standard",
  price: "$5.99",
  period: "per month",
  yearlyPrice: "$59.99",
  features: [
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
    "Priority Email Support"
  ],
  color: "#f89880"
}

export function PlanSelectorModal({ userId, isTrialExpired = false }: PlanSelectorModalProps) {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(true)
    setError(null)
    setSelectedPlan(planId)

    try {
      // Create Stripe Checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_REPLACE_WITH_YOUR_PRICE_ID"
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create checkout session")
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err: any) {
      console.error("Checkout error:", err)
      setError(err.message || "Failed to start checkout. Please try again.")
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-blue-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {isTrialExpired && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
              <p className="text-red-900 font-semibold text-lg">
                Your 2-week free trial has ended. Subscribe to continue using MyCollegeMap.
              </p>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10" style={{ color: standardPlan.color }} />
            <h1 className="text-5xl md:text-6xl font-bold" style={{ color: '#0f172a' }}>
              {standardPlan.name}
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-4">
            Everything you need to stand out in your college applications
          </p>
          <p className="text-sm text-slate-500">
            ✨ 2-week free trial • Cancel anytime
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-900 text-center">{error}</p>
          </div>
        )}

        {/* Single Plan Card */}
        <div className="relative rounded-3xl bg-white border-4 overflow-hidden shadow-2xl"
          style={{ borderColor: standardPlan.color }}
        >
          {/* Badge */}
          <div 
            className="py-3 text-center text-white text-base font-bold"
            style={{ backgroundColor: standardPlan.color }}
          >
            🎓 Complete College Application Platform
          </div>

          <div className="p-10">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-bold" style={{ color: standardPlan.color }}>
                  {standardPlan.price}
                </span>
                <span className="text-2xl text-slate-600">
                  {standardPlan.period}
                </span>
              </div>
              <p className="text-slate-600">
                or {standardPlan.yearlyPrice}/year <span className="text-green-600 font-semibold">(Save 17%)</span>
              </p>
            </div>

            {/* Features - Two Columns */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {standardPlan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check 
                    className="w-5 h-5 flex-shrink-0 mt-0.5" 
                    style={{ color: standardPlan.color }} 
                  />
                  <span className="text-slate-700 text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* Subscribe Button */}
            <button
              onClick={() => handleSelectPlan(standardPlan.id)}
              disabled={isLoading}
              className="w-full py-5 px-8 rounded-full font-bold text-xl text-white transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{ backgroundColor: standardPlan.color }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-6 h-6" />
                  Subscribe to MyCollegeMap
                </>
              )}
            </button>

            {/* Money Back Guarantee */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <p className="text-center text-sm text-slate-700">
                <strong>💯 100% Satisfaction Guaranteed</strong> • Cancel anytime, no questions asked
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

