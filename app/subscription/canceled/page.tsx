"use client"

import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscriptionCanceledPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Subscription Canceled
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          You canceled the subscription process. No charges were made.
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900">
            💡 <strong>Still interested?</strong> You can subscribe anytime to unlock all MyCollegeMap features and stand out in your college applications.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/pricing")}
            className="w-full py-6 text-lg font-bold"
            style={{ backgroundColor: "#f89880" }}
          >
            View Plans Again
          </Button>
          
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="w-full py-6 text-lg font-semibold border-2"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

