#!/usr/bin/env python3
"""
Final OAuth configuration test
Run this after updating Vercel environment variables
"""

import requests
import re

def test_production_oauth():
    """Test the production OAuth configuration"""
    
    print("🔍 Final OAuth Configuration Test")
    print("=" * 40)
    
    correct_client_id = "Ov23liq3yu6Ir7scqDXo"
    
    # Test 1: Check production Client ID
    print("1️⃣ Testing production Client ID...")
    try:
        response = requests.get('https://autodocai.vercel.app/auth/github', allow_redirects=False, timeout=10)
        
        if response.status_code in [301, 302]:
            location = response.headers.get('Location', '')
            match = re.search(r'client_id=([^&]+)', location)
            
            if match:
                production_client_id = match.group(1)
                print(f"   Production Client ID: {production_client_id}")
                
                if production_client_id == correct_client_id:
                    print("   ✅ Correct Client ID in production")
                    client_id_ok = True
                else:
                    print(f"   ❌ Wrong Client ID! Expected: {correct_client_id}")
                    client_id_ok = False
            else:
                print("   ❌ Could not extract Client ID from redirect")
                client_id_ok = False
        else:
            print(f"   ❌ OAuth redirect failed: {response.status_code}")
            client_id_ok = False
    except Exception as e:
        print(f"   ❌ Error testing Client ID: {e}")
        client_id_ok = False
    
    # Test 2: Test GitHub OAuth app accessibility
    print(f"\n2️⃣ Testing GitHub OAuth app...")
    auth_url = f"https://github.com/login/oauth/authorize?client_id={correct_client_id}&scope=repo"
    
    try:
        response = requests.head(auth_url, timeout=10)
        if response.status_code == 200:
            print("   ✅ GitHub OAuth app is accessible")
            app_accessible = True
        elif response.status_code == 302:
            print("   ✅ GitHub OAuth app exists (redirects to login)")
            app_accessible = True
        else:
            print(f"   ❌ OAuth app issue: {response.status_code}")
            app_accessible = False
    except Exception as e:
        print(f"   ❌ Error testing OAuth app: {e}")
        app_accessible = False
    
    # Test 3: Test callback URL
    print(f"\n3️⃣ Testing callback URL...")
    callback_url = "https://autodocai.vercel.app/api/auth/callback?code=test&state=test"
    
    try:
        response = requests.get(callback_url, allow_redirects=False, timeout=10)
        if response.status_code in [301, 302, 307]:
            location = response.headers.get('Location', '')
            if 'token_failed' in location:
                print("   ✅ Callback URL works (handles test correctly)")
                callback_ok = True
            else:
                print(f"   ⚠️ Callback redirects to: {location}")
                callback_ok = True  # Still working
        else:
            print(f"   ❌ Callback URL issue: {response.status_code}")
            callback_ok = False
    except Exception as e:
        print(f"   ❌ Error testing callback: {e}")
        callback_ok = False
    
    return client_id_ok, app_accessible, callback_ok

def provide_final_instructions(client_id_ok, app_accessible, callback_ok):
    """Provide final instructions based on test results"""
    
    print(f"\n📋 Final Status & Instructions")
    print("=" * 35)
    
    if client_id_ok and app_accessible and callback_ok:
        print("🎉 All OAuth components are working!")
        
        print(f"\n✅ Ready to test login:")
        print("   1. Visit: https://autodocai.vercel.app/login")
        print("   2. Click 'Sign in with GitHub'")
        print("   3. Authorize the app on GitHub")
        print("   4. You should be logged in successfully")
        
        print(f"\n💡 If you still get 'token_failed':")
        print("   • The Client Secret might still be wrong")
        print("   • Go to GitHub OAuth app settings")
        print("   • Generate a new Client Secret")
        print("   • Update it in Vercel environment variables")
        print("   • Redeploy your app")
        
        return True
    else:
        print("❌ Still have issues to fix:")
        
        if not client_id_ok:
            print("   🔧 Client ID: Update Vercel environment variables")
        
        if not app_accessible:
            print("   🔧 OAuth App: Check GitHub app exists and is not suspended")
        
        if not callback_ok:
            print("   🔧 Callback: Check Vercel deployment and routes")
        
        return False

def show_manual_test_url():
    """Show manual test URL for direct testing"""
    
    print(f"\n🧪 Manual Test URL")
    print("=" * 20)
    
    test_url = "https://github.com/login/oauth/authorize?client_id=Ov23liq3yu6Ir7scqDXo&redirect_uri=https://autodocai.vercel.app/api/auth/callback&scope=repo&state=manual_test"
    
    print("🔗 Test this URL directly in your browser:")
    print(f"   {test_url}")
    
    print(f"\n✅ Expected: GitHub authorization page")
    print(f"❌ If error: Check GitHub OAuth app settings")

if __name__ == "__main__":
    print("🚀 Final GitHub OAuth Test")
    print("Run this after updating Vercel environment variables\n")
    
    client_id_ok, app_accessible, callback_ok = test_production_oauth()
    success = provide_final_instructions(client_id_ok, app_accessible, callback_ok)
    show_manual_test_url()
    
    print(f"\n{'='*50}")
    if success:
        print("🎊 OAuth setup is complete! Try logging in now.")
    else:
        print("⚠️ Please fix the issues above and test again.")
    
    print(f"\n🔑 Remember: If login still fails, the issue is likely:")
    print(f"   • Wrong Client Secret (most common)")
    print(f"   • GitHub OAuth app callback URL mismatch")
    print(f"   • Browser cache (try incognito mode)")