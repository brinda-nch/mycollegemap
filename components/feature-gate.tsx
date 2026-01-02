"use client"

interface FeatureGateProps {
  userId: string
  featureName: string
  children: React.ReactNode
}

/**
 * Feature gate component - now grants access to all users since platform is free
 */
export function FeatureGate({ userId, featureName, children }: FeatureGateProps) {
  // Platform is now free, always grant access
  return <>{children}</>
}

/**
 * Hook to check if user has access
 * Platform is now free, so always returns true
 */
export function useFeatureAccess(userId: string) {
  // Platform is now free, always grant access
  return { hasAccess: true, isLoading: false }
}

