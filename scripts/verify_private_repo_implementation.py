#!/usr/bin/env python3
"""
Verification script for private repository support implementation.
This script checks that all necessary changes have been made.
"""

import os
import re

def check_file_changes():
    """Check that all required files have been updated"""
    
    print("🔍 Verifying Private Repository Implementation")
    print("=" * 50)
    
    files_to_check = [
        'api/index.py',
        'api/generate.py', 
        'api/stream.py'
    ]
    
    all_checks_passed = True
    
    for file_path in files_to_check:
        print(f"\n📁 Checking {file_path}...")
        
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            all_checks_passed = False
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check 1: download_repo method has access_token parameter
        if 'def download_repo(self, repo_url: str, access_token: str = None):' in content:
            print(f"✅ download_repo method enhanced with access_token parameter")
        else:
            print(f"❌ download_repo method missing access_token parameter")
            all_checks_passed = False
        
        # Check 2: Authentication headers are prepared
        if "headers['Authorization'] = f'token {access_token}'" in content:
            print(f"✅ Authentication headers prepared correctly")
        else:
            print(f"❌ Authentication headers not found")
            all_checks_passed = False
        
        # Check 3: Enhanced error messages for 404
        if "Repository not found or you don't have access to this private repository" in content:
            print(f"✅ Enhanced 404 error message for authenticated users")
        else:
            print(f"❌ Enhanced 404 error message missing")
            all_checks_passed = False
        
        # Check 4: Enhanced error messages for unauthenticated users
        if "If this is a private repository, please make sure you're logged in" in content:
            print(f"✅ Enhanced 404 error message for unauthenticated users")
        else:
            print(f"❌ Enhanced 404 error message for unauthenticated users missing")
            all_checks_passed = False
        
        # Check 5: 401 error handling
        if "Authentication failed. Please log in again to access private repositories" in content:
            print(f"✅ 401 authentication error handling")
        else:
            print(f"❌ 401 authentication error handling missing")
            all_checks_passed = False
        
        # Check 6: User authentication extraction (for generate.py and stream.py)
        if file_path in ['api/generate.py', 'api/stream.py']:
            if "access_token = user_data.get('access_token')" in content:
                print(f"✅ User authentication extraction implemented")
            else:
                print(f"❌ User authentication extraction missing")
                all_checks_passed = False
        
        # Check 7: Token passing to download_repo
        if "self.download_repo(repo_url, access_token)" in content:
            print(f"✅ Access token passed to download_repo method")
        else:
            print(f"❌ Access token not passed to download_repo method")
            all_checks_passed = False
    
    return all_checks_passed

def check_oauth_scope():
    """Check that OAuth scope is configured correctly"""
    
    print(f"\n🔐 Checking OAuth Configuration...")
    
    # Check api/index.py for OAuth scope
    if os.path.exists('api/index.py'):
        with open('api/index.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        if "'scope': 'repo'" in content:
            print(f"✅ OAuth scope configured correctly: 'repo'")
            print(f"   This scope provides access to both public and private repositories")
            return True
        else:
            print(f"❌ OAuth scope not found or incorrect")
            return False
    else:
        print(f"❌ api/index.py not found")
        return False

def check_frontend_compatibility():
    """Check that frontend components support private repositories"""
    
    print(f"\n🖥️ Checking Frontend Compatibility...")
    
    # Check repositories list component
    repo_list_file = 'src/components/repositories-list.tsx'
    if os.path.exists(repo_list_file):
        with open(repo_list_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'private: boolean' in content and 'Private' in content:
            print(f"✅ Repository list component supports private repositories")
            print(f"   Shows private badge and handles private repository display")
            return True
        else:
            print(f"❌ Repository list component missing private repository support")
            return False
    else:
        print(f"❌ Repository list component not found")
        return False

def main():
    """Main verification function"""
    
    print("🚀 Private Repository Support Verification")
    print("Checking implementation completeness...")
    print()
    
    # Run all checks
    checks = [
        ("File Changes", check_file_changes),
        ("OAuth Scope", check_oauth_scope), 
        ("Frontend Compatibility", check_frontend_compatibility)
    ]
    
    all_passed = True
    results = []
    
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
            if not result:
                all_passed = False
        except Exception as e:
            print(f"❌ Error running {check_name} check: {e}")
            results.append((check_name, False))
            all_passed = False
    
    # Print summary
    print(f"\n📊 Verification Summary")
    print("=" * 30)
    
    for check_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{check_name:20} {status}")
    
    if all_passed:
        print(f"\n🎉 All verification checks passed!")
        print(f"\n✨ Private Repository Support Features:")
        print(f"   🔐 Authenticated users can access private repositories")
        print(f"   🌐 Public repositories still work without authentication")
        print(f"   🛡️ Secure token-based authentication via GitHub OAuth")
        print(f"   📱 Seamless integration with existing UI components")
        print(f"   🔄 Backward compatible with existing functionality")
        print(f"   💬 Enhanced error messages for better user experience")
        
        print(f"\n🚀 Ready for Testing:")
        print(f"   1. Deploy the application")
        print(f"   2. Log in via GitHub OAuth")
        print(f"   3. Navigate to /repositories")
        print(f"   4. Select a private repository")
        print(f"   5. Generate README file")
        
        return True
    else:
        print(f"\n❌ Some verification checks failed!")
        print(f"   Please review the implementation and ensure all changes are complete.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)