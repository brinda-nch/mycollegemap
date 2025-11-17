import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

// Lazy initialization to avoid build errors when key is missing
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }
  return new Stripe(key, {
    apiVersion: "2024-11-20.acacia",
  })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Get user's Stripe customer ID from database
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, subscription_tier')
      .eq('user_id', userId)
      .single()

    console.log('🔍 Subscription lookup:', { 
      userId, 
      hasSubscription: !!subscription, 
      hasCustomerId: !!subscription?.stripe_customer_id,
      error: error?.message 
    })

    if (error || !subscription) {
      return NextResponse.json(
        { error: "No subscription found. Please subscribe first." },
        { status: 404 }
      )
    }

    // If no customer ID, try to find it from Stripe using email
    let customerId = subscription.stripe_customer_id
    
    if (!customerId) {
      console.log('⚠️ No customer ID in database, searching Stripe by email...')
      const stripe = getStripe()
      const customers = await stripe.customers.list({
        email: session.user.email,
        limit: 1
      })
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id
        console.log('✅ Found customer in Stripe:', customerId)
        
        // Update database with customer ID
        await supabase
          .from('user_subscriptions')
          .update({ stripe_customer_id: customerId })
          .eq('user_id', userId)
      } else {
        return NextResponse.json(
          { error: "No Stripe customer found. Please contact support or subscribe again." },
          { status: 404 }
        )
      }
    }

    // Get base URL from request or environment
    const origin = request.headers.get('origin') || request.headers.get('referer')?.split('/').slice(0, 3).join('/') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const baseUrl = origin.replace(/\/$/, '') // Remove trailing slash
    const returnUrl = `${baseUrl}/dashboard?subscription=updated`

    console.log('🔗 Creating portal with return URL:', returnUrl)

    // Create Stripe Customer Portal session
    const stripe = getStripe()
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    
    console.log('✅ Portal session created:', {
      url: portalSession.url,
      returnUrl: returnUrl,
      customerId: customerId
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error("Stripe portal error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create portal session" },
      { status: 500 }
    )
  }
}

