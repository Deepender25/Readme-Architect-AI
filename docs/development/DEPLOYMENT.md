# 🚀 Deployment Guide for AutoDoc AI

This guide will help you deploy your Next.js AutoDoc AI application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **Environment Variables**: Prepare your API keys

## 🔧 Environment Variables

Create these environment variables in your Vercel project:

### Required Variables
```bash
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

### Optional Variables (for GitHub features)
```bash
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_REDIRECT_URI=https://your-domain.vercel.app/auth/callback
GITHUB_DATA_REPO_OWNER=your_github_username
GITHUB_DATA_REPO_NAME=autodoc-ai-data
GITHUB_DATA_TOKEN=your_personal_access_token
```

## 🚀 Deployment Steps

### Method 1: Using Vercel CLI (Recommended)

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy from your project directory:**
   ```bash
   # For preview deployment
   npm run deploy:preview
   
   # For production deployment
   npm run deploy
   ```

3. **Follow the prompts:**
   - Link to existing project or create new one
   - Set up environment variables when prompted

### Method 2: Using Vercel Dashboard

1. **Connect Repository:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Method 3: GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Auto-deploy:**
   - Vercel will automatically deploy on every push to main branch
   - Preview deployments for pull requests

## 🔍 Vercel Configuration

The project includes a `vercel.json` file that configures:

- **Next.js Build**: Handles the frontend application
- **Python Functions**: Serves the AI generation APIs
- **Routing**: Maps API endpoints correctly

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "api/generate.py",
      "use": "@vercel/python"
    },
    {
      "src": "api/stream.py",
      "use": "@vercel/python"
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Python API Issues:**
   - Check that `requirements.txt` is in the root
   - Verify Python functions are in the `api/` directory
   - Ensure environment variables are set

3. **Environment Variables:**
   - Variables must be set in Vercel dashboard
   - Use `VERCEL_URL` for dynamic base URLs
   - Restart deployment after adding variables

### Debugging

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Project → Functions
   - View logs for each deployment

2. **Test APIs:**
   ```bash
   # Test Python API
   curl https://your-app.vercel.app/api/python/generate?repo_url=https://github.com/user/repo
   
   # Test Next.js API
   curl https://your-app.vercel.app/api/generate?repo_url=https://github.com/user/repo
   ```

## 📊 Performance Optimization

1. **Next.js Optimization:**
   - Images are optimized automatically
   - Static assets are cached
   - Code splitting is enabled

2. **Python Functions:**
   - Cold start optimization
   - Memory allocation: 1024MB (configurable)
   - Timeout: 10s for generation, 30s for streaming

## 🔒 Security

1. **Environment Variables:**
   - Never commit API keys to git
   - Use Vercel's encrypted environment variables

2. **API Security:**
   - CORS is configured for your domain
   - Rate limiting can be added if needed

## 📈 Monitoring

1. **Vercel Analytics:**
   - Enable in Project Settings
   - Monitor performance and usage

2. **Error Tracking:**
   - Check Function Logs in Vercel Dashboard
   - Set up error notifications

## 🎯 Custom Domain

1. **Add Domain:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **SSL Certificate:**
   - Automatically provisioned by Vercel
   - Includes automatic renewal

## 📝 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] README generation works
- [ ] Streaming updates function
- [ ] Environment variables are set
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Error monitoring set up

## 🆘 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel Dashboard
3. Test locally with `npm run dev`
4. Check environment variables configuration

---

Your AutoDoc AI application should now be live on Vercel! 🎉