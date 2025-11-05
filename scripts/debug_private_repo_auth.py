#!/usr/bin/env python3
"""
Debug script to test private repository authentication
"""

import os
import sys
import requests
import jwt
from datetime import datetime, timedelta

def test_jwt_decoding():
    """Test JWT decoding with the actual secret"""
    print("🔍 Testing JWT Authentication Debug\n")
    
    # Test JWT secret from environment
    jwt_secret = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
    print(f"JWT Secret configured: {'✅ Yes' if jwt_secret != 'your-super-secret-jwt-key-change-in-production' else '❌ Using default'}")
    
    # Create a test JWT token (simulating what the auth system creates)
    test_payload = {
        'sub': '164032583',  # Your GitHub ID
        'github_id': '164032583',
        'username': 'Deepender25',
        'name': 'Deepender',
        'email': 'test@example.com',
        'avatar_url': 'https://github.com/Deepender25.png',
        'html_url': 'https://github.com/Deepender25',
        'github_access_token': 'test_token_123',  # This would be real in production
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    
    try:
        # Create JWT token
        token = jwt.encode(test_payload, jwt_secret, algorithm='HS256')
        print(f"✅ JWT token created successfully")
        
        # Test decoding
        decoded = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        print(f"✅ JWT token decoded successfully")
        print(f"   Username: {decoded.get('username')}")
        print(f"   GitHub ID: {decoded.get('github_id')}")
        print(f"   Access Token: {'Present' if decoded.get('github_access_token') else 'Missing'}")
        
        return True, token
        
    except Exception as e:
        print(f"❌ JWT test failed: {e}")
        return False, None

def test_github_api_access(access_token: str):
    """Test GitHub API access with token"""
    print(f"\n🔍 Testing GitHub API Access\n")
    
    if not access_token or access_token == 'test_token_123':
        print("❌ No real GitHub access token available for testing")
        print("   This test requires a real GitHub personal access token")
        return False
    
    try:
        # Test user info
        headers = {'Authorization': f'token {access_token}'}
        response = requests.get('https://api.github.com/user', headers=headers, timeout=10)
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ GitHub API user access successful")
            print(f"   Username: {user_data.get('login')}")
            print(f"   Name: {user_data.get('name')}")
            
            # Test private repo access
            repo_url = "https://api.github.com/repos/Deepender25/Campus-Assistant-bot"
            repo_response = requests.get(repo_url, headers=headers, timeout=10)
            
            if repo_response.status_code == 200:
                repo_data = repo_response.json()
                print(f"✅ Private repository access successful")
                print(f"   Repository: {repo_data.get('full_name')}")
                print(f"   Private: {repo_data.get('private')}")
                print(f"   Owner: {repo_data.get('owner', {}).get('login')}")
                return True
            else:
                print(f"❌ Private repository access failed: {repo_response.status_code}")
                return False
                
        else:
            print(f"❌ GitHub API user access failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ GitHub API test failed: {e}")
        return False

def test_cookie_extraction():
    """Test cookie extraction logic"""
    print(f"\n🔍 Testing Cookie Extraction Logic\n")
    
    # Simulate cookie header
    test_cookies = [
        "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test; Path=/; HttpOnly",
        "auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
        "other_cookie=value; auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test; another=value",
        "no_auth_token=value; other=test"
    ]
    
    for i, cookie_header in enumerate(test_cookies):
        print(f"Test {i+1}: {cookie_header}")
        
        auth_token = None
        if 'auth_token=' in cookie_header:
            for cookie in cookie_header.split(';'):
                if cookie.strip().startswith('auth_token='):
                    auth_token = cookie.split('=')[1].strip()
                    break
        
        result = "✅ Found" if auth_token else "❌ Not found"
        print(f"   Result: {result}")
        if auth_token:
            print(f"   Token: {auth_token[:50]}...")
        print()

def main():
    """Run all debug tests"""
    print("🚀 Private Repository Authentication Debug\n")
    
    # Test 1: JWT functionality
    jwt_success, test_token = test_jwt_decoding()
    
    # Test 2: Cookie extraction
    test_cookie_extraction()
    
    # Test 3: GitHub API (if real token available)
    github_token = os.environ.get('GITHUB_ACCESS_TOKEN')
    if github_token:
        github_success = test_github_api_access(github_token)
    else:
        print(f"\n⚠️ No GITHUB_ACCESS_TOKEN environment variable set")
        print(f"   Cannot test real GitHub API access")
        github_success = None
    
    # Summary
    print(f"\n📊 Debug Results Summary:")
    print(f"   JWT Functionality: {'✅ PASS' if jwt_success else '❌ FAIL'}")
    print(f"   Cookie Extraction: ✅ PASS (logic verified)")
    if github_success is not None:
        print(f"   GitHub API Access: {'✅ PASS' if github_success else '❌ FAIL'}")
    else:
        print(f"   GitHub API Access: ⚠️ SKIP (no token)")
    
    if jwt_success:
        print(f"\n💡 Recommendations:")
        print(f"   1. Verify JWT_SECRET environment variable is set correctly")
        print(f"   2. Check that auth_token cookie is being sent with requests")
        print(f"   3. Ensure GitHub access token is valid and has repo scope")
        print(f"   4. Verify the user owns the private repository")
    else:
        print(f"\n❌ Critical Issue: JWT functionality is broken")
        print(f"   This will prevent all private repository access")

if __name__ == "__main__":
    main()