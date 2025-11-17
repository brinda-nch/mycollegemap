"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
// Trial status is fetched via API route

interface TrialEnforcerProps {
  userId: string
  children: React.ReactNode
}

/**
 * Component that enforces trial expiration
 * Redirects users to /pricing if trial expired and no plan selected
 */
export function TrialEnforcer({ userId, children }: TrialEnforcerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [canAccess, setCanAccess] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      // Allow access to pricing page always
      if (pathname === '/pricing' || pathname === '/auth/login' || pathname === '/auth/signup') {
        setCanAccess(true)
        setIsChecking(false)
        return
      }

      try {
        const response = await fetch('/api/trial/status')
        if (!response.ok) {
          // If API fails, allow access (don't block user)
          console.warn('Failed to check trial status, allowing access')
          setCanAccess(true)
          setIsChecking(false)
          return
        }
        
        const { status } = await response.json()
        
        if (status?.needsPlanSelection) {
          // Trial expired and no plan selected - redirect to pricing
          router.push('/pricing?expired=true')
          setCanAccess(false)
        } else {
          // User has valid trial or selected plan
          setCanAccess(true)
        }
      } catch (error) {
        console.error('Error checking trial status:', error)
        // On error, allow access (don't block user)
        setCanAccess(true)
      }
      
      setIsChecking(false)
    }

    checkAccess()
  }, [userId, pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!canAccess) {
    return null
  }

  return <>{children}</>
}

