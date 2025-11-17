# Why It Works Locally But Not on Vercel

## The Problem

Your code works perfectly on your local server because:
- ✅ All environment variables are in `.env.local`
- ✅ `NEXTAUTH_URL` is set to `http://localhost:3000`
- ✅ All secrets and keys are configured

But on Vercel, it fails because:
- ❌ Environment variables might not be set
- ❌ `NEXTAUTH_URL` might be wrong or missing
- ❌ Secrets might be missing

## 🔍 Step-by-Step Comparison

### Step 1: Check Your Local `.env.local`

Look at your `.env.local` file and list all variables:

```bash
# In your project root, check what you have:
cat .env.local
```

**Common variables you should have:**
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
STRIPE_SECRET_KEY=your-key
STRIPE_WEBHOOK_SECRET=your-secret
NEXT_PUBLIC_STRIPE_PRICE_ID=your-price-id
OPENAI_API_KEY=your-key
```

### Step 2: Compare with Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Compare each variable from your `.env.local` with what's in Vercel

**Checklist:**
- [ ] `NEXTAUTH_URL` - Should be `https://www.mycollegemap.net` (not localhost!)
- [ ] `NEXTAUTH_SECRET` - Must match or be a new secret
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Must be set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Must be set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Must be set
- [ ] `GOOGLE_CLIENT_ID` - Must be set
- [ ] `GOOGLE_CLIENT_SECRET` - Must be set
- [ ] All other variables from `.env.local`

### Step 3: Common Differences

#### 1. NEXTAUTH_URL
**Local:** `http://localhost:3000`  
**Vercel:** Must be `https://www.mycollegemap.net`

**Fix:** Add/update in Vercel:
```
NEXTAUTH_URL=https://www.mycollegemap.net
```

#### 2. NEXTAUTH_SECRET
**Local:** Set in `.env.local`  
**Vercel:** Might be missing

**Fix:** 
1. Copy the value from `.env.local` OR generate a new one:
   ```bash
   openssl rand -base64 32
   ```
2. Add to Vercel as `NEXTAUTH_SECRET`

#### 3. Environment Scope
**Local:** All variables available  
**Vercel:** Variables might only be set for "Preview" not "Production"

**Fix:** When adding variables in Vercel, select:
- ✅ Production
- ✅ Preview  
- ✅ Development (optional)

## 🚨 Most Likely Issue: Missing NEXTAUTH_SECRET

Since it works locally, you definitely have `NEXTAUTH_SECRET` in `.env.local`. But Vercel might not have it.

**Quick Fix:**
1. Copy `NEXTAUTH_SECRET` from your `.env.local`
2. Add it to Vercel → Settings → Environment Variables
3. Make sure it's set for "Production"
4. Redeploy

## 📋 Complete Checklist

### Required Variables for NextAuth to Work:

```bash
# Authentication
NEXTAUTH_SECRET=your-secret-here          # ⚠️ CRITICAL - Missing this = 500 errors
NEXTAUTH_URL=https://www.mycollegemap.net # ⚠️ CRITICAL - Wrong URL = redirect issues

# Supabase (for database auth)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

### How to Verify in Vercel:

1. **Check if variables exist:**
   - Vercel Dashboard → Settings → Environment Variables
   - Look for each variable listed above

2. **Check environment scope:**
   - Each variable should show which environments it's set for
   - Make sure "Production" is checked

3. **Verify values:**
   - Click on a variable to see its value (masked)
   - Make sure it's not empty

## 🔧 Quick Fix Steps

### Option 1: Copy All Variables from Local

1. Open your `.env.local` file
2. For each variable:
   - Go to Vercel → Settings → Environment Variables
   - Click "Add New"
   - Copy the key and value
   - Select "Production" (and "Preview" if needed)
   - Save

### Option 2: Export and Import (if using Vercel CLI)

```bash
# List local variables
cat .env.local

# Then manually add each to Vercel Dashboard
```

## ⚠️ Important Notes

### 1. NEXTAUTH_URL Must Match Your Domain
- **Local:** `http://localhost:3000`
- **Vercel:** `https://www.mycollegemap.net` (your actual domain)

### 2. NEXTAUTH_SECRET Can Be Different
- You can use the same secret from local
- OR generate a new one for production (more secure)
- But it MUST be set

### 3. Redeploy After Adding Variables
- Environment variables are loaded at **build time**
- After adding variables, you MUST redeploy
- Go to Deployments → Click "Redeploy"

## 🐛 Debugging Steps

### 1. Check What's Actually Set in Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Take a screenshot or list all variables
3. Compare with your `.env.local`

### 2. Check Build Logs
1. Deployments → Latest deployment
2. Check if build succeeded
3. Look for any warnings about missing variables

### 3. Check Runtime Logs
1. Logs tab → Watch in real-time
2. Try to sign in
3. Look for error messages

### 4. Test the Error Response
After deploying the improved error handler:
1. Open browser DevTools (F12)
2. Network tab
3. Try to sign in
4. Click the failed `/api/auth/session` request
5. Response tab will show the exact error

## ✅ Verification

After adding all variables and redeploying:

1. **Build should succeed** ✅
2. **No 500 errors** ✅
3. **Authentication works** ✅

If it still doesn't work, check the runtime logs for the specific error message.


