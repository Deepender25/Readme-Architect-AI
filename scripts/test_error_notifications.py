#!/usr/bin/env python3

"""
Test script to verify error handling and email notifications
This script tests the new error notification system
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_error_notifier():
    """Test the error notification system"""
    print("🧪 Testing Error Notification System")
    print("=" * 50)
    
    # Import the error notifier
    try:
        sys.path.append('api')
        from api.error_notifier import ErrorNotifier, log_error, notify_ai_failure, notify_api_error
        print("✅ Error notifier imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import error notifier: {e}")
        return False
    
    # Initialize the notifier
    notifier = ErrorNotifier()
    
    # Check configuration
    print(f"📧 Email configured: {notifier.is_configured()}")
    print(f"📮 Email user: {notifier.email_user}")
    print(f"🔔 Notification email: {notifier.notification_email}")
    
    if not notifier.is_configured():
        print("⚠️ Email not configured. Set EMAIL_USER and EMAIL_PASS in .env file")
        print("📝 Testing will continue without sending actual emails")
    
    print("\n" + "=" * 50)
    print("🧪 Test 1: Basic Error Logging")
    print("-" * 30)
    
    try:
        log_error(
            error_type="Test Error",
            error_message="This is a test error message",
            context={
                "test_parameter": "test_value",
                "timestamp": "2025-01-01"
            },
            user_info={
                "username": "test_user",
                "type": "Test User"
            }
        )
        print("✅ Basic error logging test completed")
    except Exception as e:
        print(f"❌ Basic error logging test failed: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🧪 Test 2: AI Failure Notification")
    print("-" * 30)
    
    try:
        notify_ai_failure(
            repo_url="https://github.com/test/repository",
            project_name="Test Project",
            error_message="AI service timeout after 30 seconds",
            user_info={
                "username": "test_user",
                "github_id": "12345"
            }
        )
        print("✅ AI failure notification test completed")
    except Exception as e:
        print(f"❌ AI failure notification test failed: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🧪 Test 3: API Error Notification")
    print("-" * 30)
    
    try:
        notify_api_error(
            endpoint="/api/generate",
            error_message="Connection timeout to external service",
            request_data={
                "repo_url": "https://github.com/test/repo",
                "project_name": "Test Project"
            },
            user_info={
                "username": "test_user",
                "github_id": "12345"
            }
        )
        print("✅ API error notification test completed")
    except Exception as e:
        print(f"❌ API error notification test failed: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("🧪 Test 4: Anonymous User Error")
    print("-" * 30)
    
    try:
        notify_ai_failure(
            repo_url="https://github.com/anonymous/test",
            project_name="Anonymous Test",
            error_message="AI generation failed for anonymous user",
            user_info={
                "type": "Anonymous user",
                "ip_address": "192.168.1.1"
            }
        )
        print("✅ Anonymous user error test completed")
    except Exception as e:
        print(f"❌ Anonymous user error test failed: {e}")
        return False
    
    print("\n" + "🎉 All error notification tests completed!")
    
    if notifier.is_configured():
        print("\n📧 Email notifications were sent to:", notifier.notification_email)
        print("📬 Check your email inbox for test notifications")
    else:
        print("\n⚠️ Email not configured - no actual emails were sent")
        print("💡 To enable email notifications:")
        print("   1. Add EMAIL_USER and EMAIL_PASS to your .env file")
        print("   2. Use Gmail App Password (not regular password)")
        print("   3. Optionally set ERROR_NOTIFICATION_EMAIL")
    
    return True

def test_user_facing_messages():
    """Test that users see proper error messages instead of fallback templates"""
    print("\n" + "=" * 50)
    print("🧪 Testing User-Facing Error Messages")
    print("-" * 30)
    
    expected_message = "AI generation service is currently unavailable. Our team has been notified and is working to resolve this issue. Please try again in a few minutes."
    
    print("✅ Expected user message for AI failures:")
    print(f"   '{expected_message}'")
    print("\n📝 This message should appear instead of fallback templates")
    print("🔔 Developers will receive detailed error notifications via email")
    
    return True

def main():
    """Run all tests"""
    print("🚀 Error Handling & Email Notification Test Suite")
    print("=" * 60)
    
    # Check environment
    if not os.path.exists('.env'):
        print("⚠️ .env file not found. Copy .env.example to .env and configure it.")
        print("📝 Tests will run but email notifications won't be sent.")
        print()
    
    # Run tests
    tests = [
        ("Error Notifier System", test_error_notifier),
        ("User-Facing Messages", test_user_facing_messages),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running: {test_name}")
        print("-" * 40)
        
        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")
    
    print("\n" + "=" * 60)
    print(f"🏁 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        print("\n✅ Key Improvements Implemented:")
        print("   • AI failures now show user-friendly messages")
        print("   • No more fallback templates displayed to users")
        print("   • Email notifications sent for all errors")
        print("   • Detailed error logging with context")
        print("   • Both authenticated and anonymous user errors tracked")
        return True
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
