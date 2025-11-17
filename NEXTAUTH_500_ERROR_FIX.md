# NextAuth 500 Error Fix Guide

## Error: `CLIENT_FETCH_ERROR` with 500 status

This error occurs when NextAuth cannot initialize properly on the server.

## 🔴 Most Common Causes

### 1. **Missing NEXTAUTH_SECRET** (Most Likely)
**Symptom:** 500 error on `/api/auth/*` endpoints

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `NEXTAUTH_SECRET`
3. Value: Generate a random secret:
   ```bash
   openssl rand -base64 32
   ```
   Or use: https://generate-secret.vercel.app/32
4. **Redeploy** after adding

**Why it's required:** NextAuth uses this secret to encrypt JWT tokens and session data.

---

### 2. **Missing NEXTAUTH_URL**
**Symptom:** Redirects fail, callbacks don't work

**Fix:**
1. Add to Vercel environment variables:
   ```
   NEXTAUTH_URL=https://www.mycollegemap.net
   ```
2. **Redeploy**

**Note:** The code has a fallback, but it's better to set it explicitly.

---

### 3. **Supabase Connection Failing**
**Symptom:** Auth works but user creation/queries fail

**Check:**
- `NEXT_PUBLIC_SUPABASE_URL` is set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- `SUPABASE_SERVICE_ROLE_KEY` is set (for server-side operations)

**Fix:** Add missing Supabase variables to Vercel.

---

### 4. **Google OAuth Credentials Missing**
**Symptom:** Google sign-in fails

**Check:**
- `GOOGLE_CLIENT_ID` is set
- `GOOGLE_CLIENT_SECRET` is set

**Fix:** Add Google OAuth credentials to Vercel.

---

## 🔍 How to Debug

### Step 1: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Click on `/api/auth/[...nextauth]`
5. Check the logs for error messages

**Look for:**
- "NEXTAUTH_SECRET is missing"
- "Invalid configuration"
- Database connection errors
- Supabase errors

---

### Step 2: Verify Environment Variables
**Required variables:**
```bash
NEXTAUTH_SECRET=your-secret-here          # ⚠️ CRITICAL
NEXTAUTH_URL=https://www.mycollegemap.net
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

**To check in Vercel:**
1. Settings → Environment Variables
2. Verify all are set
3. Check they're set for "Production" environment

---

### Step 3: Test Locally First
**If it works locally but not on Vercel:**
- Environment variables are missing in Vercel
- Or they have wrong values

**If it doesn't work locally either:**
- Check `.env.local` file
- Verify all variables are set

---

## ✅ Quick Fix Checklist

- [ ] `NEXTAUTH_SECRET` is set in Vercel
- [ ] `NEXTAUTH_URL` is set to `https://www.mycollegemap.net`
- [ ] All Supabase variables are set
- [ ] Google OAuth credentials are set
- [ ] **Redeployed** after adding variables
- [ ] Checked Vercel function logs for specific errors

---

## 🚨 Most Likely Fix

**90% of the time, it's missing `NEXTAUTH_SECRET`:**

1. Generate a secret:
   ```bash
   openssl rand -base64 32
   ```

2. Add to Vercel:
   - Key: `NEXTAUTH_SECRET`
   - Value: (paste the generated secret)
   - Environment: Production (and Preview if needed)

3. Redeploy:
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Or push a new commit

4. Test again

---

## 📝 After Fixing

Once you add `NEXTAUTH_SECRET`:
1. Wait for deployment to complete
2. Clear browser cache
3. Try signing in again
4. Check browser console - error should be gone

---

## 🔗 Related Errors

If you see:
- `[next-auth][error][JWT_SESSION_ERROR]` → `NEXTAUTH_SECRET` issue
- `[next-auth][error][CALLBACK_OAUTH_ERROR]` → OAuth configuration issue
- `[next-auth][error][CLIENT_FETCH_ERROR]` → Server configuration issue (usually missing secret)

---

## 💡 Pro Tip

Always set `NEXTAUTH_SECRET` in Vercel **before** your first deployment. It's required for production.

