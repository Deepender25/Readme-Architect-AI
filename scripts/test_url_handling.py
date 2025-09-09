#!/usr/bin/env python3
"""
Test script for GitHub URL handling and normalization
"""

import re

def normalize_github_url(repo_url: str) -> str:
    """Normalize GitHub URL by removing .git suffix and trailing slashes"""
    normalized_url = repo_url.strip()
    if normalized_url.endswith('/'):
        normalized_url = normalized_url[:-1]
    if normalized_url.endswith('.git'):
        normalized_url = normalized_url[:-4]
    return normalized_url

def validate_github_url(url: str) -> bool:
    """Validate GitHub URL - accepts various formats including .git suffix"""
    github_regex = r'^https?://(www\.)?github\.com/[\w\-\.]+/[\w\-\.]+(?:\.git)?/?$'
    return bool(re.match(github_regex, url.strip()))

def test_url_handling():
    """Test various GitHub URL formats"""
    
    test_urls = [
        # Valid URLs that should be accepted
        ("https://github.com/Deepender25/CursorViaCam", True),
        ("https://github.com/Deepender25/CursorViaCam.git", True),
        ("https://github.com/Deepender25/CursorViaCam/", True),
        ("https://github.com/Deepender25/CursorViaCam.git/", True),
        ("http://github.com/user/repo", True),
        ("https://www.github.com/user/repo.git", True),
        ("https://github.com/user-name/repo-name", True),
        ("https://github.com/user.name/repo.name.git", True),
        
        # Invalid URLs that should be rejected
        ("github.com/user/repo", False),
        ("https://gitlab.com/user/repo", False),
        ("https://github.com/user", False),
        ("https://github.com/", False),
        ("https://github.com", False),
        ("", False),
        ("not-a-url", False),
        ("https://github.com/user/repo/extra/path", False),
    ]
    
    print("Testing GitHub URL validation and normalization...")
    print("=" * 60)
    
    all_passed = True
    
    for url, should_be_valid in test_urls:
        is_valid = validate_github_url(url)
        normalized = normalize_github_url(url) if url else ""
        
        status = "✅ PASS" if is_valid == should_be_valid else "❌ FAIL"
        if is_valid != should_be_valid:
            all_passed = False
            
        print(f"{status} | {url:<45} | Valid: {is_valid} | Normalized: {normalized}")
    
    print("=" * 60)
    
    # Test normalization specifically
    print("\nTesting URL normalization:")
    print("-" * 40)
    
    normalization_tests = [
        ("https://github.com/Deepender25/CursorViaCam.git", "https://github.com/Deepender25/CursorViaCam"),
        ("https://github.com/Deepender25/CursorViaCam/", "https://github.com/Deepender25/CursorViaCam"),
        ("https://github.com/Deepender25/CursorViaCam.git/", "https://github.com/Deepender25/CursorViaCam"),
        ("https://github.com/Deepender25/CursorViaCam", "https://github.com/Deepender25/CursorViaCam"),
    ]
    
    for original, expected in normalization_tests:
        normalized = normalize_github_url(original)
        status = "✅ PASS" if normalized == expected else "❌ FAIL"
        if normalized != expected:
            all_passed = False
        print(f"{status} | {original} -> {normalized}")
    
    print("=" * 60)
    print(f"Overall result: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
    
    return all_passed

if __name__ == "__main__":
    test_url_handling()
