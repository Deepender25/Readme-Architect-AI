#!/usr/bin/env python3
"""
Verify that the GitHub login fix is working
Run this after updating Vercel environment variables
"""

import requests
import re
import time

def verify_github_login_fix():
    """Verify that the GitHub OAuth configuration is now correct"""
    
    print("🔍 Verifying GitHub Login Fix")
    print("=" * 40)
    
    correct_client_id = "Ov23liq3yu6Ir7scqDXo"
    
    print(f"Expected Client ID: {correct_client_id}")
    print("Testing production environment...")
    
    try:
        # Test the production OAuth redirect
        response = requests.get('https://readmearchitect.vercel.app/auth/github', allow_redirects=False, timeout=10)
        
        if response.status_code in [301, 302]:
            location = response.headers.get('Location', '')
            print(f"\n✅ OAuth redirect is working")
            print(f"Redirect URL: {location[:100]}...")
            
            # Extract client_id from the URL
            match = re.search(r'client_id=([^&]+)', location)
            if match:
                production_client_id = match.group(1)
                print(f"\nProduction Client ID: {production_client_id}")
                
                if production_client_id == correct_client_id:
                    print("🎉 SUCCESS! Production is now using the correct Client ID!")
                    print("\n✅ GitHub login should now work properly")
                    
                    # Test the full OAuth URL
                    if 'github.com/login/oauth/authorize' in location:
                        print("✅ Redirects to GitHub OAuth correctly")
                    
                    if 'readmearchitect.vercel.app/api/auth/callback' in location:
                        print("✅ Callback URL is correct")
                    
                    return True
                else:
                    print(f"❌ STILL WRONG! Production is using: {production_client_id}")
                    print(f"   Expected: {correct_client_id}")
                    print("\n🔧 You need to:")
                    print("   1. Update GITHUB_CLIENT_ID in Vercel environment variables")
                    print("   2. Redeploy your application")
                    print("   3. Wait for deployment to complete")
                    return False
            else:
                print("❌ Could not extract client_id from redirect URL")
                return False
        else:
            print(f"❌ OAuth redirect failed: {response.status_code}")
            if response.text:
                print(f"Response: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Error testing OAuth: {e}")
        return False

def test_login_flow():
    """Test the complete login flow"""
    
    print(f"\n🧪 Testing Complete Login Flow")
    print("=" * 35)
    
    steps = [
        ("Login page", "https://readmearchitect.vercel.app/login"),
        ("OAuth redirect", "https://readmearchitect.vercel.app/auth/github"),
        ("API callback", "https://readmearchitect.vercel.app/api/auth/callback?code=test&state=test")
    ]
    
    for step_name, url in steps:
        try:
            response = requests.get(url, allow_redirects=False, timeout=10)
            if response.status_code == 200:
                print(f"✅ {step_name}: OK ({response.status_code})")
            elif response.status_code in [301, 302, 307]:
                location = response.headers.get('Location', 'No location')
                print(f"✅ {step_name}: Redirects correctly ({response.status_code})")
                if step_name == "API callback" and "error=" in location:
                    print(f"   → Correctly handles test callback with error")
            else:
                print(f"⚠️ {step_name}: {response.status_code}")
        except Exception as e:
            print(f"❌ {step_name}: Error - {e}")

def provide_next_steps(success):
    """Provide next steps based on test results"""
    
    print(f"\n📋 Next Steps")
    print("=" * 15)
    
    if success:
        print("🎉 Your GitHub login should now be working!")
        print("\n✅ To test manually:")
        print("   1. Visit: https://readmearchitect.vercel.app/login")
        print("   2. Click 'Sign in with GitHub'")
        print("   3. You should be redirected to GitHub")
        print("   4. After authorizing, you should be logged in")
        
        print("\n💡 If you still have issues:")
        print("   • Clear browser cache and cookies")
        print("   • Try incognito/private browsing")
        print("   • Check browser console for errors")
    else:
        print("❌ GitHub login is still not working")
        print("\n🔧 Required actions:")
        print("   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables")
        print("   2. Update GITHUB_CLIENT_ID to: Ov23liq3yu6Ir7scqDXo")
        print("   3. Redeploy your application")
        print("   4. Run this script again to verify")
        
        print("\n📞 If you need help:")
        print("   • Check that you saved the environment variable correctly")
        print("   • Verify the deployment completed successfully")
        print("   • Make sure you're updating the production environment")

if __name__ == "__main__":
    print("🚀 GitHub Login Fix Verification")
    print("This script checks if your GitHub OAuth fix is working\n")
    
    success = verify_github_login_fix()
    test_login_flow()
    provide_next_steps(success)
    
    if success:
        print(f"\n🎊 Congratulations! Your GitHub login fix is complete!")
    else:
        print(f"\n⚠️ Please follow the steps above to complete the fix.")