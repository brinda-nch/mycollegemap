"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HonorsAwardsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/extracurriculars")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting to Extracurriculars page...</p>
    </div>
  )
}
