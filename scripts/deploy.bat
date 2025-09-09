@echo off
echo 🚀 Deploying AutoDoc AI to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if user is logged in
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel:
    vercel login
)

REM Build the project locally first
echo 🔨 Building project locally...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Local build successful!
) else (
    echo ❌ Local build failed. Please fix errors before deploying.
    exit /b 1
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 📝 Don't forget to set your environment variables in the Vercel dashboard:
echo    - GOOGLE_API_KEY
echo    - GITHUB_CLIENT_ID (optional)
echo    - GITHUB_CLIENT_SECRET (optional)
echo    - And other variables as needed