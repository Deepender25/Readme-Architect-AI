#!/usr/bin/env python3
"""
Live Authentication Flow Test Script
Tests the GitHub OAuth authentication flow on the live Vercel deployment
"""

import requests
import os
import sys
from urllib.parse import urlparse, parse_qs
import json

def test_live_auth_flow():
    """Test the authentication flow on the live site"""
    
    print("🧪 Testing Live GitHub OAuth Flow")
    print("=" * 60)
    
    # Live site URL
    base_url = "https://readmearchitect.vercel.app"
    
    print(f"📍 Testing live site: {base_url}")
    
    # Step 1: Test if the site is accessible
    print("\n1️⃣ Testing site accessibility")
    try:
        response = requests.get(base_url, timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Site is accessible")
        else:
            print("   ❌ Site is not accessible")
            return
    except Exception as e:
        print(f"   ❌ Error accessing site: {e}")
        return
    
    # Step 2: Test auth verification endpoint (should fail when not authenticated)
    print("\n2️⃣ Testing auth verification endpoint (unauthenticated)")
    try:
        response = requests.get(f"{base_url}/api/auth/verify", timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 401:
            try:
                data = response.json()
                print(f"   Response: {data}")
                if data.get('authenticated') == False:
                    print("   ✅ Correctly returns 401 with authenticated=false")
                else:
                    print("   ⚠️ Returns 401 but response format may be incorrect")
            except:
                print("   ⚠️ Returns 401 but response is not JSON")
        else:
            print("   ❌ Should return 401 for unauthenticated user")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 3: Test GitHub auth redirect
    print("\n3️⃣ Testing GitHub auth redirect")
    try:
        response = requests.get(f"{base_url}/api/auth/github", allow_redirects=False, timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 302:
            location = response.headers.get('Location', '')
            print(f"   Redirect to: {location[:100]}...")
            
            if 'github.com/login/oauth/authorize' in location:
                print("   ✅ Correctly redirects to GitHub OAuth")
                
                # Parse the redirect URL to check parameters
                parsed = urlparse(location)
                params = parse_qs(parsed.query)
                
                required_params = ['client_id', 'redirect_uri', 'scope', 'state']
                for param in required_params:
                    if param in params:
                        value = params[param][0]
                        if param == 'redirect_uri':
                            if 'readmearchitect.vercel.app/api/auth/callback' in value:
                                print(f"   ✅ {param}: {value}")
                            else:
                                print(f"   ❌ {param} incorrect: {value}")
                        else:
                            print(f"   ✅ Has {param}: {value}")
                    else:
                        print(f"   ❌ Missing {param}")
            else:
                print("   ❌ Does not redirect to GitHub OAuth")
        else:
            print("   ❌ Should return 302 redirect")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 4: Test callback endpoint (without code - should fail gracefully)
    print("\n4️⃣ Testing callback endpoint (no code)")
    try:
        response = requests.get(f"{base_url}/api/auth/callback", allow_redirects=False, timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 302:
            location = response.headers.get('Location', '')
            print(f"   Redirect to: {location}")
            
            if 'error=' in location:
                print("   ✅ Correctly handles missing code with error redirect")
            else:
                print("   ⚠️ Redirects but may not handle error properly")
        else:
            print("   ⚠️ May not handle missing code properly")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 5: Test logout endpoint
    print("\n5️⃣ Testing logout endpoint")
    try:
        response = requests.post(f"{base_url}/api/auth/logout", timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"   Response: {data}")
                print("   ✅ Logout endpoint works")
            except:
                print("   ⚠️ Logout works but response may not be JSON")
        else:
            print("   ❌ Logout should return 200")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Step 6: Test protected routes (should redirect to login)
    print("\n6️⃣ Testing protected routes")
    protected_routes = ['/repositories', '/history', '/settings']
    
    for route in protected_routes:
        try:
            response = requests.get(f"{base_url}{route}", allow_redirects=False, timeout=10)
            print(f"   {route}: Status {response.status_code}")
            
            if response.status_code == 302:
                location = response.headers.get('Location', '')
                if '/login' in location:
                    print(f"   ✅ Correctly redirects to login")
                else:
                    print(f"   ⚠️ Redirects to: {location}")
            elif response.status_code == 200:
                print(f"   ⚠️ Should redirect unauthenticated users")
            else:
                print(f"   ⚠️ Unexpected status")
        except Exception as e:
            print(f"   ❌ Error testing {route}: {e}")
    
    # Step 7: Test Python backend endpoints
    print("\n7️⃣ Testing Python backend endpoints")
    
    # Test session verification endpoint
    try:
        response = requests.get(f"{base_url}/api/verify-session", timeout=10)
        print(f"   Session verify status: {response.status_code}")
        
        if response.status_code == 401:
            try:
                data = response.json()
                if data.get('authenticated') == False:
                    print("   ✅ Python session verification works correctly")
                else:
                    print("   ⚠️ Returns 401 but format may be incorrect")
            except:
                print("   ⚠️ Returns 401 but response is not JSON")
        else:
            print(f"   ⚠️ Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Python backend error: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Live Test Complete")
    
    print("\n📋 Manual Testing Steps:")
    print("1. Visit: https://readmearchitect.vercel.app")
    print("2. Click 'Connect with GitHub' button")
    print("3. Complete GitHub OAuth flow")
    print("4. Verify you're logged in (should see your avatar)")
    print("5. Try accessing /repositories or /history")
    print("6. Test logout functionality")
    
    print("\n🔧 If login still fails:")
    print("1. Check GitHub OAuth app settings")
    print("2. Verify callback URL: https://readmearchitect.vercel.app/api/auth/callback")
    print("3. Check environment variables in Vercel dashboard")
    print("4. Look at browser developer tools for errors")

if __name__ == "__main__":
    test_live_auth_flow()