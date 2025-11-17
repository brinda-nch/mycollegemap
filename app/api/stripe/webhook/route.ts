import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log(`🔔 Webhook received: ${event.type}`)

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.customer) {
          // Update user subscription
          await supabase
            .from("user_subscriptions")
            .update({
              subscription_tier: "standard",
              status: "active",
              has_selected_plan: true,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)

          console.log(`✅ Subscription activated for user: ${userId}`)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          const status = subscription.status === "active" ? "active" : subscription.status
          
          // If subscription is cancelled or past_due, downgrade tier
          const subscriptionTier = (status === "active" || status === "trialing") ? "standard" : "trial"

          await supabase
            .from("user_subscriptions")
            .update({
              status: status,
              subscription_tier: subscriptionTier,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)

          console.log(`✅ Subscription updated for user: ${userId} - status: ${status}, tier: ${subscriptionTier}`)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await supabase
            .from("user_subscriptions")
            .update({
              status: "cancelled",
              subscription_tier: "trial", // Revert to trial tier when cancelled
              has_selected_plan: false,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)

          console.log(`✅ Subscription cancelled for user: ${userId} - access revoked`)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          await supabase
            .from("user_subscriptions")
            .update({
              status: "past_due",
              subscription_tier: "trial", // Downgrade when payment fails
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId)

          console.log(`⚠️ Payment failed for subscription: ${subscriptionId} - access revoked`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

