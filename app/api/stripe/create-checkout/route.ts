import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

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
    const { priceId } = await request.json()

    // Get base URL from request or environment
    const origin = request.headers.get('origin') || request.headers.get('referer')?.split('/').slice(0, 3).join('/') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const baseUrl = origin.replace(/\/$/, '') // Remove trailing slash
    
    console.log('🔗 Creating checkout with URLs:', {
      origin,
      baseUrl,
      successUrl: `${baseUrl}/dashboard?subscription=success`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`
    })

    // Initialize Stripe
    const stripe = getStripe()

    // Create or retrieve Stripe customer
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: {
        userId: userId,
      },
    })

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    })

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

