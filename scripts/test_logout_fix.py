#!/usr/bin/env python3
"""
Test the logout functionality to ensure it works correctly
"""

import requests

def test_logout_api():
    """Test the logout API endpoint"""
    
    print("🧪 Testing Logout API Endpoint")
    print("=" * 35)
    
    # Test POST request to logout endpoint
    print("1️⃣ Testing POST /api/auth/logout...")
    try:
        response = requests.post('https://readmearchitect.vercel.app/api/auth/logout', 
                               headers={'Content-Type': 'application/json'},
                               timeout=10)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("   ✅ Logout API works correctly")
                print(f"   Message: {data.get('message', 'No message')}")
                return True
            else:
                print(f"   ❌ Logout failed: {data}")
                return False
        else:
            print(f"   ❌ HTTP error: {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"   ❌ Network error: {e}")
        return False

def test_logout_redirect():
    """Test that logout doesn't cause redirect issues"""
    
    print(f"\n2️⃣ Testing logout redirect behavior...")
    
    # Test GET request (should also work)
    try:
        response = requests.get('https://readmearchitect.vercel.app/api/auth/logout', 
                              allow_redirects=False,
                              timeout=10)
        
        print(f"   GET Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ GET logout works")
        elif response.status_code in [301, 302, 307]:
            location = response.headers.get('Location', 'No location')
            print(f"   ⚠️ GET logout redirects to: {location}")
        else:
            print(f"   ❌ GET logout failed: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error testing GET logout: {e}")

def check_for_routing_issues():
    """Check for common routing issues that might cause 404s"""
    
    print(f"\n3️⃣ Checking for routing issues...")
    
    # Test various logout-related URLs that might be causing issues
    test_urls = [
        '/api/auth/logout',
        '/api/sessions/revoke',
        '/sessions/revoke',
        '/logout'
    ]
    
    for url in test_urls:
        try:
            full_url = f'https://readmearchitect.vercel.app{url}'
            response = requests.get(full_url, allow_redirects=False, timeout=5)
            
            if response.status_code == 404:
                print(f"   ❌ {url} → 404 (Not Found)")
            elif response.status_code == 200:
                print(f"   ✅ {url} → 200 (OK)")
            elif response.status_code in [301, 302, 307]:
                print(f"   ↗️ {url} → {response.status_code} (Redirect)")
            else:
                print(f"   ⚠️ {url} → {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {url} → Error: {e}")

def provide_logout_fix_summary():
    """Provide summary of logout fixes"""
    
    print(f"\n🔧 Logout Fix Summary")
    print("=" * 25)
    
    print("✅ Changes made:")
    print("   • Removed problematic session revocation API call")
    print("   • Simplified logout to only clear cookies and redirect")
    print("   • Added better logging for debugging")
    print("   • Fixed potential URL construction issues")
    
    print(f"\n🎯 Expected behavior after fix:")
    print("   1. Click 'Sign Out' button")
    print("   2. User state cleared immediately")
    print("   3. Server-side logout API called")
    print("   4. Cookies cleared")
    print("   5. Redirect to home page (/)")
    print("   6. User sees logged-out state")
    
    print(f"\n💡 If logout still doesn't work:")
    print("   • Check browser console for JavaScript errors")
    print("   • Try clearing browser cache and cookies")
    print("   • Test in incognito/private browsing mode")
    print("   • Check if there are any browser extensions blocking requests")

if __name__ == "__main__":
    print("🚀 Logout Functionality Test")
    print("Testing the logout fix to ensure proper behavior\n")
    
    api_works = test_logout_api()
    test_logout_redirect()
    check_for_routing_issues()
    provide_logout_fix_summary()
    
    print(f"\n{'='*50}")
    if api_works:
        print("🎉 Logout API is working correctly!")
        print("The logout button should now work properly.")
    else:
        print("⚠️ There might still be issues with the logout API.")
        print("Check the error messages above for details.")
    
    print(f"\n🔄 Next steps:")
    print("   1. Build and deploy the changes")
    print("   2. Test logout button in the browser")
    print("   3. Verify you're redirected to home page after logout")