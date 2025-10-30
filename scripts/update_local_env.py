#!/usr/bin/env python3
"""
Update local .env file with correct GitHub OAuth configuration
"""

import os

def update_env_file():
    """Update the .env file with correct GitHub OAuth settings"""
    
    print("🔧 Updating local .env file...")
    
    # Read current .env file
    env_lines = []
    if os.path.exists('.env'):
        with open('.env', 'r') as f:
            env_lines = f.readlines()
    
    # Update or add GitHub OAuth variables
    updated_lines = []
    github_vars_found = set()
    
    correct_values = {
        'GITHUB_CLIENT_ID': 'Ov23liq3yu6Ir7scqDXo',
        'GITHUB_REDIRECT_URI': 'https://readmearchitect.vercel.app/api/auth/callback'
    }
    
    for line in env_lines:
        line = line.strip()
        if line.startswith('GITHUB_CLIENT_ID='):
            updated_lines.append(f"GITHUB_CLIENT_ID={correct_values['GITHUB_CLIENT_ID']}\n")
            github_vars_found.add('GITHUB_CLIENT_ID')
            print(f"✅ Updated GITHUB_CLIENT_ID")
        elif line.startswith('GITHUB_REDIRECT_URI='):
            updated_lines.append(f"GITHUB_REDIRECT_URI={correct_values['GITHUB_REDIRECT_URI']}\n")
            github_vars_found.add('GITHUB_REDIRECT_URI')
            print(f"✅ Updated GITHUB_REDIRECT_URI")
        else:
            updated_lines.append(line + '\n' if line else '\n')
    
    # Add missing variables
    for var, value in correct_values.items():
        if var not in github_vars_found:
            updated_lines.append(f"{var}={value}\n")
            print(f"✅ Added {var}")
    
    # Write updated .env file
    with open('.env', 'w') as f:
        f.writelines(updated_lines)
    
    print(f"\n✅ Local .env file updated successfully!")
    print(f"\n⚠️ Important: You still need to update Vercel environment variables:")
    print(f"   1. Go to Vercel Dashboard → Settings → Environment Variables")
    print(f"   2. Update GITHUB_CLIENT_SECRET with the correct secret")
    print(f"   3. Ensure GITHUB_CLIENT_ID = Ov23liq3yu6Ir7scqDXo")

if __name__ == "__main__":
    update_env_file()