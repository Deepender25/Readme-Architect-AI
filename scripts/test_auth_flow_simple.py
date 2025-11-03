#!/usr/bin/env python3
"""
Simple test for the new auth system
"""

import requests
import os
import sys

def load_env_file():
    """Load environment variables from .env file"""
    env_file = '.env'
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

def test_auth_endpoints():
    """Test the auth endpoints"""
    
    print("🧪 Testing Auth Endpoints")
    print("=" * 40)
    
    # Use localhost for testing
    base_url = "http://localhost:3000"
    
    # Test debug endpoint
    print("\n1. Testing debug endpoint...")
    try:
        response = requests.get(f"{base_url}/api/auth/debug", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Debug endpoint working")
            print(f"   📊 Environment check: {data.get('envCheck', {})}")
            print(f"   🔐 JWT test: {data.get('jwtTest', {})}")
        else:
            print(f"   ❌ Debug endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Could not reach debug endpoint: {e}")
        print("   💡 Make sure your development server is running (npm run dev)")
    
    # Test GitHub auth endpoint
    print("\n2. Testing GitHub auth endpoint...")
    try:
        response = requests.get(f"{base_url}/api/auth/github", allow_redirects=False, timeout=10)
        if response.status_code == 302:
            location = response.headers.get('Location', '')
            if 'github.com/login/oauth/authorize' in location:
                print("   ✅ GitHub auth redirect working")
                print(f"   🔗 Redirects to: {location[:80]}...")
            else:
                print(f"   ❌ Unexpected redirect: {location}")
        else:
            print(f"   ❌ GitHub auth failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Could not reach GitHub auth endpoint: {e}")
    
    # Test verify endpoint (should return 401 without auth)
    print("\n3. Testing verify endpoint...")
    try:
        response = requests.get(f"{base_url}/api/auth/verify", timeout=10)
        if response.status_code == 401:
            print("   ✅ Verify endpoint correctly returns 401 without auth")
        else:
            print(f"   ❌ Unexpected verify response: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Could not reach verify endpoint: {e}")
    
    print("\n✅ Auth endpoint tests complete!")
    print("\n🚀 To test the full flow:")
    print("1. Start your dev server: npm run dev")
    print("2. Visit: http://localhost:3000/login")
    print("3. Click 'Login with GitHub'")
    print("4. Complete OAuth flow")
    print("5. Check that you're logged in")

if __name__ == "__main__":
    load_env_file()
    test_auth_endpoints()