# 🚀 Local Development Setup for AutoDoc AI

This guide will help you set up and run the AutoDoc AI application locally with working GitHub OAuth authentication.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Git**
- **GitHub OAuth App** (configured properly)

## 🔧 Setup Instructions

### 1. Install Dependencies

#### Install Node.js dependencies:
```bash
npm install
```

#### Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Make sure your `.env` file has the correct local development settings:

```env
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_REDIRECT_URI="http://localhost:8080/auth/callback"
# ... other environment variables
```

### 3. Configure GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "OAuth Apps"
3. Select your AutoDoc AI application
4. Update the **Authorization callback URL** to: `http://localhost:8080/auth/callback`

**Important:** You may need to create a separate OAuth app for local development, or add multiple callback URLs if supported.

### 4. Get a Google API Key (Required for README generation)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Generative Language API**
4. Create credentials (API Key)
5. Copy the API key and replace `YOUR_GOOGLE_API_KEY_HERE` in your `.env` file

## 🏃‍♂️ Running the Application

### Method 1: Using the Local Development Server (Recommended)

1. **Start Next.js development server** (in terminal 1):
   ```bash
   npm run dev
   ```

2. **Start the Python development server** (in terminal 2):
   ```bash
   python local_dev_server.py
   ```

3. **Access the application**:
   - **Main application**: http://localhost:8080
   - **Direct Next.js**: http://localhost:3000 (OAuth won't work here)

### Method 2: Using Vercel Dev (Alternative)

```bash
vercel dev
```

## 🔍 How It Works

### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Browser       │───▶│  Local Dev       │───▶│    Next.js      │
│  localhost:8080 │    │  Server (8080)   │    │  Dev (3000)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Python OAuth    │
                       │  & API Handler   │
                       └──────────────────┘
```

### Request Flow

1. **OAuth Routes** (`/auth/*`, `/api/repositories`, `/api/generate`, `/api/history`):
   - Handled directly by the Python backend
   - Includes GitHub OAuth flow, repository fetching, README generation, and history management

2. **All Other Routes** (pages, static assets, other API routes):
   - Proxied to Next.js development server on port 3000
   - Includes the React frontend, static pages, and other API endpoints

### OAuth Flow

1. User clicks "Sign in with GitHub" → `/auth/github`
2. Python server redirects to GitHub OAuth
3. GitHub redirects back to `/auth/callback`
4. Python server exchanges code for token, gets user data
5. Sets cookie and redirects to homepage with success parameter
6. React AuthProvider reads the success parameter and cookie

## 🐛 Troubleshooting

### Common Issues

#### 1. "Next.js Development Server Not Running"
- Make sure `npm run dev` is running on port 3000
- Check that port 3000 is not blocked by firewall

#### 2. OAuth "redirect_uri_mismatch" Error
- Verify GitHub OAuth app callback URL is set to `http://localhost:8080/auth/callback`
- Check that `GITHUB_REDIRECT_URI` in `.env` matches exactly

#### 3. "GitHub OAuth not configured" Error
- Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in `.env`
- Ensure the GitHub OAuth app exists and is properly configured

#### 4. README Generation Fails
- Check that `GOOGLE_API_KEY` is set and valid
- Ensure the Generative Language API is enabled in Google Cloud Console
- Verify you have sufficient quota/credits

#### 5. Python Import Errors
- Make sure you're running Python 3.8+
- Install dependencies: `pip install -r requirements.txt`
- Check that the `api/` directory is accessible

### Debug Commands

```bash
# Check if Next.js is running
curl http://localhost:3000

# Check if local dev server is running
curl http://localhost:8080

# Test OAuth endpoint
curl http://localhost:8080/auth/github

# Check Python dependencies
python -c "import requests, google.generativeai; print('Dependencies OK')"
```

## 🔄 Making Changes

### Frontend Changes
- Edit files in `src/`
- Next.js will automatically reload
- View changes at http://localhost:8080

### Backend Changes
- Edit files in `api/`
- Restart the Python development server
- Test API endpoints at http://localhost:8080/api/*

### Environment Changes
- Edit `.env`
- Restart both servers

## 📚 Useful Commands

```bash
# Install new npm packages
npm install package-name

# Install new Python packages
pip install package-name
pip freeze > requirements.txt

# Build for production
npm run build

# Deploy to Vercel
npm run deploy
```

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Verify all environment variables are set correctly
3. Ensure both servers are running
4. Check browser developer console for errors
5. Look at terminal output for error messages

---

**Happy coding! 🚀**
