#!/usr/bin/env python3
"""
Test GitHub OAuth app configuration
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_github_oauth_app():
    """Test if the GitHub OAuth app is properly configured"""
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    
    print("🔍 GitHub OAuth App Configuration Test")
    print("=" * 50)
    
    print(f"Client ID: {client_id}")
    print(f"Redirect URI: {redirect_uri}")
    print(f"Client Secret: {'Set' if client_secret else 'Not set'}")
    
    if not all([client_id, client_secret, redirect_uri]):
        print("❌ Missing OAuth configuration!")
        return False
    
    # Test 1: Check if the OAuth app exists by trying to get app info
    print("\n1️⃣ Testing OAuth app existence...")
    try:
        # This endpoint doesn't exist in GitHub API, but we can test the client_id format
        if client_id.startswith('Ov23li'):
            print("✅ Client ID format looks correct (GitHub App)")
        elif len(client_id) == 20:
            print("✅ Client ID format looks correct (OAuth App)")
        else:
            print(f"⚠️ Unusual client ID format: {client_id}")
    except Exception as e:
        print(f"❌ Error checking client ID: {e}")
    
    # Test 2: Test the authorization URL
    print("\n2️⃣ Testing authorization URL...")
    auth_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo&state=test"
    
    try:
        response = requests.head(auth_url, allow_redirects=False)
        if response.status_code == 200:
            print("✅ Authorization URL is accessible")
        else:
            print(f"⚠️ Authorization URL returned: {response.status_code}")
    except Exception as e:
        print(f"❌ Error accessing authorization URL: {e}")
    
    # Test 3: Test token exchange with invalid code (should fail gracefully)
    print("\n3️⃣ Testing token exchange endpoint...")
    try:
        token_response = requests.post('https://github.com/login/oauth/access_token', {
            'client_id': client_id,
            'client_secret': client_secret,
            'code': 'invalid_code_for_testing'
        }, headers={'Accept': 'application/json'})
        
        if token_response.status_code == 200:
            data = token_response.json()
            if 'error' in data:
                if data['error'] == 'bad_verification_code':
                    print("✅ Token exchange endpoint works (correctly rejected invalid code)")
                else:
                    print(f"⚠️ Unexpected error: {data['error']}")
            else:
                print("⚠️ Unexpected success with invalid code")
        else:
            print(f"❌ Token exchange failed: {token_response.status_code}")
    except Exception as e:
        print(f"❌ Error testing token exchange: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 GitHub OAuth app test completed!")
    
    return True

def check_common_issues():
    """Check for common OAuth configuration issues"""
    print("\n🔧 Checking for common issues...")
    print("=" * 40)
    
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
    
    issues = []
    
    # Check redirect URI
    if redirect_uri:
        if not redirect_uri.startswith('https://'):
            issues.append("Redirect URI should use HTTPS in production")
        
        if 'localhost' in redirect_uri:
            issues.append("Redirect URI contains localhost (should be production URL)")
        
        if not redirect_uri.endswith('/api/auth/callback'):
            issues.append("Redirect URI should end with /api/auth/callback")
    
    if issues:
        print("⚠️ Potential issues found:")
        for issue in issues:
            print(f"   • {issue}")
    else:
        print("✅ No obvious configuration issues found")
    
    print("\n💡 If login still fails, check:")
    print("   1. GitHub OAuth app callback URL matches exactly")
    print("   2. OAuth app is not suspended or restricted")
    print("   3. User has access to the OAuth app")
    print("   4. Browser is not blocking third-party cookies")
    print("   5. Check browser console for JavaScript errors")

if __name__ == "__main__":
    test_github_oauth_app()
    check_common_issues()