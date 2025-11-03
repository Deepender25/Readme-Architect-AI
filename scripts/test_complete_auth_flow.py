#!/usr/bin/env python3
"""
Comprehensive OAuth Flow Test Script
Tests the complete GitHub OAuth authentication flow
"""

import requests
import os
import sys
from urllib.parse import urlparse, parse_qs
import json

def test_auth_flow():
    """Test the complete authentication flow"""
    
    print("🧪 Testing Complete GitHub OAuth Flow")
    print("=" * 50)
    
    # Test configuration
    base_url = "http://localhost:3000"  # Change for production testing
    
    print(f"📍 Testing against: {base_url}")
    
    # Step 1: Test auth verification endpoint (should fail when not authenticated)
    print("\n1️⃣ Testing auth verification endpoint (unauthenticated)")
    try:
        response = requests.get(f"{base_url}/api/auth/verify")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 401:
            print("   ✅ Correctly returns 401 for unauthenticated user")
        else:
            print("   ❌ Should return 401 for unauthenticated user")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 2: Test GitHub auth redirect
    print("\n2️⃣ Testing GitHub auth redirect")
    try:
        response = requests.get(f"{base_url}/api/auth/github", allow_redirects=False)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 302:
            location = response.headers.get('Location', '')
            print(f"   Redirect to: {location}")
            
            if 'github.com/login/oauth/authorize' in location:
                print("   ✅ Correctly redirects to GitHub OAuth")
                
                # Parse the redirect URL to check parameters
                parsed = urlparse(location)
                params = parse_qs(parsed.query)
                
                required_params = ['client_id', 'redirect_uri', 'scope', 'state']
                for param in required_params:
                    if param in params:
                        print(f"   ✅ Has {param}: {params[param][0]}")
                    else:
                        print(f"   ❌ Missing {param}")
            else:
                print("   ❌ Does not redirect to GitHub OAuth")
        else:
            print("   ❌ Should return 302 redirect")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 3: Test callback endpoint (without code - should fail)
    print("\n3️⃣ Testing callback endpoint (no code)")
    try:
        response = requests.get(f"{base_url}/api/auth/callback", allow_redirects=False)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 302:
            location = response.headers.get('Location', '')
            print(f"   Redirect to: {location}")
            
            if 'error=no_code' in location:
                print("   ✅ Correctly handles missing code")
            else:
                print("   ❌ Should redirect with error=no_code")
        else:
            print("   ❌ Should return 302 redirect")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 4: Test logout endpoint
    print("\n4️⃣ Testing logout endpoint")
    try:
        response = requests.post(f"{base_url}/api/auth/logout")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        if response.status_code == 200:
            print("   ✅ Logout endpoint works")
            
            # Check if cookies are cleared
            set_cookies = response.headers.get('Set-Cookie', '')
            if 'session_token=' in set_cookies and 'expires=' in set_cookies:
                print("   ✅ Clears session cookies")
            else:
                print("   ⚠️ May not be clearing cookies properly")
        else:
            print("   ❌ Logout should return 200")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 5: Test environment configuration
    print("\n5️⃣ Testing environment configuration")
    
    # Check if .env file exists and has required variables
    env_file = ".env"
    if os.path.exists(env_file):
        print("   ✅ .env file exists")
        
        with open(env_file, 'r') as f:
            env_content = f.read()
        
        required_vars = [
            'GITHUB_CLIENT_ID',
            'GITHUB_CLIENT_SECRET', 
            'GITHUB_REDIRECT_URI'
        ]
        
        for var in required_vars:
            if var in env_content and 'your_' not in env_content.split(f'{var}=')[1].split('\n')[0]:
                print(f"   ✅ {var} is configured")
            else:
                print(f"   ❌ {var} needs to be configured")
    else:
        print("   ❌ .env file not found")
    
    # Step 6: Test Python backend endpoints
    print("\n6️⃣ Testing Python backend endpoints")
    
    # Test session verification endpoint
    try:
        # This should be handled by Vercel routing to Python
        response = requests.get(f"{base_url}/api/verify-session")
        print(f"   Session verify status: {response.status_code}")
        
        if response.status_code == 401:
            print("   ✅ Python session verification works (returns 401 for no session)")
        else:
            print(f"   ⚠️ Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Python backend error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Test Complete")
    print("\n📋 Next Steps:")
    print("1. Configure your GitHub OAuth app with the correct callback URL")
    print("2. Set your environment variables in .env")
    print("3. Test the complete flow by clicking 'Connect with GitHub'")
    print("4. Check browser developer tools for any console errors")

if __name__ == "__main__":
    test_auth_flow()