"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TestScoresRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/gpa")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Academics page...</p>
    </div>
  )
}
