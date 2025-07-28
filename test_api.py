#!/usr/bin/env python3
"""
Test script to verify the README generation API endpoint is working correctly.
"""

import requests
import json
import sys
import os
from urllib.parse import urlencode

def test_generate_api(base_url="http://localhost:8000", repo_url="https://github.com/fastapi/fastapi"):
    """Test the README generation API endpoint"""
    print(f"🧪 Testing README generation API with repository: {repo_url}")
    
    # Build query parameters
    params = {
        'repo_url': repo_url,
        'project_name': 'Test Project',
        'include_demo': 'true',
        'num_screenshots': 1,
        'num_videos': 1
    }
    
    url = f"{base_url}/api/generate?{urlencode(params)}"
    print(f"📡 Making request to: {url}")
    
    try:
        response = requests.get(url, timeout=60)  # Longer timeout for generation
        print(f"📡 Response status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'readme' in data:
                readme_length = len(data['readme'])
                print(f"✅ README generated successfully! Length: {readme_length} characters")
                print("\n--- First 500 characters of README ---")
                print(data['readme'][:500] + "...")
                return True
            else:
                print(f"❌ API response missing 'readme' field: {data}")
                return False
        else:
            print(f"❌ API request failed with status code: {response.status_code}")
            try:
                print(f"Error response: {response.json()}")
            except:
                print(f"Raw response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Exception during API request: {str(e)}")
        return False

if __name__ == "__main__":
    # Use command line argument for repo URL if provided
    repo_url = sys.argv[1] if len(sys.argv) > 1 else "https://github.com/fastapi/fastapi"
    
    # Use environment variable for base URL if provided
    base_url = os.environ.get("API_BASE_URL", "http://localhost:8000")
    
    success = test_generate_api(base_url, repo_url)
    sys.exit(0 if success else 1)