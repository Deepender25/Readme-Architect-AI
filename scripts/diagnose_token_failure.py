#!/usr/bin/env python3
"""
Diagnose GitHub OAuth token exchange failure
This helps identify why token_failed error is occurring
"""

import requests
import os
from dotenv import load_dotenv

def test_github_oauth_credentials():
    """Test if GitHub OAuth credentials are valid"""
    
    load_dotenv()
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    
    print("🔍 Diagnosing GitHub OAuth Token Failure")
    print("=" * 50)
    
    print(f"Client ID: {client_id}")
    print(f"Client Secret: {client_secret[:8]}... (first 8 chars)")
    
    # Test 1: Verify credentials with GitHub API
    print(f"\n1️⃣ Testing OAuth app credentials...")
    
    try:
        # Try to exchange a dummy code - this will fail but tell us if credentials are valid
        token_response = requests.post('https://github.com/login/oauth/access_token', {
            'client_id': client_id,
            'client_secret': client_secret,
            'code': 'dummy_code_for_testing'
        }, headers={'Accept': 'application/json'}, timeout=10)
        
        print(f"   Status: {token_response.status_code}")
        
        if token_response.status_code == 200:
            data = token_response.json()
            print(f"   Response: {data}")
            
            if data.get('error') == 'bad_verification_code':
                print("   ✅ Credentials are valid (correctly rejected dummy code)")
                return True
            elif data.get('error') == 'incorrect_client_credentials':
                print("   ❌ Invalid client credentials!")
                print("   🔧 Fix: Check your GITHUB_CLIENT_SECRET")
                return False
            elif data.get('error') == 'bad_client_id':
                print("   ❌ Invalid client ID!")
                print("   🔧 Fix: Check your GITHUB_CLIENT_ID")
                return False
            else:
                print(f"   ⚠️ Unexpected error: {data.get('error', 'Unknown')}")
                return False
        else:
            print(f"   ❌ HTTP error: {token_response.status_code}")
            print(f"   Response: {token_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Network error: {e}")
        return False

def check_github_oauth_app_status():
    """Check if the GitHub OAuth app exists and is accessible"""
    
    print(f"\n2️⃣ Checking GitHub OAuth app status...")
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    
    # Test the authorization URL
    auth_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&scope=repo"
    
    try:
        response = requests.head(auth_url, timeout=10)
        print(f"   Authorization URL status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ OAuth app exists and is accessible")
            return True
        elif response.status_code == 404:
            print("   ❌ OAuth app not found!")
            print("   🔧 Fix: Verify the Client ID is correct")
            return False
        else:
            print(f"   ⚠️ Unexpected status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error checking OAuth app: {e}")
        return False

def check_callback_url_configuration():
    """Check if the callback URL is properly configured"""
    
    print(f"\n3️⃣ Checking callback URL configuration...")
    
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    print(f"   Configured callback URL: {redirect_uri}")
    
    # Test if the callback URL is accessible
    try:
        response = requests.get(f"{redirect_uri}?code=test&state=test", allow_redirects=False, timeout=10)
        print(f"   Callback URL status: {response.status_code}")
        
        if response.status_code in [301, 302, 307]:
            location = response.headers.get('Location', '')
            if 'error=token_failed' in location:
                print("   ✅ Callback URL is working (correctly handles test)")
                return True
            else:
                print(f"   ⚠️ Unexpected redirect: {location}")
                return True  # Still working, just different behavior
        else:
            print(f"   ❌ Callback URL not working properly")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing callback URL: {e}")
        return False

def provide_specific_fixes(creds_valid, app_exists, callback_works):
    """Provide specific fix instructions based on test results"""
    
    print(f"\n🔧 Diagnosis Results & Fixes")
    print("=" * 35)
    
    if creds_valid and app_exists and callback_works:
        print("✅ All OAuth components are working correctly!")
        print("\n🤔 If you're still getting token_failed, it might be:")
        print("   1. Browser cache/cookies issue")
        print("   2. GitHub OAuth app callback URL mismatch")
        print("   3. Temporary GitHub API issue")
        
        print(f"\n🧪 Try these steps:")
        print("   1. Clear browser cache and cookies")
        print("   2. Try incognito/private browsing")
        print("   3. Check GitHub OAuth app settings:")
        print("      - Go to: https://github.com/settings/developers")
        print(f"      - Find app with Client ID: {os.getenv('GITHUB_CLIENT_ID')}")
        print("      - Verify callback URL is exactly: https://readmearchitect.vercel.app/api/auth/callback")
        
    else:
        print("❌ Issues found that need to be fixed:")
        
        if not creds_valid:
            print("\n🔑 Credential Issues:")
            print("   • Your GitHub Client ID or Client Secret is incorrect")
            print("   • Go to: https://github.com/settings/developers")
            print("   • Find your OAuth app and copy the correct credentials")
            print("   • Update your Vercel environment variables")
        
        if not app_exists:
            print("\n📱 OAuth App Issues:")
            print("   • Your GitHub OAuth app doesn't exist or is inaccessible")
            print("   • Verify the Client ID is correct")
            print("   • Check if the app was deleted or suspended")
        
        if not callback_works:
            print("\n🔄 Callback Issues:")
            print("   • Your callback URL is not working")
            print("   • Check your Vercel deployment")
            print("   • Verify the callback route is properly configured")

def test_real_oauth_flow():
    """Provide instructions for testing the real OAuth flow"""
    
    print(f"\n🌐 Manual OAuth Flow Test")
    print("=" * 30)
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    
    test_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo&state=manual_test"
    
    print("📋 Manual test steps:")
    print(f"1. Open this URL in your browser:")
    print(f"   {test_url}")
    print("2. You should see GitHub's authorization page")
    print("3. Click 'Authorize' (if you see the page)")
    print("4. Check where you get redirected")
    print("5. Look for any error messages")
    
    print(f"\n✅ Expected behavior:")
    print("   • GitHub shows authorization page for your app")
    print("   • After clicking 'Authorize', you're redirected to your app")
    print("   • You should be logged in successfully")
    
    print(f"\n❌ If you see errors:")
    print("   • 'Application does not exist' → Wrong Client ID")
    print("   • 'Redirect URI mismatch' → Wrong callback URL in GitHub app settings")
    print("   • 'Application suspended' → Contact GitHub support")

if __name__ == "__main__":
    print("🚀 GitHub OAuth Token Failure Diagnosis")
    print("This will help identify why you're getting 'token_failed' errors\n")
    
    creds_valid = test_github_oauth_credentials()
    app_exists = check_github_oauth_app_status()
    callback_works = check_callback_url_configuration()
    
    provide_specific_fixes(creds_valid, app_exists, callback_works)
    test_real_oauth_flow()
    
    print(f"\n{'='*60}")
    if creds_valid and app_exists and callback_works:
        print("🎉 Technical setup looks good! Try the manual test above.")
    else:
        print("⚠️ Found issues that need to be fixed. See instructions above.")