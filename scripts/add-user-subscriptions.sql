-- ============================================================================
-- Add user_subscriptions table for trial system
-- This migration is SAFE - it won't delete your existing data
-- SIMPLIFIED: Only 'trial' and 'standard' tiers (no free/premium)
-- ============================================================================

-- Create user_subscriptions table for pricing tiers
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_tier VARCHAR(20) DEFAULT 'trial', -- 'trial' or 'standard'
    
    -- Stripe integration fields (for future use)
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Trial tracking (14-day free trial for all new users)
    trial_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    has_selected_plan BOOLEAN DEFAULT FALSE, -- TRUE after trial when user selects a plan
    
    -- Subscription details
    status VARCHAR(20) DEFAULT 'trialing', -- 'trialing', 'active', 'cancelled', 'past_due', 'expired'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one subscription per user
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);

-- Create trial subscriptions for all existing users who don't have one
INSERT INTO user_subscriptions (user_id, subscription_tier, status, trial_start, trial_end, has_selected_plan)
SELECT 
    id,
    'trial',
    'trialing',
    NOW(),
    NOW() + INTERVAL '14 days',
    FALSE
FROM users
WHERE id NOT IN (SELECT user_id FROM user_subscriptions)
ON CONFLICT (user_id) DO NOTHING;

-- Success message
SELECT 'user_subscriptions table created successfully!' AS status;
SELECT COUNT(*) AS total_subscriptions FROM user_subscriptions;

