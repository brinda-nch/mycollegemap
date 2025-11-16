/**
 * Trial Management Utilities
 * Helper functions for checking and managing 14-day trial periods
 */

import { supabase } from "./supabase"

export interface TrialStatus {
  isTrialing: boolean
  isExpired: boolean
  daysRemaining: number
  trialEnd: Date | null
  hasSelectedPlan: boolean
  subscriptionTier: 'trial' | 'free' | 'standard' | 'premium'
  status: string
  needsPlanSelection: boolean
}

/**
 * Get comprehensive trial status for a user
 */
export async function getUserTrialStatus(userId: string): Promise<TrialStatus | null> {
  try {
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !subscription) {
      console.error('Error fetching subscription:', error)
      return null
    }

    const now = new Date()
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null
    const isExpired = trialEnd ? now > trialEnd : false
    const isTrialing = subscription.status === 'trialing' && !isExpired
    
    // Calculate days remaining manually since it's not a stored column
    let daysRemaining = 0
    if (trialEnd && !isExpired) {
      const timeDiff = trialEnd.getTime() - now.getTime()
      daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))
    }

    return {
      isTrialing,
      isExpired,
      daysRemaining,
      trialEnd,
      hasSelectedPlan: subscription.has_selected_plan || false,
      subscriptionTier: subscription.subscription_tier,
      status: subscription.status,
      needsPlanSelection: isExpired && !subscription.has_selected_plan
    }
  } catch (error) {
    console.error('Error getting trial status:', error)
    return null
  }
}

/**
 * Check if trial is expiring soon (3 days or less)
 */
export async function isTrialExpiringSoon(userId: string): Promise<boolean> {
  const status = await getUserTrialStatus(userId)
  if (!status) return false
  
  return status.isTrialing && status.daysRemaining <= 3 && status.daysRemaining > 0
}

/**
 * Check if user needs to select a plan (trial expired, no plan chosen)
 */
export async function needsPlanSelection(userId: string): Promise<boolean> {
  const status = await getUserTrialStatus(userId)
  if (!status) return false
  
  return status.needsPlanSelection
}

/**
 * Update user subscription after plan selection
 */
export async function selectSubscriptionPlan(
  userId: string, 
  tier: 'free' | 'standard' | 'premium'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: tier,
        has_selected_plan: true,
        status: 'active',
        current_period_start: new Date().toISOString(),
        // For paid plans, set period end to 1 month from now
        current_period_end: tier !== 'free' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating subscription:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error selecting plan:', error)
    return false
  }
}

/**
 * Create initial trial subscription for new users
 * Call this after user signup
 */
export async function createTrialSubscription(userId: string): Promise<boolean> {
  try {
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14) // 14 days from now

    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        subscription_tier: 'trial',
        status: 'trialing',
        trial_start: new Date().toISOString(),
        trial_end: trialEnd.toISOString(),
        has_selected_plan: false
      })

    if (error) {
      console.error('Error creating trial subscription:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating trial:', error)
    return false
  }
}

/**
 * Get formatted trial message for UI display
 */
export function getTrialMessage(status: TrialStatus): string {
  if (status.needsPlanSelection) {
    return "Your free trial has expired. Please select a plan to continue using MyCollegeMap."
  }
  
  if (status.isTrialing) {
    if (status.daysRemaining === 0) {
      return "Your trial expires today! Select a plan to continue."
    }
    if (status.daysRemaining === 1) {
      return "Your trial expires tomorrow. Select a plan to continue."
    }
    if (status.daysRemaining <= 3) {
      return `${status.daysRemaining} days left in your free trial.`
    }
    return `${status.daysRemaining} days remaining in your free trial.`
  }
  
  if (status.hasSelectedPlan) {
    const tierDisplay = {
      free: 'Free',
      standard: 'Standard',
      premium: 'Premium',
      trial: 'Trial'
    }
    return `You're on the ${tierDisplay[status.subscriptionTier]} plan.`
  }
  
  return ""
}

/**
 * Check if user has access to a feature based on subscription tier
 */
export function hasFeatureAccess(
  subscriptionTier: string, 
  feature: 'basic' | 'standard' | 'premium'
): boolean {
  const tierHierarchy = {
    trial: ['basic', 'standard', 'premium'], // Full access during trial
    free: ['basic'],
    standard: ['basic', 'standard'],
    premium: ['basic', 'standard', 'premium']
  }
  
  const tierKey = subscriptionTier as keyof typeof tierHierarchy
  return tierHierarchy[tierKey]?.includes(feature) || false
}

