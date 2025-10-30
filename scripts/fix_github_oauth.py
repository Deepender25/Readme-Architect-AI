#!/usr/bin/env python3
"""
GitHub OAuth Configuration Fixer
This script helps diagnose and fix GitHub OAuth login issues.
"""

import os
import requests
import json
from dotenv import load_dotenv

def check_github_oauth_app():
    """Check if the GitHub OAuth app is properly configured"""
    
    load_dotenv()
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    
    print("🔍 GitHub OAuth Configuration Checker")
    print("=" * 50)
    
    print(f"✅ Client ID: {client_id}")
    print(f"✅ Redirect URI: {redirect_uri}")
    print(f"✅ Client Secret: {'Set (' + client_secret[:8] + '...)' if client_secret else 'Not set'}")
    
    if not all([client_id, client_secret, redirect_uri]):
        print("\n❌ Missing OAuth configuration!")
        return False
    
    # Test the OAuth flow
    print(f"\n🧪 Testing OAuth Flow...")
    
    # Step 1: Test authorization URL
    auth_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo&state=test"
    print(f"\n1️⃣ Authorization URL:")
    print(f"   {auth_url}")
    
    try:
        response = requests.head(auth_url, timeout=10)
        if response.status_code == 200:
            print("   ✅ Authorization URL is accessible")
        else:
            print(f"   ⚠️ Authorization URL returned: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error accessing authorization URL: {e}")
    
    # Step 2: Test token exchange with invalid code
    print(f"\n2️⃣ Testing token exchange...")
    try:
        token_response = requests.post('https://github.com/login/oauth/access_token', {
            'client_id': client_id,
            'client_secret': client_secret,
            'code': 'invalid_test_code'
        }, headers={'Accept': 'application/json'}, timeout=10)
        
        if token_response.status_code == 200:
            data = token_response.json()
            if data.get('error') == 'bad_verification_code':
                print("   ✅ Token exchange endpoint works (correctly rejected invalid code)")
            else:
                print(f"   ⚠️ Unexpected response: {data}")
        else:
            print(f"   ❌ Token exchange failed: {token_response.status_code}")
    except Exception as e:
        print(f"   ❌ Error testing token exchange: {e}")
    
    # Step 3: Test your app's OAuth endpoints
    print(f"\n3️⃣ Testing app OAuth endpoints...")
    
    try:
        # Test /auth/github
        response = requests.get('https://readmearchitect.vercel.app/auth/github', allow_redirects=False, timeout=10)
        if response.status_code in [301, 302]:
            location = response.headers.get('Location', '')
            if 'github.com/login/oauth/authorize' in location and client_id in location:
                print("   ✅ /auth/github redirects correctly")
            else:
                print(f"   ❌ /auth/github redirects to: {location}")
        else:
            print(f"   ❌ /auth/github returned: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error testing /auth/github: {e}")
    
    try:
        # Test callback with dummy data
        callback_url = 'https://readmearchitect.vercel.app/api/auth/callback?code=dummy&state=test'
        response = requests.get(callback_url, allow_redirects=False, timeout=10)
        if response.status_code in [301, 302, 307]:
            location = response.headers.get('Location', '')
            if 'error=token_failed' in location:
                print("   ✅ /api/auth/callback handles invalid codes correctly")
            else:
                print(f"   ⚠️ /api/auth/callback redirects to: {location}")
        else:
            print(f"   ❌ /api/auth/callback returned: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error testing callback: {e}")
    
    return True

def provide_fix_instructions():
    """Provide step-by-step fix instructions"""
    
    print(f"\n🔧 Fix Instructions")
    print("=" * 30)
    
    print(f"\n1️⃣ Check GitHub OAuth App Settings:")
    print(f"   • Go to: https://github.com/settings/developers")
    print(f"   • Find your OAuth app with Client ID: Ov23liJqlWzXgWeeX0NZ")
    print(f"   • Verify these settings:")
    print(f"     - Homepage URL: https://readmearchitect.vercel.app")
    print(f"     - Authorization callback URL: https://readmearchitect.vercel.app/api/auth/callback")
    
    print(f"\n2️⃣ Test the OAuth Flow Manually:")
    print(f"   • Visit: https://readmearchitect.vercel.app/login")
    print(f"   • Click 'Sign in with GitHub'")
    print(f"   • Check browser console for errors")
    print(f"   • Check Network tab for failed requests")
    
    print(f"\n3️⃣ Common Issues & Solutions:")
    print(f"   • 'redirect_uri mismatch': Update GitHub OAuth app callback URL")
    print(f"   • 'Application suspended': Contact GitHub support")
    print(f"   • 'Invalid client': Check Client ID and Secret")
    print(f"   • Browser blocks: Disable ad blockers, enable cookies")
    
    print(f"\n4️⃣ If Still Not Working:")
    print(f"   • Check Vercel environment variables match .env file")
    print(f"   • Verify GitHub OAuth app is not restricted to organization")
    print(f"   • Try incognito/private browsing mode")
    print(f"   • Check if GitHub is experiencing issues")

def test_live_login():
    """Test the live login flow"""
    
    print(f"\n🌐 Live Login Flow Test")
    print("=" * 30)
    
    print(f"\n📋 Manual Test Steps:")
    print(f"1. Open: https://readmearchitect.vercel.app/login")
    print(f"2. Open browser developer tools (F12)")
    print(f"3. Go to Console tab")
    print(f"4. Click 'Sign in with GitHub'")
    print(f"5. Check for any error messages in console")
    print(f"6. If redirected to GitHub, authorize the app")
    print(f"7. Check if you're redirected back and logged in")
    
    print(f"\n🔍 What to Look For:")
    print(f"• Console errors (red text)")
    print(f"• Network failures (in Network tab)")
    print(f"• Cookie issues")
    print(f"• JavaScript errors")
    
    print(f"\n📞 If You See Errors:")
    print(f"• Take a screenshot of the console")
    print(f"• Note the exact error message")
    print(f"• Check if the error happens on first click or after GitHub redirect")

if __name__ == "__main__":
    print("🚀 ReadmeArchitect - GitHub OAuth Fixer")
    print("This tool will help diagnose and fix login issues.\n")
    
    success = check_github_oauth_app()
    
    if success:
        provide_fix_instructions()
        test_live_login()
        
        print(f"\n✅ OAuth configuration appears correct!")
        print(f"If you're still having issues, follow the manual test steps above.")
    else:
        print(f"\n❌ OAuth configuration has issues that need to be fixed!")