# How to Check Vercel Logs for NextAuth Errors

## Step-by-Step Guide

### 1. Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project (`mycollegemap`)

### 2. View Deployment Logs
1. Click on **"Deployments"** tab
2. Click on the **latest deployment** (the most recent one)
3. Look for any **build errors** or **runtime errors**

### 3. Check Function Logs (Most Important)
1. In the deployment page, click on **"Functions"** tab
2. Find `/api/auth/[...nextauth]` in the list
3. Click on it
4. You'll see:
   - **Invocations** - How many times it was called
   - **Logs** - Error messages and console logs

### 4. What to Look For

**Common Error Messages:**

```
❌ NEXTAUTH_SECRET is required for production!
```
→ **Fix:** Add `NEXTAUTH_SECRET` to Vercel environment variables

```
Error: Invalid NEXTAUTH_URL
```
→ **Fix:** Set `NEXTAUTH_URL=https://www.mycollegemap.net`

```
Error: Failed to connect to Supabase
```
→ **Fix:** Check Supabase environment variables

```
Error: Cannot read property 'x' of undefined
```
→ **Fix:** Check auth configuration in `lib/auth.ts`

### 5. Real-Time Logs
1. Go to **"Logs"** tab in Vercel Dashboard
2. Select your project
3. You'll see real-time logs from your functions
4. Try signing in and watch for errors

### 6. Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to **"Network"** tab
3. Try to sign in
4. Look for requests to `/api/auth/*`
5. Click on the failed request
6. Check:
   - **Status Code** (should be 200, not 500)
   - **Response** tab - shows the error message
   - **Headers** tab - shows request/response headers

## Quick Diagnostic Checklist

- [ ] Checked Vercel function logs for `/api/auth/[...nextauth]`
- [ ] Checked browser Network tab for failed requests
- [ ] Verified `NEXTAUTH_SECRET` is set in Vercel
- [ ] Verified `NEXTAUTH_URL` is set correctly
- [ ] Checked Supabase connection (if using database auth)
- [ ] Verified all environment variables are set

## Most Common Issues

### Issue 1: Missing NEXTAUTH_SECRET
**Log shows:** `NEXTAUTH_SECRET is required`
**Fix:** Add it to Vercel environment variables

### Issue 2: Wrong NEXTAUTH_URL
**Log shows:** `Invalid redirect URI`
**Fix:** Set `NEXTAUTH_URL=https://www.mycollegemap.net`

### Issue 3: Supabase Connection Failed
**Log shows:** `Failed to connect to Supabase`
**Fix:** Check `NEXT_PUBLIC_SUPABASE_URL` and keys

### Issue 4: Runtime Error in Auth Config
**Log shows:** JavaScript error in `lib/auth.ts`
**Fix:** Check the specific line mentioned in the error

## Share the Error

If you find an error in the logs, share:
1. The exact error message
2. Which function it's in (`/api/auth/[...nextauth]`)
3. The stack trace (if available)

This will help identify the exact issue!

