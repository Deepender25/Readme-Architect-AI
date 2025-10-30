#!/usr/bin/env python3
"""
Script to fix inconsistent domain references throughout the codebase.
Changes all readmearchitect.vercel.app references to readmearchitect.vercel.app
"""

import os
import re
import glob

def fix_domain_in_file(file_path):
    """Fix domain references in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace readmearchitect.vercel.app with readmearchitect.vercel.app
        original_content = content
        content = content.replace('readmearchitect.vercel.app', 'readmearchitect.vercel.app')
        
        # Also fix any ReadmeArchitect branding to ReadmeArchitect
        content = re.sub(r'\bAutoDoc AI\b', 'ReadmeArchitect', content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {file_path}")
            return True
        else:
            return False
            
    except Exception as e:
        print(f"❌ Error fixing {file_path}: {e}")
        return False

def main():
    """Main function to fix all domain references"""
    print("🔧 Fixing inconsistent domain references...")
    print("   readmearchitect.vercel.app → readmearchitect.vercel.app")
    print("   ReadmeArchitect → ReadmeArchitect")
    print()
    
    # Files to fix (excluding node_modules, .git, etc.)
    patterns = [
        'scripts/*.py',
        'docs/**/*.md',
        '*.md',
        'src/**/*.ts',
        'src/**/*.tsx',
        'api/*.py'
    ]
    
    files_fixed = 0
    total_files = 0
    
    for pattern in patterns:
        for file_path in glob.glob(pattern, recursive=True):
            # Skip certain files
            if any(skip in file_path for skip in ['.git', 'node_modules', '__pycache__', '.next']):
                continue
                
            total_files += 1
            if fix_domain_in_file(file_path):
                files_fixed += 1
    
    print()
    print(f"📊 Summary:")
    print(f"   Files checked: {total_files}")
    print(f"   Files fixed: {files_fixed}")
    
    if files_fixed > 0:
        print()
        print("✅ Domain references have been standardized!")
        print("🔄 Next steps:")
        print("   1. Update your GitHub OAuth app callback URL to:")
        print("      https://readmearchitect.vercel.app/api/auth/callback")
        print("   2. Update your production environment variables")
        print("   3. Test the application to ensure everything works")
    else:
        print("✅ All domain references are already consistent!")

if __name__ == "__main__":
    main()