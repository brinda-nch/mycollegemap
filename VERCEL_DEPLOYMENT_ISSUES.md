# Vercel Deployment Issues Checklist

This document outlines potential issues you might encounter when deploying to Vercel that are specific to local development configurations.

## 🔴 Critical Issues (Will Break Production)

### 1. **Missing Environment Variables**
**Issue:** Many environment variables are required but may not be set in Vercel.

**Required Variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app  # ⚠️ Must be production URL
NEXTAUTH_SECRET=your-secret-here

# Stripe
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Fix:** Add all variables in Vercel Dashboard → Settings → Environment Variables

---

### 2. **Google OAuth Redirect URLs**
**Issue:** Google OAuth is configured for `http://localhost:3000` only.

**Current Setup:**
- Local: `http://localhost:3000/api/auth/callback/google`

**Required Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. If using preview deployments, also add:
   ```
   https://*.vercel.app/api/auth/callback/google
   ```

**Impact:** Google sign-in will fail with "redirect_uri_mismatch" error.

---

### 3. **Stripe Webhook URL**
**Issue:** Stripe webhooks need to point to your production URL.

**Current Setup:**
- Webhook endpoint: `/api/stripe/webhook`

**Required Fix:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel

**Impact:** Subscription updates won't sync to your database.

---

### 4. **NEXTAUTH_URL Configuration**
**Issue:** `NEXTAUTH_URL` must be set to production URL, not localhost.

**Current Code:**
```typescript
// lib/auth.ts
url: process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'production' 
  ? process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : undefined
  : 'http://localhost:3000'),
```

**Fix:** Set `NEXTAUTH_URL=https://your-app.vercel.app` in Vercel environment variables.

**Impact:** Authentication callbacks will fail, sessions won't work.

---

## 🟡 Medium Priority Issues (May Cause Problems)

### 5. **Base URL Fallbacks**
**Issue:** Some API routes fall back to `localhost:3000` if origin detection fails.

**Affected Files:**
- `app/api/stripe/create-checkout/route.ts` (line 32)
- `app/api/stripe/create-portal/route.ts` (line 81)

**Current Code:**
```typescript
const origin = request.headers.get('origin') || 
              request.headers.get('referer')?.split('/').slice(0, 3).join('/') || 
              process.env.NEXTAUTH_URL || 
              'http://localhost:3000'  // ⚠️ Fallback
```

**Fix:** Ensure `NEXTAUTH_URL` is always set in Vercel.

**Impact:** Stripe redirects might go to wrong URL.

---

### 6. **Supabase Row Level Security (RLS)**
**Issue:** If RLS is enabled, API routes might fail without proper service role key.

**Current Setup:**
- Code uses `SUPABASE_SERVICE_ROLE_KEY` if available
- Falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Fix:** 
1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
2. Or disable RLS on tables (not recommended for production)

**Impact:** Database queries might fail with permission errors.

---

### 7. **Build-Time vs Runtime Environment Variables**
**Issue:** Some variables are needed at build time, others at runtime.

**Build-Time Variables (NEXT_PUBLIC_*):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID`

**Runtime Variables:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`

**Fix:** In Vercel, set all variables for "Production", "Preview", and "Development" environments.

---

### 8. **API Route Timeouts**
**Issue:** Some API routes might timeout on Vercel's free tier.

**Current Configuration:**
- `vercel.json` sets maxDuration to 30s for NextAuth routes only

**Potential Timeout Issues:**
- `/api/analyze-activities` - OpenAI API calls (can take 10-30s)
- `/api/proofread-essay` - OpenAI API calls (can take 10-30s)
- `/api/stripe/webhook` - Database operations

**Fix:** Add timeout configuration in `vercel.json`:
```json
{
  "functions": {
    "app/api/analyze-activities/route.ts": {
      "maxDuration": 60
    },
    "app/api/proofread-essay/route.ts": {
      "maxDuration": 60
    },
    "app/api/stripe/webhook/route.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 🟢 Low Priority Issues (Nice to Fix)

### 9. **Demo Mode Detection**
**Issue:** App might fall back to demo mode if Supabase credentials are missing.

**Current Code:**
```typescript
// lib/supabase.ts
const isDemo = supabaseUrl === "https://demo.supabase.co" || 
               supabaseKey === "demo_key" || 
               !supabaseUrl || 
               !supabaseKey
```

**Impact:** App will work but with demo data, not real database.

**Fix:** Ensure Supabase credentials are set in Vercel.

---

### 10. **CORS Issues**
**Issue:** If frontend and backend are on different domains, CORS might block requests.

**Current Setup:**
- All on same domain (should be fine)

**Potential Issue:**
- If using custom domain, ensure CORS headers are set correctly

---

### 11. **Static File Paths**
**Issue:** Image paths might break if using relative paths incorrectly.

**Current Setup:**
- Images in `/public` folder should work fine
- Check any hardcoded `/images/` paths

---

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All environment variables are set in Vercel Dashboard
- [ ] `NEXTAUTH_URL` is set to production URL
- [ ] Google OAuth redirect URIs include production URL
- [ ] Stripe webhook endpoint is configured with production URL
- [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- [ ] Supabase RLS is configured correctly (or disabled)
- [ ] API route timeouts are configured in `vercel.json`
- [ ] Test authentication flow (email/password and Google)
- [ ] Test Stripe checkout flow
- [ ] Test webhook delivery (use Stripe CLI or dashboard)
- [ ] Verify database connections work
- [ ] Check OpenAI API calls work (if using AI features)

---

## 🔧 Quick Fixes

### Fix 1: Update vercel.json for Timeouts
```json
{
  "functions": {
    "app/api/auth/[...nextauth]/route.ts": {
      "maxDuration": 30
    },
    "app/api/analyze-activities/route.ts": {
      "maxDuration": 60
    },
    "app/api/proofread-essay/route.ts": {
      "maxDuration": 60
    },
    "app/api/stripe/webhook/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Fix 2: Ensure NEXTAUTH_URL is Always Set
The code already has fallback logic, but explicitly set it in Vercel:
```
NEXTAUTH_URL=https://your-app.vercel.app
```

### Fix 3: Test Webhook Locally First
Use Stripe CLI to test webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🐛 Common Error Messages

### "redirect_uri_mismatch"
- **Cause:** Google OAuth redirect URI not configured
- **Fix:** Add production URL to Google Cloud Console

### "STRIPE_SECRET_KEY is not configured"
- **Cause:** Missing Stripe key in Vercel
- **Fix:** Add `STRIPE_SECRET_KEY` to environment variables

### "Invalid signature" (Stripe webhook)
- **Cause:** Wrong webhook secret or webhook URL mismatch
- **Fix:** Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

### "Unauthorized" (NextAuth)
- **Cause:** `NEXTAUTH_URL` not set correctly
- **Fix:** Set `NEXTAUTH_URL` to production URL

### Database permission errors
- **Cause:** RLS blocking or missing service role key
- **Fix:** Set `SUPABASE_SERVICE_ROLE_KEY` or adjust RLS policies

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/options#nextauth_url)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

