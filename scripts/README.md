# Database Setup Guide

## 🚀 Complete Database Reset & Setup

Use the `00-complete-reset-and-setup.sql` script to reset your database with all the latest features.

### What's Included:

✅ **OAuth Authentication Support**
- Google Sign-In integration
- OAuth provider and ID fields
- Avatar URL storage

✅ **Subscription Tiers & Trial Management**
- 14-day free trial for all new users
- Free, Standard ($2.99/mo), Premium ($5.99/mo) plans
- Automatic trial expiration tracking
- Trial days remaining counter (auto-calculated)
- Plan selection tracking after trial
- Stripe integration fields (ready for payment processing)
- Subscription status tracking

✅ **Core Features**
- User authentication (email/password + OAuth)
- College application tracking
- GPA and course management
- Test score tracking (SAT, ACT, AP)
- Extracurricular activities
- Honors and awards
- Essay management

✅ **Security & Performance**
- Row Level Security (RLS) enabled
- Optimized indexes for fast queries
- Automatic timestamp updates
- Foreign key constraints

✅ **Sample Data**
- 30 top US colleges pre-populated

---

## 📝 How to Use

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `00-complete-reset-and-setup.sql`
6. Paste into the SQL editor
7. Click **Run** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
8. Wait for execution to complete (should take 5-10 seconds)
9. Check the output to confirm all tables were created

### Option 2: Command Line (Supabase CLI)

```bash
# Make sure you're logged in to Supabase
supabase login

# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Run the migration
supabase db reset
psql $DATABASE_URL < scripts/00-complete-reset-and-setup.sql
```

---

## ⚠️ IMPORTANT WARNINGS

### 🔴 This script will DELETE ALL DATA!

- **All existing tables will be dropped**
- **All user accounts will be deleted**
- **All application data will be lost**

### ✅ When to Use This Script

- **Initial setup** of a new project
- **Development environment** reset
- **Testing database** refresh
- **After major schema changes**

### ❌ DO NOT Use This Script

- **On production databases** with real user data
- **Without a backup** of important data
- **Unless you understand you will lose everything**

---

## 🔑 Environment Variables Needed

After running this script, make sure your `.env.local` has:

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Demo Mode (optional)
DEMO_MODE=true
```

---

## 🧪 Testing the Setup

After running the script:

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Test Sign Up**
   - Go to http://localhost:3000/auth/signup
   - Try creating an account with email/password
   - Check Supabase to verify user was created

3. **Test Google Sign-In**
   - Go to http://localhost:3000/auth/login
   - Click "Sign in with Google"
   - Verify OAuth flow works

4. **Check Subscription & Trial**
   - New users should automatically get a 14-day trial
   - Check `trial_days_remaining` to see time left

---

## ⏱️ 14-Day Trial System

### How It Works:

1. **New User Signs Up** → Automatically gets a 14-day trial
2. **Trial Period** → Full access to all features (tracked via `trial_start` and `trial_end`)
3. **Days Remaining** → Auto-calculated field `trial_days_remaining` updates in real-time
4. **Trial Expires** → Status changes to `expired`, user must select a plan
5. **Plan Selected** → `has_selected_plan` set to TRUE, subscription becomes active

### Key Fields:

- `trial_start` - When the trial began (auto-set on signup)
- `trial_end` - When trial expires (14 days after start)
- `trial_days_remaining` - **Calculated in view** - days left (0 when expired)
- `has_selected_plan` - FALSE until user picks Free/Standard/Premium
- `status` - `trialing`, `active`, `expired`, `cancelled`, etc.

**Note**: `trial_days_remaining` is NOT a database column. It's calculated dynamically in the `user_trial_status` view and in the TypeScript utilities.

### Useful SQL Queries:

```sql
-- Check a specific user's trial status
SELECT * FROM user_trial_status WHERE email = 'user@example.com';

-- Find all users whose trial expires in the next 3 days
SELECT u.email, us.trial_days_remaining, us.trial_end
FROM users u
JOIN user_subscriptions us ON u.id = us.user_id
WHERE us.trial_days_remaining <= 3 AND us.trial_days_remaining > 0;

-- Find all users with expired trials who haven't selected a plan
SELECT u.email, us.trial_end
FROM users u
JOIN user_subscriptions us ON u.id = us.user_id
WHERE us.trial_end < NOW() AND us.has_selected_plan = FALSE;

-- Check if a specific user's trial has expired (using helper function)
SELECT is_trial_expired('user-uuid-here');

-- Get days remaining for a user (using helper function)
SELECT get_trial_days_remaining('user-uuid-here');
```

### Frontend Implementation Tips:

```typescript
// Example: Check trial status in your API (use the view)
const { data: trialStatus } = await supabase
  .from('user_trial_status')
  .select('trial_days_remaining, trial_end, has_selected_plan, status, trial_status')
  .eq('user_id', userId)
  .single();

if (trialStatus.trial_status === 'expired_no_plan') {
  // Redirect to plan selection page
  router.push('/pricing?trial_expired=true');
}

// Show trial banner if less than 3 days remaining
if (trialStatus.trial_days_remaining > 0 && trialStatus.trial_days_remaining <= 3) {
  showTrialExpiringBanner(trialStatus.trial_days_remaining);
}

// OR use the utility functions from lib/trial-utils.ts
import { getUserTrialStatus } from '@/lib/trial-utils'

const status = await getUserTrialStatus(userId)
if (status?.needsPlanSelection) {
  router.push('/pricing?trial_expired=true')
}
```

---

## 📊 Database Schema Overview

### Tables Created:

1. **users** - User accounts with OAuth support
2. **user_subscriptions** - Pricing tiers (Free, Standard, Premium)
3. **password_reset_tokens** - Password recovery
4. **colleges** - College database (30 pre-loaded)
5. **user_colleges** - Application tracking
6. **gpa_records** - GPA by semester
7. **courses** - Course grades
8. **test_scores** - SAT, ACT, AP scores
9. **extracurriculars** - Activities tracking
10. **honors_awards** - Awards and achievements
11. **essays** - Essay management

### Key Features:

- **Cascading Deletes**: When a user is deleted, all their data is automatically removed
- **Unique Constraints**: Prevent duplicate entries (email, OAuth accounts, etc.)
- **Auto Timestamps**: created_at and updated_at are automatically managed
- **Indexes**: Fast queries on commonly searched fields
- **Trial Management Functions**: Helper functions to check trial status and days remaining
- **Dynamic Calculations**: `trial_days_remaining` calculated on-the-fly in views
- **Status Views**: `user_trial_status` view for easy trial monitoring
- **Automatic Triggers**: Trial status updates automatically when expired

---

## 🔍 Verifying the Setup

After running the script, you should see output like:

```
Setup Complete! Created 11 tables.

table_name              | column_count
------------------------|-------------
colleges                | 10
courses                 | 10
essays                  | 11
extracurriculars        | 12
gpa_records             | 9
honors_awards           | 9
password_reset_tokens   | 5
test_scores             | 11
user_colleges           | 9
user_subscriptions      | 13
users                   | 12
```

---

## 🆘 Troubleshooting

### Error: "permission denied"
**Solution**: Make sure you're connected to the right database and have admin permissions.

### Error: "relation already exists"
**Solution**: The script has DROP TABLE commands, but if you get this error, manually drop tables first.

### Error: "column does not exist"
**Solution**: Run the complete script again from the beginning.

### OAuth not working
**Solution**: 
1. Check your Google Cloud Console settings
2. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
3. Make sure redirect URI is configured: `http://localhost:3000/api/auth/callback/google`

---

## 📚 Next Steps

After successful setup:

1. ✅ Test authentication (email + Google)
2. ✅ Create a test user account
3. ✅ Add some sample application data
4. ✅ Test the features page (track GPA, activities, etc.)
5. ✅ Test the pricing page
6. ✅ Set up Stripe (optional) for paid subscriptions

---

## 💡 Tips

- **Development**: Use `DEMO_MODE=true` to skip actual authentication for testing
- **Production**: Make sure to backup before any schema changes
- **Migrations**: For production, use incremental migrations instead of full resets
- **Subscriptions**: The free tier is automatically assigned to new users

---

Need help? Check the main README or open an issue!

