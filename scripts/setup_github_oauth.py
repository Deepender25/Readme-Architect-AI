#!/usr/bin/env python3
"""
GitHub OAuth Setup Helper
Helps configure GitHub OAuth application settings
"""

import os
import sys

def setup_github_oauth():
    """Guide user through GitHub OAuth setup"""
    
    print("🔧 GitHub OAuth Setup Helper")
    print("=" * 50)
    
    print("\n📋 To fix the login issue, you need to:")
    print("1. Create a GitHub OAuth App")
    print("2. Configure the callback URL")
    print("3. Set environment variables")
    
    print("\n🔗 Step 1: Create GitHub OAuth App")
    print("   Go to: https://github.com/settings/applications/new")
    print("   Fill in:")
    print("   - Application name: ReadmeArchitect")
    print("   - Homepage URL: https://readmearchitect.vercel.app")
    print("   - Authorization callback URL: https://readmearchitect.vercel.app/api/auth/callback")
    print("   - Application description: AI-powered README generator")
    
    print("\n🔑 Step 2: Get Client ID and Secret")
    print("   After creating the app, you'll get:")
    print("   - Client ID (public)")
    print("   - Client Secret (keep this secret!)")
    
    print("\n⚙️ Step 3: Configure Environment Variables")
    
    # Check current .env file
    env_file = ".env"
    if os.path.exists(env_file):
        print(f"   ✅ Found {env_file}")
        
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Check current configuration
        if 'GITHUB_CLIENT_ID=your_github_client_id_here' in content:
            print("   ❌ GITHUB_CLIENT_ID needs to be set")
        else:
            print("   ✅ GITHUB_CLIENT_ID appears to be configured")
            
        if 'GITHUB_CLIENT_SECRET=your_github_client_secret_here' in content:
            print("   ❌ GITHUB_CLIENT_SECRET needs to be set")
        else:
            print("   ✅ GITHUB_CLIENT_SECRET appears to be configured")
            
        if 'GITHUB_REDIRECT_URI=https://readmearchitect.vercel.app/api/auth/callback' in content:
            print("   ✅ GITHUB_REDIRECT_URI is correctly set")
        else:
            print("   ⚠️ GITHUB_REDIRECT_URI may need to be updated")
    else:
        print(f"   ❌ {env_file} not found")
        print("   Copy .env.example to .env and configure it")
    
    print("\n🚀 Step 4: Deploy and Test")
    print("   1. Update your .env file with the GitHub OAuth credentials")
    print("   2. Deploy to Vercel: vercel --prod")
    print("   3. Test the login flow")
    
    print("\n🔍 Step 5: Verify Configuration")
    print("   Run: python scripts/test_complete_auth_flow.py")
    
    print("\n" + "=" * 50)
    
    # Interactive setup
    print("\n🤖 Interactive Setup")
    setup_interactive = input("Would you like to update your .env file now? (y/n): ").lower().strip()
    
    if setup_interactive == 'y':
        if not os.path.exists(env_file):
            print("❌ .env file not found. Please copy .env.example to .env first.")
            return
        
        print("\nEnter your GitHub OAuth credentials:")
        client_id = input("GitHub Client ID: ").strip()
        client_secret = input("GitHub Client Secret: ").strip()
        
        if client_id and client_secret:
            # Read current .env
            with open(env_file, 'r') as f:
                content = f.read()
            
            # Update values
            content = content.replace('GITHUB_CLIENT_ID=your_github_client_id_here', f'GITHUB_CLIENT_ID={client_id}')
            content = content.replace('GITHUB_CLIENT_SECRET=your_github_client_secret_here', f'GITHUB_CLIENT_SECRET={client_secret}')
            
            # Write back
            with open(env_file, 'w') as f:
                f.write(content)
            
            print("✅ Environment variables updated!")
            print("🚀 Now deploy with: vercel --prod")
        else:
            print("❌ Client ID and Secret are required")
    
    print("\n📚 Additional Resources:")
    print("   - GitHub OAuth Apps: https://docs.github.com/en/developers/apps/building-oauth-apps")
    print("   - Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables")

if __name__ == "__main__":
    setup_github_oauth()