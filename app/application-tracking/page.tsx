"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ApplicationTrackingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the college estimations page (which has the application tracking functionality)
    router.push("/college-estimations")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Application Tracking...</p>
    </div>
  )
}

