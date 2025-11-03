# GitHub OAuth Setup Guide

## 🚨 CRITICAL: OAuth Configuration Required

The login issue is caused by missing GitHub OAuth configuration. Follow these steps to fix it:

## Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Fill in the application details:
   - **Application name**: `ReadmeArchitect`
   - **Homepage URL**: `https://readmearchitect.vercel.app`
   - **Authorization callback URL**: `https://readmearchitect.vercel.app/api/auth/callback`
   - **Application description**: `AI-powered README generator for GitHub repositories`

3. Click "Register application"

## Step 2: Get OAuth Credentials

After creating the app, you'll see:
- **Client ID** (public - safe to expose)
- **Client Secret** (private - keep this secret!)

## Step 3: Configure Environment Variables

### Option A: Vercel Dashboard (Recommended for Production)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `readmearchitect` project
3. Go to Settings → Environment Variables
4. Add these variables:

```
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
GITHUB_REDIRECT_URI=https://readmearchitect.vercel.app/api/auth/callback
```

### Option B: Local .env File (For Development)

Update your `.env` file:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here
GITHUB_REDIRECT_URI=https://readmearchitect.vercel.app/api/auth/callback
```

## Step 4: Deploy Changes

After setting environment variables:

```bash
vercel --prod
```

## Step 5: Test the Login Flow

1. Visit: https://readmearchitect.vercel.app
2. Click "Connect with GitHub"
3. Complete GitHub OAuth authorization
4. You should be redirected back and logged in
5. Your avatar should appear in the navbar

## 🔧 Troubleshooting

### If login still fails:

1. **Check callback URL**: Must be exactly `https://readmearchitect.vercel.app/api/auth/callback`
2. **Verify environment variables**: Check Vercel dashboard settings
3. **Check browser console**: Look for JavaScript errors
4. **Test endpoints**: Run the test script to verify API endpoints

### Common Issues:

- **"Application not found"**: Client ID is incorrect
- **"Bad verification code"**: Client Secret is incorrect  
- **"Redirect URI mismatch"**: Callback URL doesn't match GitHub app settings
- **"Authentication failed"**: Environment variables not set in Vercel

## 🧪 Testing

Run the test script to verify everything works:

```bash
python scripts/test_live_auth_flow.py
```

## 📋 Checklist

- [ ] GitHub OAuth app created
- [ ] Client ID and Secret obtained
- [ ] Environment variables set in Vercel
- [ ] Callback URL matches exactly
- [ ] Deployed to production
- [ ] Login flow tested manually
- [ ] Test script passes

## 🔒 Security Notes

- Never commit Client Secret to git
- Use environment variables for all credentials
- Callback URL must use HTTPS in production
- Regularly rotate Client Secret if compromised

## 📞 Support

If you continue having issues:
1. Check the browser developer console for errors
2. Verify all environment variables are set correctly
3. Ensure the GitHub OAuth app callback URL is exact
4. Test with a fresh browser session (incognito mode)