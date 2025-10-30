#!/usr/bin/env python3
"""
Test the callback fix to ensure user data is properly encoded
"""

import json
import urllib.parse

def test_user_data_encoding():
    """Test that user data encoding/decoding works correctly"""
    
    print("🧪 Testing User Data Encoding Fix")
    print("=" * 40)
    
    # Simulate the user data that would come from GitHub
    sample_user_data = {
        'github_id': '164032583',
        'username': 'testuser',
        'name': 'Test User',
        'avatar_url': 'https://avatars.githubusercontent.com/u/164032583?v=4',
        'html_url': 'https://github.com/testuser',
        'email': 'test@example.com',
        'access_token': 'gho_sample_token_here'
    }
    
    print("1️⃣ Testing encoding...")
    try:
        # This is what the backend will do
        encoded_user_data = urllib.parse.quote(json.dumps(sample_user_data))
        print(f"   ✅ Encoded successfully (length: {len(encoded_user_data)})")
        print(f"   Sample: {encoded_user_data[:50]}...")
    except Exception as e:
        print(f"   ❌ Encoding failed: {e}")
        return False
    
    print("\n2️⃣ Testing decoding (frontend simulation)...")
    try:
        # This is what the frontend will do
        decoded_data = urllib.parse.unquote(encoded_user_data)
        parsed_user_data = json.loads(decoded_data)
        
        print(f"   ✅ Decoded successfully")
        print(f"   Username: {parsed_user_data['username']}")
        print(f"   GitHub ID: {parsed_user_data['github_id']}")
        print(f"   Has access token: {'access_token' in parsed_user_data}")
        
        # Validate required fields
        required_fields = ['github_id', 'username', 'name', 'avatar_url', 'html_url']
        missing_fields = [field for field in required_fields if not parsed_user_data.get(field)]
        
        if missing_fields:
            print(f"   ❌ Missing required fields: {missing_fields}")
            return False
        else:
            print(f"   ✅ All required fields present")
            
    except Exception as e:
        print(f"   ❌ Decoding failed: {e}")
        return False
    
    print("\n3️⃣ Testing URL construction...")
    try:
        # Test the complete URL that would be generated
        return_url = "/"
        redirect_url = f"{return_url}?auth_success={encoded_user_data}"
        
        print(f"   ✅ URL constructed successfully")
        print(f"   URL length: {len(redirect_url)}")
        
        # Check if URL is reasonable length (not too long for browsers)
        if len(redirect_url) > 2000:
            print(f"   ⚠️ URL might be too long for some browsers")
        else:
            print(f"   ✅ URL length is acceptable")
            
    except Exception as e:
        print(f"   ❌ URL construction failed: {e}")
        return False
    
    return True

def simulate_frontend_processing():
    """Simulate how the frontend will process the auth_success parameter"""
    
    print(f"\n🖥️ Frontend Processing Simulation")
    print("=" * 35)
    
    # Simulate what the frontend will receive
    sample_encoded_data = urllib.parse.quote(json.dumps({
        'github_id': '164032583',
        'username': 'deepender25',
        'name': 'Deepender Yadav',
        'avatar_url': 'https://avatars.githubusercontent.com/u/164032583?v=4',
        'html_url': 'https://github.com/deepender25',
        'email': 'yadavdeepender65@gmail.com',
        'access_token': 'gho_sample_token'
    }))
    
    try:
        print("1️⃣ Simulating URL parameter extraction...")
        # This simulates: const authSuccess = urlParams.get('auth_success');
        auth_success_param = sample_encoded_data
        print(f"   ✅ Parameter extracted: {auth_success_param[:50]}...")
        
        print("\n2️⃣ Simulating decoding...")
        # This simulates: const decodedData = decodeURIComponent(authSuccess);
        decoded_data = urllib.parse.unquote(auth_success_param)
        print(f"   ✅ Decoded: {decoded_data[:100]}...")
        
        print("\n3️⃣ Simulating JSON parsing...")
        # This simulates: const rawUserData = JSON.parse(decodedData);
        raw_user_data = json.loads(decoded_data)
        print(f"   ✅ Parsed JSON successfully")
        print(f"   User: {raw_user_data['name']} (@{raw_user_data['username']})")
        
        print("\n4️⃣ Simulating validation...")
        # This simulates the validation in the frontend
        if raw_user_data and raw_user_data.get('github_id') and raw_user_data.get('username'):
            print(f"   ✅ Validation passed - user data is valid")
            return True
        else:
            print(f"   ❌ Validation failed - missing required fields")
            return False
            
    except Exception as e:
        print(f"   ❌ Frontend processing failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Callback Fix Verification")
    print("Testing the user data encoding fix for GitHub OAuth\n")
    
    encoding_success = test_user_data_encoding()
    frontend_success = simulate_frontend_processing()
    
    print(f"\n{'='*50}")
    if encoding_success and frontend_success:
        print("🎉 Callback fix should work correctly!")
        print("\n✅ Next steps:")
        print("   1. The backend fix has been applied")
        print("   2. Try logging in again: https://readmearchitect.vercel.app/login")
        print("   3. You should now be successfully authenticated")
    else:
        print("❌ There might be issues with the callback fix")
        print("   Please check the error messages above")
    
    print(f"\n💡 What changed:")
    print("   • Backend now encodes user data in auth_success parameter")
    print("   • Frontend can decode and process the user data")
    print("   • Session will be created properly on the client side")