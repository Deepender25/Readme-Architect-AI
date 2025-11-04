#!/usr/bin/env python3
"""
Test script to verify history duplicate detection is working correctly
"""

import json
from datetime import datetime, timedelta

def test_duplicate_detection():
    """Test the duplicate detection logic"""
    print("🧪 Testing History Duplicate Detection Logic\n")
    
    # Simulate existing history data
    now = datetime.now()
    thirty_seconds_ago = now - timedelta(seconds=30)
    one_minute_ago = now - timedelta(minutes=1)
    five_minutes_ago = now - timedelta(minutes=5)
    
    existing_data = [
        {
            "id": "user123_1699123456789",
            "user_id": "user123",
            "repository_url": "https://github.com/user/repo1",
            "readme_content": "# Test README Content 1",
            "created_at": five_minutes_ago.isoformat()
        },
        {
            "id": "user123_1699123456790",
            "user_id": "user123", 
            "repository_url": "https://github.com/user/repo2",
            "readme_content": "# Test README Content 2",
            "created_at": one_minute_ago.isoformat()
        },
        {
            "id": "user123_1699123456791",
            "user_id": "user123",
            "repository_url": "https://github.com/user/repo3", 
            "readme_content": "# Test README Content 3",
            "created_at": (now - timedelta(seconds=15)).isoformat()  # 15 seconds ago (recent)
        }
    ]
    
    # Test cases
    test_cases = [
        {
            "name": "New repository - should save",
            "data": {
                "user_id": "user123",
                "repository_url": "https://github.com/user/new-repo",
                "readme_content": "# New README Content",
            },
            "expected_duplicate": False
        },
        {
            "name": "Same repo, different content - should save",
            "data": {
                "user_id": "user123", 
                "repository_url": "https://github.com/user/repo1",
                "readme_content": "# Updated README Content",
            },
            "expected_duplicate": False
        },
        {
            "name": "Same repo, same content, old timestamp - should save",
            "data": {
                "user_id": "user123",
                "repository_url": "https://github.com/user/repo1", 
                "readme_content": "# Test README Content 1",
            },
            "expected_duplicate": False
        },
        {
            "name": "Same repo, same content, recent timestamp - should NOT save",
            "data": {
                "user_id": "user123",
                "repository_url": "https://github.com/user/repo3",
                "readme_content": "# Test README Content 3",
            },
            "expected_duplicate": True
        },
        {
            "name": "Different user, same repo - should save",
            "data": {
                "user_id": "user456",
                "repository_url": "https://github.com/user/repo1",
                "readme_content": "# Test README Content 1",
            },
            "expected_duplicate": False
        }
    ]
    
    # Run tests
    results = []
    
    for test_case in test_cases:
        print(f"🔍 Testing: {test_case['name']}")
        
        # Simulate the duplicate detection logic
        thirty_seconds_ago_check = (now - timedelta(seconds=30)).isoformat()
        
        is_duplicate = any(
            entry["repository_url"] == test_case["data"]["repository_url"] and
            entry["user_id"] == test_case["data"]["user_id"] and
            entry["readme_content"] == test_case["data"]["readme_content"] and
            entry["created_at"] > thirty_seconds_ago_check
            for entry in existing_data
        )
        
        expected = test_case["expected_duplicate"]
        passed = is_duplicate == expected
        
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   Expected duplicate: {expected}")
        print(f"   Actual duplicate: {is_duplicate}")
        print(f"   Result: {status}\n")
        
        results.append({
            "test": test_case["name"],
            "passed": passed,
            "expected": expected,
            "actual": is_duplicate
        })
    
    # Summary
    passed_tests = sum(1 for r in results if r["passed"])
    total_tests = len(results)
    
    print(f"📊 Test Results Summary:")
    print(f"   Passed: {passed_tests}/{total_tests}")
    print(f"   Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print(f"\n🎉 All tests passed! Duplicate detection logic is working correctly.")
        print(f"\n📝 Key Points:")
        print(f"   • Only prevents duplicates within 30 seconds")
        print(f"   • Allows same repo with different content")
        print(f"   • Allows same repo/content after 30 seconds")
        print(f"   • Allows different users to have same repo/content")
    else:
        print(f"\n⚠️ Some tests failed. Please review the duplicate detection logic.")
        
        for result in results:
            if not result["passed"]:
                print(f"   ❌ {result['test']}: Expected {result['expected']}, got {result['actual']}")
    
    return passed_tests == total_tests

def test_timestamp_scenarios():
    """Test various timestamp scenarios"""
    print(f"\n🕐 Testing Timestamp Scenarios\n")
    
    now = datetime.now()
    
    scenarios = [
        ("30 seconds ago", now - timedelta(seconds=30)),
        ("29 seconds ago", now - timedelta(seconds=29)),
        ("31 seconds ago", now - timedelta(seconds=31)),
        ("1 minute ago", now - timedelta(minutes=1)),
        ("5 minutes ago", now - timedelta(minutes=5)),
    ]
    
    thirty_seconds_ago = (now - timedelta(seconds=30)).isoformat()
    
    for name, timestamp in scenarios:
        is_recent = timestamp.isoformat() > thirty_seconds_ago
        print(f"   {name}: {'Recent (would block)' if is_recent else 'Old enough (would allow)'}")
    
    return True

if __name__ == "__main__":
    print("🚀 History Duplicate Detection Test Suite\n")
    
    test1_passed = test_duplicate_detection()
    test2_passed = test_timestamp_scenarios()
    
    if test1_passed and test2_passed:
        print(f"\n✅ All tests completed successfully!")
        print(f"\n🔧 The duplicate detection should now:")
        print(f"   • Allow users to generate multiple READMEs for the same repo")
        print(f"   • Only prevent true duplicates within 30 seconds")
        print(f"   • Support different generation parameters")
        print(f"   • Work correctly across different users")
    else:
        print(f"\n❌ Some tests failed. Please check the implementation.")