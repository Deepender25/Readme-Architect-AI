# 🚀 GitHub Integration Deployment Guide

This guide explains how to deploy your AutoDoc AI application using GitHub integration instead of the Vercel CLI.

## 🔄 Recent Changes

✅ **Fixed Issues:**
- Removed dual authentication (Vercel + GitHub) - now only GitHub OAuth is required
- Fixed routing issues when deploying via GitHub instead of Vercel CLI
- Made redirect URIs dynamic to work with any domain
- Removed VERCEL_URL dependencies

## 📋 Prerequisites

1. **GitHub Account**: Your repository hosted on GitHub
2. **Vercel Account**: Connected to your GitHub account
3. **Environment Variables**: Set up in Vercel dashboard

## 🚀 Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Build Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the following variables:

   ```bash
   GOOGLE_API_KEY=your_google_gemini_api_key
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   GITHUB_DATA_REPO_OWNER=your_github_username (optional)
   GITHUB_DATA_REPO_NAME=autodoc-ai-data (optional)
   GITHUB_DATA_TOKEN=your_personal_access_token (optional)
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-app-name.vercel.app`

### Method 2: GitHub Actions (Automated)

1. **Set up GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     ```
     VERCEL_TOKEN=your_vercel_token
     VERCEL_ORG_ID=your_vercel_org_id
     VERCEL_PROJECT_ID=your_vercel_project_id
     ```

2. **Get Vercel Credentials:**
   - **VERCEL_TOKEN**: Go to Vercel → Settings → Tokens → Create
   - **VERCEL_ORG_ID**: Go to Vercel → Settings → General (Team ID)
   - **VERCEL_PROJECT_ID**: Go to your project → Settings → General (Project ID)

3. **Automatic Deployment:**
   - Push to `main` or `master` branch
   - GitHub Actions will automatically deploy to Vercel
   - Check the Actions tab for deployment status

### Method 3: Vercel CLI (Still Available)

```bash
# Login to Vercel
vercel login

# Deploy
npm run deploy
```

## 🔧 GitHub OAuth Setup

1. **Create GitHub OAuth App:**
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Fill in details:
     ```
     Application name: AutoDoc AI
     Homepage URL: https://your-app.vercel.app
     Authorization callback URL: https://your-app.vercel.app/auth/callback
     ```

2. **Note Credentials:**
   - Copy Client ID and Client Secret
   - Add them to your Vercel environment variables

3. **Update OAuth App for Multiple Domains:**
   - You can now use the same OAuth app for development and production
   - The redirect URI is automatically determined from the request
   - No need to update the OAuth app for different deployments

## ✅ Verification Steps

After deployment, verify everything works:

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test authentication**: Click "Sign in with GitHub"
3. **Test README generation**: Try generating a README for a public repository
4. **Check logs**: Monitor Vercel function logs for any errors

## 🐛 Troubleshooting

### Common Issues

1. **"OAuth App not found" error:**
   - Verify `GITHUB_CLIENT_ID` is correct in Vercel environment variables
   - Check that the OAuth app exists in your GitHub settings

2. **"Redirect URI mismatch" error:**
   - The app now automatically handles redirect URIs
   - If still having issues, check the callback URL in your GitHub OAuth app

3. **Build failures:**
   - Check that all required environment variables are set
   - Verify Node.js version compatibility (requires Node 18+)

4. **Python API errors:**
   - Verify `GOOGLE_API_KEY` is set and valid
   - Check Vercel function logs for Python-specific errors

### Debug Commands

```bash
# Check your deployment
vercel ls

# View logs
vercel logs your-app-name

# Test locally
npm run dev
```

## 🔄 Auto-Deployment Setup

To enable automatic deployments on every push:

1. **Vercel Dashboard Method:**
   - Your repository is automatically connected
   - Every push to main/master triggers a deployment
   - Pull requests create preview deployments

2. **GitHub Actions Method:**
   - The provided `.github/workflows/vercel-deploy.yml` handles this
   - Customize the workflow as needed

## 📊 Environment Variables Summary

```bash
# Required
GOOGLE_API_KEY=your_google_gemini_api_key
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Optional (for history storage)
GITHUB_DATA_REPO_OWNER=your_github_username
GITHUB_DATA_REPO_NAME=autodoc-ai-data
GITHUB_DATA_TOKEN=your_personal_access_token
```

## 🎉 Success!

Once deployed via GitHub integration, your AutoDoc AI application will:
- ✅ Work correctly with GitHub OAuth (no Vercel login required)
- ✅ Auto-deploy on every push to main branch
- ✅ Handle multiple domains automatically
- ✅ Generate READMEs using AI
- ✅ Store user history (if configured)

Need help? Check the troubleshooting section or view the application logs in your Vercel dashboard.
