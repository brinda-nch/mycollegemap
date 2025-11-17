"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Zap } from "lucide-react"
// Trial status is fetched via API route

interface FeatureGateProps {
  userId: string
  featureName: string
  children: React.ReactNode
}

/**
 * Component that restricts features to trial or subscribed users only
 * Shows upgrade prompt if trial has expired and no subscription
 */
export function FeatureGate({ userId, featureName, children }: FeatureGateProps) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userTier, setUserTier] = useState<string>('')

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/trial/status')
        if (!response.ok) {
          // If API fails, deny access (safer)
          setHasAccess(false)
          setIsLoading(false)
          return
        }
        
        const { status } = await response.json()
        
        if (!status) {
          setHasAccess(false)
          setIsLoading(false)
          return
        }

        setUserTier(status.subscriptionTier)
        // Has access if:
        // 1. Currently trialing (and trial hasn't expired), OR
        // 2. Has active standard subscription (status must be 'active' and period hasn't ended)
        const access = status.isTrialing || (status.subscriptionTier === 'standard' && status.status === 'active' && !status.isExpired)
        setHasAccess(access)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking feature access:', error)
        setHasAccess(false)
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-blue-50 border-2 border-orange-200 rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Subscribe to Access {featureName}
          </h3>
          
          <p className="text-slate-700 mb-6">
            Your trial has expired. Subscribe to MyCollegeMap Standard to continue using all features.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push('/pricing')}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg transition-all hover:shadow-lg flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Subscribe Now - $5.99/month
            </button>
            
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-full font-semibold transition-all"
            >
              Go Back
            </button>
          </div>

          {/* Features List */}
          <div className="mt-8 p-6 bg-white/80 rounded-xl text-left">
            <p className="text-base font-bold text-slate-900 mb-4 text-center">
              MyCollegeMap Standard Includes:
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-700">
              <div>✓ AI Essay Proofreader</div>
              <div>✓ Activities Analyzer</div>
              <div>✓ GPA & Test Score Tracking</div>
              <div>✓ Application Management</div>
              <div>✓ Student Profile Generator</div>
              <div>✓ College List Builder</div>
              <div>✓ Unlimited Updates</div>
              <div>✓ Priority Support</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Hook to check if user has access (trial or subscribed)
 * Useful for conditionally showing/hiding UI elements
 */
export function useFeatureAccess(userId: string) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch('/api/trial/status')
        if (!response.ok) {
          setHasAccess(false)
          setIsLoading(false)
          return
        }
        
        const { status } = await response.json()
        
        if (!status) {
          setHasAccess(false)
          setIsLoading(false)
          return
        }

        // Has access if:
        // 1. Currently trialing (and trial hasn't expired), OR
        // 2. Has active standard subscription (status must be 'active' and period hasn't ended)
        const access = status.isTrialing || (status.subscriptionTier === 'standard' && status.status === 'active' && !status.isExpired)
        setHasAccess(access)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking feature access:', error)
        setHasAccess(false)
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [userId])

  return { hasAccess, isLoading }
}

