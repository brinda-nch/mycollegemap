# Google OAuth Debugging Guide

## Current Error
```
redirect_uri=https://www.mycollegemap.net/api/auth/callback/google
```

## Step-by-Step Debugging

### 1. Verify NEXTAUTH_URL in Vercel
**Check:** Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required:**
```
NEXTAUTH_URL=https://www.mycollegemap.net
```

**Important:** 
- Must be `https://` (not `http://`)
- Must match your actual domain exactly
- No trailing slash

### 2. Verify Google OAuth Credentials Match

**In Google Cloud Console:**
1. Go to APIs & Services → Credentials
2. Find your OAuth 2.0 Client ID
3. Copy the **Client ID** and **Client Secret**

**In Vercel:**
1. Go to Settings → Environment Variables
2. Verify:
   - `GOOGLE_CLIENT_ID` matches Google Console Client ID exactly
   - `GOOGLE_CLIENT_SECRET` matches Google Console Client Secret exactly

**Common Issues:**
- Extra spaces before/after
- Wrong credentials (using different project's credentials)
- Client ID/Secret swapped

### 3. Verify Redirect URI in Google Console

**Exact URI to add:**
```
https://www.mycollegemap.net/api/auth/callback/google
```

**Checklist:**
- [ ] Protocol: `https://` (not `http://`)
- [ ] Domain: `www.mycollegemap.net` (exact match)
- [ ] Path: `/api/auth/callback/google` (exact match)
- [ ] No trailing slash
- [ ] No extra spaces

**To verify:**
1. Google Cloud Console → APIs & Services → Credentials
2. Click your OAuth 2.0 Client ID
3. Scroll to "Authorized redirect URIs"
4. Check if `https://www.mycollegemap.net/api/auth/callback/google` is listed
5. If not, add it and **SAVE**

### 4. Check OAuth Consent Screen

**Issue:** If your app is in "Testing" mode, only test users can sign in.

**Fix:**
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Check "Publishing status"
3. If "Testing":
   - Add your email to "Test users" list, OR
   - Click "PUBLISH APP" (if ready for production)

**Note:** Publishing requires app verification if using sensitive scopes.

### 5. Check Domain Verification

**If using custom domain (`www.mycollegemap.net`):**
- Google might require domain verification
- Check Google Search Console for verification status

### 6. Wait for Propagation

**After making changes:**
- Wait 2-5 minutes for Google to update
- Clear browser cache
- Try again in incognito mode

### 7. Check for www vs non-www Mismatch

**Common Issue:** Domain mismatch

**Check:**
- Is your site accessible at `https://www.mycollegemap.net`?
- Or is it `https://mycollegemap.net` (without www)?

**If without www:**
- Add redirect URI: `https://mycollegemap.net/api/auth/callback/google`
- Set `NEXTAUTH_URL=https://mycollegemap.net` in Vercel

**If both work:**
- Add BOTH redirect URIs:
  - `https://www.mycollegemap.net/api/auth/callback/google`
  - `https://mycollegemap.net/api/auth/callback/google`

### 8. Verify Environment Variables Are Deployed

**After adding/changing environment variables in Vercel:**
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or trigger a new deployment

**Note:** Environment variable changes require a new deployment to take effect.

### 9. Check Browser Console for Errors

**Open browser DevTools (F12):**
1. Go to Console tab
2. Try signing in with Google
3. Look for any JavaScript errors
4. Check Network tab for failed requests

### 10. Test with Different Browser/Device

**If still not working:**
- Try a different browser
- Try a different device
- Try from a different network

This helps rule out browser-specific or network issues.

## Quick Verification Checklist

- [ ] `NEXTAUTH_URL` in Vercel = `https://www.mycollegemap.net`
- [ ] `GOOGLE_CLIENT_ID` in Vercel = Google Console Client ID
- [ ] `GOOGLE_CLIENT_SECRET` in Vercel = Google Console Client Secret
- [ ] Redirect URI in Google Console = `https://www.mycollegemap.net/api/auth/callback/google`
- [ ] OAuth consent screen is published or your email is in test users
- [ ] Redeployed after changing environment variables
- [ ] Waited 2-5 minutes after making changes
- [ ] Tried in incognito mode

## Still Not Working?

### Check the Exact Error Message
The error message shows the exact redirect URI NextAuth is trying to use. Compare it character-by-character with what's in Google Console.

### Common Character Issues:
- Spaces before/after
- Trailing slashes
- `http://` vs `https://`
- `www.` vs non-www
- Case sensitivity (should be lowercase)

### Get More Details:
1. Check Vercel function logs for errors
2. Check browser Network tab for the OAuth request
3. Look at the full error URL in the browser address bar

