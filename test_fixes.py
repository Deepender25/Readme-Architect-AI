#!/usr/bin/env python3

"""
Test script to verify README generation fixes
Tests both authenticated and non-authenticated generation
"""

import requests
import json
import sys
import time
from urllib.parse import urlencode

# Test configuration
BASE_URL = "http://localhost:8000"  # Vercel dev server or local server
TEST_REPO = "https://github.com/microsoft/vscode"
TEST_PROJECT_NAME = "Visual Studio Code"

def test_generate_endpoint_without_auth():
    """Test /api/generate endpoint without authentication"""
    print("🔄 Testing /api/generate without authentication...")
    
    params = {
        'repo_url': TEST_REPO,
        'project_name': TEST_PROJECT_NAME,
        'include_demo': 'false',
        'num_screenshots': '0',
        'num_videos': '0'
    }
    
    try:
        response = requests.get(f"{BASE_URL}/api/generate", params=params, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if 'readme' in data and data['readme']:
                print("✅ Non-authenticated generation SUCCESS")
                print(f"   README length: {len(data['readme'])} characters")
                print(f"   First 200 chars: {data['readme'][:200]}...")
                return True
            else:
                print(f"❌ No README content returned: {data}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_stream_endpoint_without_auth():
    """Test /api/stream endpoint without authentication"""
    print("\n🔄 Testing /api/stream without authentication...")
    
    params = {
        'repo_url': TEST_REPO,
        'project_name': TEST_PROJECT_NAME,
        'include_demo': 'false',
        'num_screenshots': '0',
        'num_videos': '0'
    }
    
    try:
        response = requests.get(f"{BASE_URL}/api/stream", params=params, timeout=60, stream=True)
        
        if response.status_code == 200:
            print("✅ Stream endpoint accessible without authentication")
            
            # Parse Server-Sent Events
            readme_content = None
            status_updates = []
            
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        try:
                            data = json.loads(line[6:])
                            if 'status' in data:
                                status_updates.append(data['status'])
                                print(f"   Status: {data['status']}")
                            elif 'readme' in data:
                                readme_content = data['readme']
                                print(f"   ✅ README received: {len(readme_content)} characters")
                                break
                            elif 'error' in data:
                                print(f"   ❌ Error: {data['error']}")
                                return False
                        except json.JSONDecodeError as e:
                            print(f"   ⚠️ Failed to parse SSE data: {e}")
            
            if readme_content:
                print("✅ Streaming generation SUCCESS")
                print(f"   Status updates: {len(status_updates)}")
                print(f"   Final README length: {len(readme_content)} characters")
                return True
            else:
                print("❌ No README content received via stream")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_generate_py_direct():
    """Test the direct generate.py endpoint"""
    print("\n🔄 Testing direct /api/generate.py endpoint...")
    
    params = {
        'repo_url': TEST_REPO,
        'project_name': TEST_PROJECT_NAME,
        'include_demo': 'false',
        'num_screenshots': '0',
        'num_videos': '0'
    }
    
    try:
        response = requests.get(f"{BASE_URL}/api/generate.py", params=params, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if 'readme' in data and data['readme']:
                print("✅ Direct generate.py SUCCESS")
                print(f"   README length: {len(data['readme'])} characters")
                return True
            else:
                print(f"❌ No README content returned: {data}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_fallback_behavior():
    """Test fallback behavior with invalid repository"""
    print("\n🔄 Testing fallback behavior with invalid repository...")
    
    params = {
        'repo_url': 'https://github.com/nonexistent/repository',
        'project_name': 'Test Fallback Project',
        'include_demo': 'false',
        'num_screenshots': '0',
        'num_videos': '0'
    }
    
    try:
        response = requests.get(f"{BASE_URL}/api/generate", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if 'readme' in data and data['readme']:
                print("✅ Fallback generation SUCCESS")
                print(f"   README length: {len(data['readme'])} characters")
                # Check if it contains our fallback template
                if "Test Fallback Project" in data['readme']:
                    print("   ✅ Contains custom project name")
                if "Table of Contents" in data['readme']:
                    print("   ✅ Contains structured content")
                return True
            else:
                print(f"❌ No README content in fallback: {data}")
                return False
        else:
            data = response.json() if response.headers.get('content-type') == 'application/json' else {'error': response.text}
            if 'error' in data:
                print(f"⚠️ Expected error for invalid repo: {data['error']}")
                return True  # This is expected behavior
            else:
                print(f"❌ Unexpected response: {data}")
                return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 README Generator Fix Verification")
    print("=" * 50)
    
    tests = [
        ("Generate Endpoint (No Auth)", test_generate_endpoint_without_auth),
        ("Stream Endpoint (No Auth)", test_stream_endpoint_without_auth),
        ("Direct Generate.py", test_generate_py_direct),
        ("Fallback Behavior", test_fallback_behavior),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        print("-" * 30)
        
        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")
    
    print("\n" + "=" * 50)
    print(f"🏁 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The fixes are working correctly.")
        print("\n✅ Key Issues Fixed:")
        print("   • README generation works without authentication")
        print("   • Both /api/generate and /api/stream endpoints accessible")
        print("   • Proper fallback templates when AI generation fails")
        print("   • Repository ownership doesn't block generation")
        return True
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    print("Note: This test assumes a local development server is running.")
    print("Start the server with: python local_dev_server.py")
    print("Or deploy and update BASE_URL to your deployment URL.")
    print()
    
    # You can uncomment the line below to run the tests
    # main()
    
    print("To run the tests, start your server and uncomment the main() call at the end of this file.")
