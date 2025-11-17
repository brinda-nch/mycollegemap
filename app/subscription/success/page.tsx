"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscriptionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // Give webhook time to process, then redirect to dashboard
    const verifyTimer = setTimeout(() => {
      setIsVerifying(false)
    }, 3000)

    // Auto-redirect after showing success for 2 more seconds (5 seconds total)
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 5000)

    return () => {
      clearTimeout(verifyTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Your Subscription...
          </h1>
          <p className="text-gray-600">
            Please wait while we activate your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          🎉 Welcome to MyCollegeMap!
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          Your subscription is now active. You have full access to all features!
        </p>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-900 font-semibold mb-2">
            ✨ What you get:
          </p>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ AI Essay Proofreader</li>
            <li>✓ Activities & Awards Analyzer</li>
            <li>✓ Complete Application Management</li>
            <li>✓ Unlimited Updates & Support</li>
          </ul>
        </div>

        <Button
          onClick={() => {
            router.push("/dashboard")
            router.refresh()
          }}
          className="w-full py-6 text-lg font-bold"
          style={{ backgroundColor: "#f89880" }}
        >
          Go to Dashboard
        </Button>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting you automatically in a moment...
        </p>
      </div>
    </div>
  )
}

