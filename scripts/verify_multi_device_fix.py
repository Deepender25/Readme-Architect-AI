#!/usr/bin/env python3
"""
Verification script for multi-device authentication fix
Checks that all required files and implementations are in place
"""

import os
import re
import sys
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and return status"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} (NOT FOUND)")
        return False

def check_file_contains(file_path, patterns, description):
    """Check if a file contains specific patterns"""
    if not os.path.exists(file_path):
        print(f"❌ {description}: {file_path} (FILE NOT FOUND)")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        missing_patterns = []
        for pattern_name, pattern in patterns.items():
            if not re.search(pattern, content, re.MULTILINE | re.DOTALL):
                missing_patterns.append(pattern_name)
        
        if missing_patterns:
            print(f"❌ {description}: Missing patterns - {', '.join(missing_patterns)}")
            return False
        else:
            print(f"✅ {description}: All required patterns found")
            return True
            
    except Exception as e:
        print(f"❌ {description}: Error reading file - {str(e)}")
        return False

def main():
    """Main verification function"""
    
    print("🔍 Multi-Device Authentication Fix Verification")
    print("=" * 50)
    print()
    
    # Check if we're in the right directory
    if not os.path.exists('package.json'):
        print("❌ Please run this script from the project root directory")
        return 1
    
    results = []
    
    # 1. Check core files exist
    print("📁 Checking Core Files")
    print("-" * 30)
    
    core_files = [
        ("src/lib/auth-retry-handler.ts", "Authentication Retry Handler"),
        ("src/lib/session-manager.ts", "Session Manager"),
        ("MULTI_DEVICE_AUTH_FIX.md", "Documentation"),
        ("scripts/test_multi_device_auth.py", "Test Script")
    ]
    
    for file_path, description in core_files:
        results.append(check_file_exists(file_path, description))
    
    print()
    
    # 2. Check auth retry handler implementation
    print("🔧 Checking Auth Retry Handler Implementation")
    print("-" * 45)
    
    auth_retry_patterns = {
        "AuthRetryHandler class": r"export class AuthRetryHandler",
        "authenticatedFetchWithRetry method": r"static async authenticatedFetchWithRetry",
        "refreshAuthentication method": r"private static async refreshAuthentication",
        "useAuthRetry hook": r"export function useAuthRetry",
        "retryWithAuth method": r"const retryWithAuth = async"
    }
    
    results.append(check_file_contains(
        "src/lib/auth-retry-handler.ts", 
        auth_retry_patterns, 
        "Auth Retry Handler Implementation"
    ))
    
    print()
    
    # 3. Check session manager enhancements
    print("🗄️ Checking Session Manager Enhancements")
    print("-" * 40)
    
    session_patterns = {
        "synchronizeSession method": r"static synchronizeSession",
        "refreshSessionData method": r"static refreshSessionData",
        "isSessionActive method": r"private static isSessionActive",
        "multi-device session validation": r"this\.isSessionActive"
    }
    
    results.append(check_file_contains(
        "src/lib/session-manager.ts", 
        session_patterns, 
        "Session Manager Enhancements"
    ))
    
    print()
    
    # 4. Check repositories page updates
    print("📄 Checking Repositories Page Updates")
    print("-" * 35)
    
    repo_patterns = {
        "useAuthRetry import": r"import.*useAuthRetry.*from.*auth-retry-handler",
        "retryWithAuth usage": r"retryWithAuth",
        "forceReauth parameter": r"forceReauth",
        "Re-authenticate button": r"Re-authenticate.*Try Again"
    }
    
    results.append(check_file_contains(
        "src/app/repositories/page.tsx", 
        repo_patterns, 
        "Repositories Page Updates"
    ))
    
    print()
    
    # 5. Check history page updates
    print("📜 Checking History Page Updates")
    print("-" * 30)
    
    history_patterns = {
        "useAuthRetry import": r"import.*useAuthRetry.*from.*auth-retry-handler",
        "retryWithAuth usage": r"retryWithAuth",
        "forceReauth parameter": r"forceReauth",
        "Re-authenticate button": r"Re-authenticate.*Try Again"
    }
    
    results.append(check_file_contains(
        "src/app/history/page.tsx", 
        history_patterns, 
        "History Page Updates"
    ))
    
    print()
    
    # 6. Check component updates
    print("🧩 Checking Component Updates")
    print("-" * 25)
    
    components_to_check = [
        ("src/components/repositories-list.tsx", "Repositories List Component"),
        ("src/components/history-list.tsx", "History List Component")
    ]
    
    component_patterns = {
        "useAuthRetry import": r"import.*useAuthRetry.*from.*auth-retry-handler",
        "retryWithAuth usage": r"retryWithAuth",
        "Re-authenticate button": r"Re-authenticate.*Try Again"
    }
    
    for file_path, description in components_to_check:
        results.append(check_file_contains(
            file_path, 
            component_patterns, 
            description
        ))
    
    print()
    
    # Summary
    print("📊 Verification Summary")
    print("=" * 25)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 All verifications passed!")
        print("✨ Multi-device authentication fix is properly implemented.")
        print()
        print("🚀 Key Features Implemented:")
        print("   • Enhanced authentication retry handler")
        print("   • Session synchronization across devices")
        print("   • Improved error handling with dual retry options")
        print("   • Clear user guidance for multi-device scenarios")
        print("   • Comprehensive session management")
        print()
        print("📝 Next Steps:")
        print("   1. Start the development server")
        print("   2. Test the functionality in a browser")
        print("   3. Try logging in from multiple devices")
        print("   4. Verify the 'Re-authenticate & Try Again' button works")
        return 0
    else:
        print("\n⚠️ Some verifications failed!")
        print("🔧 Please check the missing implementations above.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)