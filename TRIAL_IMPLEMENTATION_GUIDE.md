# 14-Day Trial System - Implementation Guide

## 🎯 Overview

MyCollegeMap now has a complete 14-day trial system that:
- Automatically starts when users sign up (email or Google)
- Tracks days remaining in real-time
- Automatically expires after 14 days
- Prompts users to select a plan (Free, Standard, or Premium)

---

## ✅ What's Already Done

### 1. Database Schema ✓
- `user_subscriptions` table with trial tracking fields
- `trial_days_remaining` **dynamically calculated in views** (not stored)
- Helper functions: `is_trial_expired()`, `get_trial_days_remaining()`
- View: `user_trial_status` for easy monitoring with calculated fields
- Automatic trigger to update status when trial expires

### 2. Backend Integration ✓
- **Signup API** (`app/api/auth/signup/route.ts`): Creates trial on user creation
- **OAuth Flow** (`lib/auth.ts`): Creates trial for Google sign-in users
- **Trial Utilities** (`lib/trial-utils.ts`): Helper functions for checking status

### 3. Frontend Components ✓
- **TrialBanner**: Full-width banner that shows at top of pages
- **TrialCountdown**: Compact widget for sidebar/dashboard

---

## 🚀 Quick Start Implementation

### Step 1: Run the Database Migration

In Supabase SQL Editor, run:
```sql
-- See scripts/00-complete-reset-and-setup.sql
```

This creates all tables with trial support.

### Step 2: Add Trial Banner to Your Layout

Update `app/dashboard/layout.tsx`:

```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { TrialBanner } from "@/components/trial-banner"

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)
  
  return (
    <div>
      {session?.user?.id && <TrialBanner userId={session.user.id} />}
      {children}
    </div>
  )
}
```

### Step 3: Add Trial Countdown to Dashboard

Update `app/dashboard/page.tsx`:

```tsx
import { TrialCountdown } from "@/components/trial-banner"

export default function Dashboard() {
  const session = await getServerSession(authOptions)
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Sidebar or top section */}
      {session?.user?.id && (
        <TrialCountdown userId={session.user.id} />
      )}
      
      {/* Rest of dashboard */}
    </div>
  )
}
```

### Step 4: Protect Premium Features

```tsx
import { getUserTrialStatus, hasFeatureAccess } from "@/lib/trial-utils"

async function MyPremiumComponent({ userId }: { userId: string }) {
  const trialStatus = await getUserTrialStatus(userId)
  
  if (!trialStatus) {
    return <div>Loading...</div>
  }
  
  // Check if user has access
  const hasAccess = hasFeatureAccess(trialStatus.subscriptionTier, 'premium')
  
  if (!hasAccess) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
        <p className="text-gray-600 mb-4">
          Upgrade to Premium to unlock this feature
        </p>
        <a href="/pricing" className="btn-primary">
          View Plans
        </a>
      </div>
    )
  }
  
  return (
    <div>
      {/* Premium feature content */}
    </div>
  )
}
```

---

## 📋 Feature Access Levels

### During 14-Day Trial (Full Access)
✅ All basic features
✅ All standard features  
✅ All premium features

### Free Plan ($0)
✅ GPA Tracking
✅ Application Tracking
✅ Extra-Curricular & Awards Tracking
✅ Test Score Tracking

### Standard Plan ($2.99/mo)
✅ Everything in Free
✅ Student Profile Generation (with spike analysis)
✅ Essay Proofreader
✅ Activities and Awards Analyzer
✅ Student Profile Examples

### Premium Plan ($5.99/mo)
✅ Everything in Standard
✅ Advice from Admissions Officers
✅ Application Narrative Tool
✅ Access Opportunities to Grow
✅ Find which major is best for you

---

## 🔄 User Flow

### New User Journey

1. **Day 0**: User signs up → Trial starts automatically
   - `subscription_tier`: `'trial'`
   - `status`: `'trialing'`
   - `trial_days_remaining`: `14`
   - Full access to all features

2. **Days 1-11**: User enjoys full access
   - No banners or prompts
   - Can explore all premium features

3. **Days 12-14**: Trial expiring soon
   - Banner appears: "3 days left in your free trial"
   - Gentle reminder to select a plan
   - Still has full access

4. **Day 14** (Trial Expires):
   - Banner becomes urgent: "Your trial expires today!"
   - User should select a plan

5. **After Day 14**:
   - Status automatically changes to `'expired'`
   - `trial_days_remaining`: `0`
   - Banner shows: "Your trial has expired. Select a plan to continue."
   - Access restricted based on selected plan

### Selecting a Plan

When user clicks "Select a Plan":
1. Redirect to `/pricing` page
2. User chooses Free, Standard, or Premium
3. Call `selectSubscriptionPlan(userId, tier)`
4. `has_selected_plan` → `TRUE`
5. `status` → `'active'`
6. Access granted based on chosen tier

---

## 🛠️ Useful Code Snippets

### Check Trial Status in API Route

```typescript
import { getUserTrialStatus } from "@/lib/trial-utils"

export async function GET(request: Request) {
  const userId = request.headers.get('user-id')
  
  const trialStatus = await getUserTrialStatus(userId)
  
  if (trialStatus?.needsPlanSelection) {
    return Response.json(
      { error: "Trial expired. Please select a plan." },
      { status: 403 }
    )
  }
  
  // Continue with normal logic
}
```

### Client-Side Trial Check (React)

```tsx
'use client'

import { useEffect, useState } from 'react'
import { getUserTrialStatus, type TrialStatus } from '@/lib/trial-utils'

export function TrialAwareComponent({ userId }: { userId: string }) {
  const [trial, setTrial] = useState<TrialStatus | null>(null)
  
  useEffect(() => {
    getUserTrialStatus(userId).then(setTrial)
  }, [userId])
  
  if (!trial) return <div>Loading...</div>
  
  return (
    <div>
      {trial.isTrialing && (
        <div>Trial: {trial.daysRemaining} days left</div>
      )}
      
      {trial.needsPlanSelection && (
        <div>Please select a plan to continue</div>
      )}
    </div>
  )
}
```

### SQL Query: Find Users Needing Reminders

```sql
-- Users with 3 days or less remaining (use the view)
SELECT 
  email,
  first_name,
  trial_days_remaining,
  trial_end,
  trial_status
FROM user_trial_status
WHERE trial_days_remaining <= 3 
  AND trial_days_remaining > 0
  AND status = 'trialing'
ORDER BY trial_days_remaining ASC;
```

```sql
-- Users with expired trials who haven't selected a plan (use the view)
SELECT 
  email,
  first_name,
  trial_end,
  trial_status,
  DATE_PART('day', NOW() - trial_end) as days_since_expired
FROM user_trial_status
WHERE trial_status = 'expired_no_plan'
ORDER BY trial_end DESC;
```

---

## 🎨 Customization

### Change Trial Duration

Currently set to 14 days. To change:

1. **Database default** (in `00-complete-reset-and-setup.sql`):
```sql
trial_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '21 days'), -- Change to 21 days
```

2. **Signup API** (`app/api/auth/signup/route.ts`):
```typescript
const trialEnd = new Date()
trialEnd.setDate(trialEnd.getDate() + 21) // Change to 21 days
```

3. **OAuth Flow** (`lib/auth.ts`):
```typescript
const trialEnd = new Date()
trialEnd.setDate(trialEnd.getDate() + 21) // Change to 21 days
```

### Customize Banner Messages

Edit `lib/trial-utils.ts` → `getTrialMessage()`:

```typescript
export function getTrialMessage(status: TrialStatus): string {
  if (status.needsPlanSelection) {
    return "Your custom message here"
  }
  // ...
}
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **Trial Conversion Rate**:
```sql
SELECT 
  COUNT(CASE WHEN has_selected_plan = TRUE THEN 1 END)::FLOAT / COUNT(*) * 100 as conversion_rate
FROM user_subscriptions
WHERE subscription_tier = 'trial' OR has_selected_plan = TRUE;
```

2. **Average Days to Conversion**:
```sql
SELECT 
  AVG(DATE_PART('day', updated_at - created_at)) as avg_days_to_convert
FROM user_subscriptions
WHERE has_selected_plan = TRUE;
```

3. **Plan Distribution**:
```sql
SELECT 
  subscription_tier,
  COUNT(*) as count,
  COUNT(*)::FLOAT / SUM(COUNT(*)) OVER () * 100 as percentage
FROM user_subscriptions
WHERE has_selected_plan = TRUE
GROUP BY subscription_tier;
```

---

## 🐛 Troubleshooting

### Trial not starting for new users

**Check:**
1. Database has `user_subscriptions` table
2. Signup API is creating trial subscription
3. No errors in console logs

**Fix:** Re-run database migration

### Trial days remaining shows incorrect value

**Cause:** Calculation issue in view or TypeScript

**Fix:** Query the `user_trial_status` view directly:
```sql
SELECT trial_days_remaining, trial_end, trial_status
FROM user_trial_status
WHERE user_id = 'user-id-here';
```

Or calculate manually:
```sql
SELECT 
  trial_end,
  GREATEST(0, EXTRACT(DAY FROM (trial_end - NOW()))::INTEGER) as days_left
FROM user_subscriptions
WHERE user_id = 'user-id-here';
```

### OAuth users not getting trials

**Check:** `lib/auth.ts` has trial creation code in `signIn` callback

**Fix:** Make sure the Google OAuth callback creates the subscription

---

## 🎉 That's It!

Your trial system is now fully set up and ready to use. Users will automatically:
- Get 14 days of full access
- See countdown when trial is ending
- Be prompted to select a plan when trial expires

For questions or issues, check the database schema in `scripts/00-complete-reset-and-setup.sql`

