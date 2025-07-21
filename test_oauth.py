#!/usr/bin/env python3
"""
Test script to verify GitHub OAuth configuration and functionality
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_oauth_config():
    """Test OAuth configuration"""
    print("🔧 Testing OAuth Configuration...")
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI", "https://autodocai.vercel.app/auth/callback")
    
    print(f"✅ GITHUB_CLIENT_ID: {'✓ Set' if client_id else '✗ Missing'}")
    print(f"✅ GITHUB_CLIENT_SECRET: {'✓ Set' if client_secret else '✗ Missing'}")
    print(f"✅ GITHUB_REDIRECT_URI: {redirect_uri}")
    
    if not client_id or not client_secret:
        print("❌ OAuth configuration incomplete!")
        return False
    
    print("✅ OAuth configuration complete!")
    return True

def test_google_ai_config():
    """Test Google AI configuration"""
    print("\n🤖 Testing Google AI Configuration...")
    
    google_api_key = os.getenv("GOOGLE_API_KEY")
    print(f"✅ GOOGLE_API_KEY: {'✓ Set' if google_api_key else '✗ Missing'}")
    
    if google_api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=google_api_key)
            print("✅ Google AI SDK available and configured!")
            return True
        except ImportError:
            print("❌ Google AI SDK not installed!")
            return False
        except Exception as e:
            print(f"❌ Google AI configuration error: {e}")
            return False
    else:
        print("❌ Google AI not configured!")
        return False

def test_github_oauth_url():
    """Test GitHub OAuth URL generation"""
    print("\n🔗 Testing GitHub OAuth URL...")
    
    client_id = os.getenv("GITHUB_CLIENT_ID")
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI", "https://autodocai.vercel.app/auth/callback")
    
    if not client_id:
        print("❌ Cannot generate OAuth URL - missing client ID")
        return False
    
    oauth_url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=repo"
    print(f"✅ OAuth URL: {oauth_url}")
    
    # Test if GitHub OAuth endpoint is accessible
    try:
        response = requests.head("https://github.com/login/oauth/authorize", timeout=5)
        if response.status_code in [200, 302, 405]:  # 405 is expected for HEAD request
            print("✅ GitHub OAuth endpoint accessible!")
            return True
        else:
            print(f"⚠️ GitHub OAuth endpoint returned status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot reach GitHub OAuth endpoint: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 AutoDoc AI - GitHub OAuth Test Suite")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 3
    
    # Test 1: OAuth Configuration
    if test_oauth_config():
        tests_passed += 1
    
    # Test 2: Google AI Configuration
    if test_google_ai_config():
        tests_passed += 1
    
    # Test 3: GitHub OAuth URL
    if test_github_oauth_url():
        tests_passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! GitHub OAuth should work correctly.")
        print("\n📝 Next steps:")
        print("1. Start your development server")
        print("2. Navigate to your app")
        print("3. Click 'Login with GitHub' in the navigation")
        print("4. Complete the OAuth flow")
        print("5. Check that your repositories load correctly")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
    
    return tests_passed == total_tests

if __name__ == "__main__":
    main()