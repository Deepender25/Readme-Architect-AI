#!/usr/bin/env python3
"""
Test script to verify the authentication flow is working correctly.
This script will help identify issues with the login/logout system.
"""

import requests
import json
import sys
from urllib.parse import urlparse, parse_qs

def test_auth_flow(base_url="https://readmearchitect.vercel.app"):
    """Test the complete authentication flow"""
    
    print(f"🧪 Testing authentication flow for: {base_url}")
    print("=" * 60)
    
    # Test 1: Check if the login page loads
    print("\n1️⃣ Testing login page...")
    try:
        response = requests.get(f"{base_url}/login")
        if response.status_code == 200:
            print("✅ Login page loads successfully")
        else:
            print(f"❌ Login page failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Login page error: {e}")
        return False
    
    # Test 2: Check GitHub OAuth redirect
    print("\n2️⃣ Testing GitHub OAuth redirect...")
    try:
        response = requests.get(f"{base_url}/auth/github", allow_redirects=False)
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code in [302, 301]:
            location = response.headers.get('Location', '')
            if 'github.com/login/oauth/authorize' in location:
                print("✅ GitHub OAuth redirect works")
                print(f"   Redirect URL: {location[:100]}...")
            else:
                print(f"❌ Invalid redirect URL: {location}")
                return False
        elif response.status_code == 307:
            location = response.headers.get('Location', '')
            print(f"⚠️ Temporary redirect (307) to: {location}")
            # Follow the 307 redirect to see where it goes
            if location:
                print("   Following 307 redirect...")
                response2 = requests.get(location, allow_redirects=False)
                print(f"   Second response status: {response2.status_code}")
                if response2.status_code in [302, 301]:
                    final_location = response2.headers.get('Location', '')
                    if 'github.com/login/oauth/authorize' in final_location:
                        print("✅ GitHub OAuth redirect works (after 307)")
                        print(f"   Final redirect URL: {final_location[:100]}...")
                    else:
                        print(f"❌ Invalid final redirect URL: {final_location}")
                        return False
        else:
            print(f"❌ OAuth redirect failed: {response.status_code}")
            if response.text:
                print(f"   Response body: {response.text[:200]}...")
            return False
    except Exception as e:
        print(f"❌ OAuth redirect error: {e}")
        return False
    
    # Test 3: Check protected routes (should redirect to login)
    print("\n3️⃣ Testing protected routes...")
    protected_routes = ['/repositories', '/history', '/settings']
    
    for route in protected_routes:
        try:
            response = requests.get(f"{base_url}{route}", allow_redirects=False)
            if response.status_code in [302, 301]:
                location = response.headers.get('Location', '')
                if '/login' in location:
                    print(f"✅ {route} correctly redirects to login")
                else:
                    print(f"❌ {route} redirects to wrong location: {location}")
            else:
                print(f"⚠️ {route} returned: {response.status_code}")
        except Exception as e:
            print(f"❌ Error testing {route}: {e}")
    
    # Test 4: Check API endpoints
    print("\n4️⃣ Testing API endpoints...")
    api_endpoints = ['/api/repositories', '/api/history']
    
    for endpoint in api_endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 401:
                print(f"✅ {endpoint} correctly returns 401 (unauthorized)")
            else:
                print(f"⚠️ {endpoint} returned: {response.status_code}")
                if response.status_code == 200:
                    print("   This might indicate an authentication bypass!")
        except Exception as e:
            print(f"❌ Error testing {endpoint}: {e}")
    
    # Test 5: Check logout endpoint
    print("\n5️⃣ Testing logout endpoint...")
    try:
        response = requests.post(f"{base_url}/api/auth/logout")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Logout endpoint works")
            else:
                print(f"❌ Logout failed: {data}")
        else:
            print(f"❌ Logout endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Logout endpoint error: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Authentication flow test completed!")
    print("\nIf you see any ❌ errors above, those need to be fixed.")
    print("If you see ⚠️ warnings, those might need investigation.")
    
    return True

def test_cookie_handling():
    """Test cookie handling specifically"""
    print("\n🍪 Testing cookie handling...")
    print("=" * 40)
    
    # This would require a real authentication token to test properly
    print("ℹ️ Cookie handling test requires manual verification:")
    print("1. Login to the application")
    print("2. Check browser dev tools for cookies")
    print("3. Verify cookies persist across page reloads")
    print("4. Test logout clears all cookies")

if __name__ == "__main__":
    base_url = sys.argv[1] if len(sys.argv) > 1 else "https://readmearchitect.vercel.app"
    
    print("🚀 ReadmeArchitect Authentication Test Suite")
    print(f"Testing: {base_url}")
    
    success = test_auth_flow(base_url)
    test_cookie_handling()
    
    if success:
        print("\n✅ Basic authentication flow appears to be working!")
    else:
        print("\n❌ Authentication flow has issues that need to be fixed!")
        sys.exit(1)