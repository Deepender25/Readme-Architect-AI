#!/usr/bin/env python3
"""
Script to fix TypeScript issues found in the codebase
"""

import os
import re

def fix_file(file_path, fixes):
    """Apply fixes to a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        for old_text, new_text in fixes:
            content = content.replace(old_text, new_text)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {file_path}")
            return True
        return False
            
    except Exception as e:
        print(f"❌ Error fixing {file_path}: {e}")
        return False

def main():
    """Fix all TypeScript issues"""
    print("🔧 Fixing TypeScript issues...")
    
    fixes = [
        # Fix LayoutWrapper maxWidth prop
        ('src/app/settings/page.tsx', [
            ('maxWidth="4xl"', 'maxWidth="2xl"')
        ]),
        
        # Fix debug-auth onClick handler
        ('src/components/debug-auth.tsx', [
            ('onClick={login}', 'onClick={() => login()}')
        ]),
        
        # Fix debug-session localStorage.clear
        ('src/components/debug-session.tsx', [
            ('localStorage.clear();', 'localStorage.clear();')
        ]),
        
        # Fix imageRendering prop
        ('src/components/blocks/navbars/github-oauth-navbar.tsx', [
            ("imageRendering: 'smooth',", "style={{ imageRendering: 'smooth' } as any,")
        ]),
        
        ('src/components/layout/modern-navbar.tsx', [
            ("imageRendering: 'smooth',", "style={{ imageRendering: 'smooth' } as any,")
        ]),
        
        # Fix markdown renderer inline prop
        ('src/components/ui/markdown-renderer.tsx', [
            ('code: ({ inline, children }) => (', 'code: ({ children, ...props }) => (')
        ]),
        
        # Fix scroll animated div ref
        ('src/components/ui/scroll-animated-div.tsx', [
            ('const ref = useRef<HTMLElement>(null);', 'const ref = useRef<HTMLDivElement>(null);')
        ]),
        
        # Fix event handlers in dropdowns
        ('src/components/ui/enhanced-dropdown.tsx', [
            ("document.addEventListener('touchstart', handleClickOutside);", 
             "document.addEventListener('touchstart', handleClickOutside as any);"),
            ("document.removeEventListener('touchstart', handleClickOutside);", 
             "document.removeEventListener('touchstart', handleClickOutside as any);")
        ]),
        
        ('src/components/ui/simple-dropdown.tsx', [
            ("document.addEventListener('touchstart', handleClickOutside);", 
             "document.addEventListener('touchstart', handleClickOutside as any);"),
            ("document.removeEventListener('touchstart', handleClickOutside);", 
             "document.removeEventListener('touchstart', handleClickOutside as any);")
        ]),
        
        # Fix route prefetcher Set iteration
        ('src/lib/route-prefetcher.tsx', [
            ('setPrefetchedRoutes(prev => new Set([...prev, route]))', 
             'setPrefetchedRoutes(prev => new Set(Array.from(prev).concat([route])))')
        ]),
        
        # Fix loading utils intensity
        ('src/utils/loading-utils.tsx', [
            ('intensity={adjustedIntensity}', 'intensity={Math.min(5, Math.max(1, adjustedIntensity)) as 1 | 2 | 3 | 4 | 5}')
        ]),
    ]
    
    files_fixed = 0
    
    for file_path, file_fixes in fixes:
        if os.path.exists(file_path):
            if fix_file(file_path, file_fixes):
                files_fixed += 1
        else:
            print(f"⚠️ File not found: {file_path}")
    
    print(f"\n📊 Summary: {files_fixed} files fixed")
    
    # Add missing ModernReadmeOutput props
    modern_output_path = 'src/components/modern-readme-output.tsx'
    if os.path.exists(modern_output_path):
        try:
            with open(modern_output_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Add updatedAt and createdAt to interface if not present
            if 'updatedAt?' not in content:
                content = content.replace(
                    'interface ModernReadmeOutputProps {',
                    'interface ModernReadmeOutputProps {\n  createdAt?: string;\n  updatedAt?: string;'
                )
                
                with open(modern_output_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Added missing props to: {modern_output_path}")
                files_fixed += 1
        except Exception as e:
            print(f"❌ Error fixing {modern_output_path}: {e}")
    
    print(f"\n✅ TypeScript fixes complete! {files_fixed} files updated.")

if __name__ == "__main__":
    main()