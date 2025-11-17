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
  subscriptionTier: 'trial' | 'standard'
  status: string
  needsPlanSelection: boolean
}

/**
 * Get comprehensive trial status for a user
 */
export async function getUserTrialStatus(userId: string): Promise<TrialStatus | null> {
  try {
    let { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    // If no subscription exists (error or null), try to create one automatically
    if (error || !subscription) {
      // Try to create trial subscription - this handles "no rows" errors gracefully
      console.log('No subscription found for user, attempting to create trial...', { 
        userId,
        hasError: !!error,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : []
      })
      
      const created = await createTrialSubscription(userId)
      if (created) {
        // Fetch the newly created subscription
        const { data: newSubscription, error: fetchError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single()
        
        if (fetchError || !newSubscription) {
          // If fetch also fails, it might be RLS - return a default trial status
          console.warn('Could not fetch subscription after creation - may be RLS issue', { userId })
          // Return a default trial status so app doesn't break
          return {
            isTrialing: true,
            isExpired: false,
            daysRemaining: 14,
            trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            hasSelectedPlan: false,
            subscriptionTier: 'trial' as const,
            status: 'trialing',
            needsPlanSelection: false
          }
        }
        subscription = newSubscription
        console.log('✅ Trial subscription created successfully')
      } else {
        // Creation failed - return default trial status to prevent app breakage
        console.warn('Could not create trial subscription - returning default trial status', { userId })
        return {
          isTrialing: true,
          isExpired: false,
          daysRemaining: 14,
          trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          hasSelectedPlan: false,
          subscriptionTier: 'trial' as const,
          status: 'trialing',
          needsPlanSelection: false
        }
      }
    }

    const now = new Date()
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end) : null
    const isExpired = trialEnd ? now > trialEnd : false
    const isTrialing = subscription.status === 'trialing' && !isExpired
    
    // Check if subscription period has ended (for paid subscriptions)
    const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null
    const isPeriodExpired = periodEnd ? now > periodEnd : false
    
    // Subscription is only active if:
    // 1. Status is 'active' (not cancelled, past_due, etc.)
    // 2. Current period hasn't ended (if period_end exists)
    // 3. Subscription tier is 'standard'
    const isSubscriptionActive = subscription.status === 'active' && 
                                 subscription.subscription_tier === 'standard' &&
                                 !isPeriodExpired
    
    // Calculate days remaining manually since it's not a stored column
    let daysRemaining = 0
    if (trialEnd && !isExpired) {
      const timeDiff = trialEnd.getTime() - now.getTime()
      daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)))
    }

    return {
      isTrialing,
      isExpired: isExpired || (isPeriodExpired && subscription.subscription_tier === 'standard'),
      daysRemaining,
      trialEnd,
      hasSelectedPlan: subscription.has_selected_plan || false,
      subscriptionTier: isSubscriptionActive ? 'standard' : (subscription.subscription_tier === 'standard' && !isSubscriptionActive ? 'trial' : subscription.subscription_tier),
      status: subscription.status,
      needsPlanSelection: (isExpired && !subscription.has_selected_plan) || (isPeriodExpired && subscription.status !== 'active')
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
 * Update user subscription after plan selection (Standard plan only)
 */
export async function selectSubscriptionPlan(
  userId: string, 
  tier: 'standard'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: 'standard',
        has_selected_plan: true,
        status: 'active',
        current_period_start: new Date().toISOString(),
        // Set period end to 1 month from now
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
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
    // First, check if subscription already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    if (existing) {
      console.log('Subscription already exists, skipping creation', { userId })
      return true
    }
    
    // If check failed but not because of "no rows", log it
    if (checkError && checkError.code !== 'PGRST116' && !checkError.message?.includes('No rows')) {
      console.warn('Error checking for existing subscription:', checkError)
    }
    
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14) // 14 days from now

    // Use insert (not upsert) since we know it doesn't exist
    const insertResult = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        subscription_tier: 'trial',
        status: 'trialing',
        trial_start: new Date().toISOString(),
        trial_end: trialEnd.toISOString(),
        has_selected_plan: false
      })
      .select()

    const { data: insertData, error } = insertResult

    console.log('Insert result:', { 
      hasData: !!insertData, 
      hasError: !!error, 
      errorType: typeof error,
      errorString: error ? JSON.stringify(error) : 'null',
      errorConstructor: error?.constructor?.name,
      fullResult: JSON.stringify(insertResult, null, 2),
      userId 
    })

    if (error) {
      // Log full error details for debugging
      console.error('Error creating trial subscription:', {
        error,
        errorString: JSON.stringify(error),
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint,
        errorKeys: Object.keys(error || {}),
        userId
      })
      
      // Check if it's a duplicate key error (which is actually fine - subscription exists)
      if (error.code === '23505' || 
          error.code === 'PGRST116' ||
          error.message?.includes('duplicate') || 
          error.message?.includes('unique') ||
          error.message?.includes('already exists')) {
        console.log('Subscription already exists for user, skipping creation', { userId })
        return true // Return true since subscription exists
      }
      
      // If error is empty object, it might be RLS blocking - try to fetch existing subscription
      if (typeof error === 'object' && Object.keys(error).length === 0) {
        console.warn('Empty error object - checking if subscription exists...', { userId })
        const { data: existing } = await supabase
          .from('user_subscriptions')
          .select('id')
          .eq('user_id', userId)
          .single()
        
        if (existing) {
          console.log('Subscription exists, returning true', { userId })
          return true
        }
      }
      
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
    return "Your 2-week free trial has expired. Subscribe to continue using MyCollegeMap."
  }
  
  if (status.isTrialing) {
    if (status.daysRemaining === 0) {
      return "Your trial expires today! Subscribe to continue."
    }
    if (status.daysRemaining === 1) {
      return "Your trial expires tomorrow. Subscribe to continue."
    }
    if (status.daysRemaining <= 3) {
      return `${status.daysRemaining} days left in your free trial.`
    }
    return `${status.daysRemaining} days remaining in your 2-week free trial.`
  }
  
  if (status.hasSelectedPlan) {
    return "You're subscribed to MyCollegeMap Standard."
  }
  
  return ""
}

/**
 * Check if user has access (simplified - trial or standard = full access)
 */
export function hasFeatureAccess(
  subscriptionTier: string, 
  feature: 'basic' | 'standard' | 'premium'
): boolean {
  // Trial and Standard both have full access to everything
  return subscriptionTier === 'trial' || subscriptionTier === 'standard'
}

