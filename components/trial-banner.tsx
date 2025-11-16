"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Clock, X } from "lucide-react"
import { getUserTrialStatus, type TrialStatus, getTrialMessage } from "@/lib/trial-utils"

interface TrialBannerProps {
  userId: string
  onDismiss?: () => void
}

export function TrialBanner({ userId, onDismiss }: TrialBannerProps) {
  const router = useRouter()
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    async function checkTrialStatus() {
      const status = await getUserTrialStatus(userId)
      if (status) {
        setTrialStatus(status)
        
        // Show banner if:
        // 1. Trial is expiring soon (3 days or less)
        // 2. Trial has expired and no plan selected
        const shouldShow = (
          (status.isTrialing && status.daysRemaining <= 3) ||
          status.needsPlanSelection
        )
        setIsVisible(shouldShow && !isDismissed)
      }
    }

    checkTrialStatus()
    
    // Check every hour for trial status changes
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [userId, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    onDismiss?.()
  }

  const handleSelectPlan = () => {
    router.push('/pricing')
  }

  if (!isVisible || !trialStatus) {
    return null
  }

  // Determine banner style based on urgency
  const getUrgencyStyle = () => {
    if (trialStatus.needsPlanSelection) {
      return {
        bg: "bg-red-50 border-red-200",
        text: "text-red-900",
        icon: "text-red-600",
        button: "bg-red-600 hover:bg-red-700 text-white"
      }
    }
    if (trialStatus.daysRemaining === 0) {
      return {
        bg: "bg-orange-50 border-orange-200",
        text: "text-orange-900",
        icon: "text-orange-600",
        button: "bg-orange-600 hover:bg-orange-700 text-white"
      }
    }
    return {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-900",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  }

  const style = getUrgencyStyle()
  const message = getTrialMessage(trialStatus)

  return (
    <div className={`${style.bg} border-b-2 ${style.text} px-6 py-4`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {trialStatus.needsPlanSelection ? (
            <AlertCircle className={`w-5 h-5 ${style.icon} flex-shrink-0`} />
          ) : (
            <Clock className={`w-5 h-5 ${style.icon} flex-shrink-0`} />
          )}
          
          <div className="flex-1">
            <p className="font-medium">{message}</p>
            {trialStatus.isTrialing && trialStatus.daysRemaining > 0 && (
              <p className="text-sm opacity-80 mt-1">
                Continue enjoying full access by choosing a plan today.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectPlan}
            className={`${style.button} px-6 py-2 rounded-lg font-medium transition-all hover:shadow-lg whitespace-nowrap`}
          >
            {trialStatus.needsPlanSelection ? "Select a Plan" : "View Plans"}
          </button>
          
          {!trialStatus.needsPlanSelection && (
            <button
              onClick={handleDismiss}
              className={`${style.text} opacity-60 hover:opacity-100 transition-opacity`}
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Simple trial countdown component for sidebar or dashboard
 */
export function TrialCountdown({ userId }: { userId: string }) {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchStatus() {
      const status = await getUserTrialStatus(userId)
      setTrialStatus(status)
    }
    fetchStatus()
  }, [userId])

  if (!trialStatus || !trialStatus.isTrialing) {
    return null
  }

  const getColorClass = () => {
    if (trialStatus.daysRemaining <= 1) return "text-red-600 bg-red-50"
    if (trialStatus.daysRemaining <= 3) return "text-orange-600 bg-orange-50"
    return "text-blue-600 bg-blue-50"
  }

  return (
    <div className={`${getColorClass()} px-4 py-3 rounded-lg`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''} left
          </span>
        </div>
        <button
          onClick={() => router.push('/pricing')}
          className="text-xs underline hover:no-underline"
        >
          Upgrade
        </button>
      </div>
    </div>
  )
}

