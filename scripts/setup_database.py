#!/usr/bin/env python3
"""
Setup script for AutoDoc AI database
This script helps set up the Supabase database for the history feature.
"""

import os
import sys
from dotenv import load_dotenv
from api.database import validate_github_config, create_history_repository

def main():
    print("🚀 AutoDoc AI GitHub Database Setup")
    print("=" * 40)
    
    # Load environment variables
    load_dotenv()
    
    # Check if GitHub credentials are available
    if not validate_github_config():
        print("❌ Error: GitHub database credentials not found!")
        print("Please make sure you have set the following environment variables:")
        print("- GITHUB_DATA_REPO_OWNER")
        print("- GITHUB_DATA_REPO_NAME") 
        print("- GITHUB_DATA_TOKEN")
        print("\nCreate a GitHub repository and personal access token.")
        return False
    
    print("✅ Found GitHub database configuration")
    
    # Test connection
    print("\n📡 Testing GitHub repository access...")
    success = create_history_repository()
    
    if not success:
        print("❌ Failed to access GitHub repository!")
        print("Please check your credentials and repository permissions.")
        return False
    
    print("✅ Successfully connected to GitHub repository!")
    
    # Instructions for manual table creation
    print("\n📋 GitHub Database Setup Complete!")
    print("=" * 40)
    print("✅ Repository access verified")
    print("✅ Authentication working")
    print("✅ Ready to store user history")
    
    print("\n📁 Data Structure:")
    print("Your repository will automatically create:")
    print("- users/{user_id}/history.json files")
    print("- Each user gets their own private history file")
    print("- Files are created automatically when users generate READMEs")
    
    print("\n🔒 Privacy & Security:")
    print("- All data stored in your private repository")
    print("- Each user's data is isolated")
    print("- Full version control history")
    print("- You have complete control over the data")
    
    print("\n🎉 Setup complete!")
    print("Your GitHub database is ready to use!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)