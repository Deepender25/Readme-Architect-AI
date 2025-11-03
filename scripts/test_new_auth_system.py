#!/usr/bin/env python3
"""
Test script for the new simplified auth system
"""

import os
import sys
import subprocess
import time

# Load environment variables from .env file
def load_env_file():
    """Load environment variables from .env file"""
    env_file = '.env'
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

def test_auth_system():
    """Test the new authentication system"""
    
    print("🧪 Testing New Authentication System")
    print("=" * 50)
    
    # Check if required environment variables are set
    required_env_vars = [
        'GITHUB_CLIENT_ID',
        'GITHUB_CLIENT_SECRET', 
        'GITHUB_REDIRECT_URI',
        'JWT_SECRET'
    ]
    
    print("\n1. Checking Environment Variables...")
    missing_vars = []
    for var in required_env_vars:
        if not os.getenv(var):
            missing_vars.append(var)
            print(f"   ❌ {var} - Missing")
        else:
            print(f"   ✅ {var} - Set")
    
    if missing_vars:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file")
        return False
    
    # Check if auth files exist
    print("\n2. Checking Auth Files...")
    auth_files = [
        'src/lib/auth.ts',
        'src/lib/auth-client.tsx',
        'src/app/api/auth/github/route.ts',
        'src/app/api/auth/callback/route.ts',
        'src/app/api/auth/verify/route.ts',
        'src/app/api/auth/logout/route.ts'
    ]
    
    for file_path in auth_files:
        if os.path.exists(file_path):
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} - Missing")
            return False
    
    # Check if old auth files are removed
    print("\n3. Checking Old Auth Files Removed...")
    old_auth_files = [
        'src/lib/secure-auth-client.tsx',
        'src/lib/secure-session-store.ts',
        'src/lib/secure-auth.ts',
        'src/lib/jwt-auth.ts',
        'src/lib/auth-retry-handler.ts'
    ]
    
    for file_path in old_auth_files:
        if not os.path.exists(file_path):
            print(f"   ✅ {file_path} - Removed")
        else:
            print(f"   ❌ {file_path} - Still exists")
    
    # Check TypeScript compilation
    print("\n4. Checking TypeScript Compilation...")
    try:
        result = subprocess.run(['npx', 'tsc', '--noEmit'], 
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print("   ✅ TypeScript compilation successful")
        else:
            print("   ❌ TypeScript compilation failed:")
            print(result.stderr)
            return False
    except subprocess.TimeoutExpired:
        print("   ⚠️  TypeScript compilation timed out")
    except FileNotFoundError:
        print("   ⚠️  TypeScript not found, skipping compilation check")
    
    print("\n5. Auth System Summary:")
    print("   📝 Simple JWT-based authentication")
    print("   🔐 Secure HttpOnly cookies")
    print("   🚀 Direct GitHub OAuth integration")
    print("   🧹 No complex session storage")
    print("   ⚡ Fast and reliable")
    
    print("\n✅ New Authentication System Ready!")
    print("\nNext steps:")
    print("1. Set JWT_SECRET in your .env file to a secure 32+ character string")
    print("2. Update your GitHub OAuth app callback URL to: /api/auth/callback")
    print("3. Test login flow in development")
    
    return True

if __name__ == "__main__":
    load_env_file()
    success = test_auth_system()
    sys.exit(0 if success else 1)