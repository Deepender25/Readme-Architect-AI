# 🔐 GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for your AutoDoc AI application.

## 📋 Prerequisites

- GitHub account
- Access to your Vercel project dashboard
- Your deployed application URL

## 🚀 Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**:
   - Visit https://github.com/settings/developers
   - Click "OAuth Apps" in the left sidebar
   - Click "New OAuth App"

2. **Fill in Application Details**:
   ```
   Application name: AutoDoc AI
   Homepage URL: https://autodocai-qaahjx5um-deepender25s-projects.vercel.app
   Application description: AI-powered README generator
   Authorization callback URL: https://autodocai-qaahjx5um-deepender25s-projects.vercel.app/auth/callback
   ```

3. **Register the Application**:
   - Click "Register application"
   - Note down the **Client ID** (visible immediately)
   - Click "Generate a new client secret"
   - Note down the **Client Secret** (keep this secure!)

## 🔧 Step 2: Configure Environment Variables

Add these environment variables in your Vercel dashboard:

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Select your AutoDoc AI project
   - Go to Settings → Environment Variables

2. **Add Required Variables**:
   ```bash
   GITHUB_CLIENT_ID=your_client_id_from_step_1
   GITHUB_CLIENT_SECRET=your_client_secret_from_step_1
   GITHUB_REDIRECT_URI=https://autodocai-qaahjx5um-deepender25s-projects.vercel.app/auth/callback
   ```

## 📊 Step 3: Set Up History Storage (Optional)

For persistent README generation history, you'll need a GitHub repository to store data:

1. **Create a Private Repository**:
   - Create a new private repository named `autodoc-ai-data`
   - This will store user history data

2. **Generate Personal Access Token**:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control of private repositories)
   - Generate and copy the token

3. **Add Storage Variables**:
   ```bash
   GITHUB_DATA_REPO_OWNER=your_github_username
   GITHUB_DATA_REPO_NAME=autodoc-ai-data
   GITHUB_DATA_TOKEN=your_personal_access_token
   ```

## 🔄 Step 4: Deploy Changes

After adding environment variables:

1. **Redeploy your application**:
   ```bash
   vercel --prod
   ```

2. **Or trigger a redeploy** from the Vercel dashboard

## ✅ Step 5: Test OAuth Flow

1. **Visit your application**
2. **Click "Sign in with GitHub"**
3. **Authorize the application** on GitHub
4. **You should be redirected back** with authentication

## 🎯 Features Enabled by OAuth

Once OAuth is configured, users will have access to:

### 🔐 **Authentication Features**
- Secure login/logout
- User profile display
- Session management

### 📁 **Repository Access**
- Browse user's GitHub repositories
- Quick repository selection for README generation
- Private repository access (if granted)

### 📚 **History Management**
- Persistent README generation history
- View, download, and delete previous generations
- Restore previous README configurations

### 🔄 **Enhanced Workflow**
- One-click repository selection
- Automatic project name detection
- Seamless integration with GitHub ecosystem

## 🛠️ Troubleshooting

### Common Issues

1. **"OAuth App not found" error**:
   - Check that `GITHUB_CLIENT_ID` is correct
   - Ensure the OAuth app exists in your GitHub settings

2. **"Invalid client secret" error**:
   - Verify `GITHUB_CLIENT_SECRET` is correct
   - Regenerate client secret if needed

3. **"Redirect URI mismatch" error**:
   - Ensure `GITHUB_REDIRECT_URI` matches exactly
   - Check OAuth app callback URL in GitHub settings

4. **"Authentication required" errors**:
   - Verify all environment variables are set
   - Check that the application has been redeployed

### Debug Steps

1. **Check Environment Variables**:
   - Verify all variables are set in Vercel dashboard
   - Ensure no extra spaces or quotes

2. **Test OAuth App**:
   - Try accessing the OAuth app directly in GitHub settings
   - Verify callback URL is accessible

3. **Check Logs**:
   - View function logs in Vercel dashboard
   - Look for authentication errors

## 🔒 Security Best Practices

1. **Keep Secrets Secure**:
   - Never commit client secrets to git
   - Use environment variables only
   - Regenerate secrets if compromised

2. **Limit Scope**:
   - Only request necessary GitHub permissions
   - Review OAuth app permissions regularly

3. **Monitor Usage**:
   - Check OAuth app usage in GitHub settings
   - Monitor for unusual authentication patterns

## 📝 Environment Variables Summary

```bash
# Required for OAuth
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_REDIRECT_URI=https://your-domain.vercel.app/auth/callback

# Optional for history storage
GITHUB_DATA_REPO_OWNER=your_github_username
GITHUB_DATA_REPO_NAME=autodoc-ai-data
GITHUB_DATA_TOKEN=your_personal_access_token

# Required for AI generation
GOOGLE_API_KEY=your_google_gemini_api_key
```

## 🎉 Success!

Once configured, your AutoDoc AI application will have full GitHub OAuth integration, providing users with a seamless and secure experience for README generation!

---

**Need Help?** Check the troubleshooting section above or review the application logs in your Vercel dashboard.