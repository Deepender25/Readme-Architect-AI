#!/usr/bin/env python3
"""
Direct API test to verify Google AI integration
"""

import os
import sys
from dotenv import load_dotenv

# Add the api directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

# Load environment variables
load_dotenv()

def test_google_ai():
    """Test Google AI API connection"""
    try:
        import google.generativeai as genai
        api_key = os.environ.get("GOOGLE_API_KEY")
        
        if not api_key:
            print("❌ GOOGLE_API_KEY not found in environment")
            return False
        
        print(f"✅ API Key found: {api_key[:20]}...")
        
        # Configure the API
        genai.configure(api_key=api_key)
        
        # Test with a simple prompt
        print("🤖 Testing Google AI connection...")
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        test_prompt = "Say 'Hello, API is working!' in exactly 5 words."
        response = model.generate_content(test_prompt)
        
        if response.parts:
            print(f"✅ AI Response: {response.text}")
            return True
        else:
            print("❌ No response from AI")
            return False
            
    except Exception as e:
        print(f"❌ Error testing Google AI: {str(e)}")
        return False

def test_download_repo():
    """Test repository download functionality"""
    print("\n🔄 Testing repository download...")
    
    try:
        from generate import handler
        
        # Create a mock handler instance that bypasses the HTTP server requirements
        class TestableHandler:
            def normalize_github_url(self, repo_url: str) -> str:
                """Normalize GitHub URL by removing .git suffix and trailing slashes"""
                normalized_url = repo_url.strip()
                if normalized_url.endswith('/'):
                    normalized_url = normalized_url[:-1]
                if normalized_url.endswith('.git'):
                    normalized_url = normalized_url[:-4]
                return normalized_url

            def download_repo(self, repo_url: str):
                import tempfile
                import shutil
                import requests
                import zipfile
                import os
                
                try:
                    # First normalize the URL
                    normalized_url = self.normalize_github_url(repo_url)
                    
                    if "github.com" in normalized_url:
                        api_url = normalized_url.replace("github.com", "api.github.com/repos")
                        zip_url = api_url + "/zipball"
                    else:
                        return None, "Invalid GitHub URL"
                    
                    response = requests.get(zip_url, timeout=30)
                    if response.status_code != 200:
                        return None, f"Failed to download repository: {response.status_code}"
                    
                    temp_dir = tempfile.mkdtemp()
                    zip_path = os.path.join(temp_dir, "repo.zip")
                    
                    with open(zip_path, 'wb') as f:
                        f.write(response.content)
                    
                    extract_dir = os.path.join(temp_dir, "extracted")
                    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                        zip_ref.extractall(extract_dir)
                    
                    extracted_items = os.listdir(extract_dir)
                    if extracted_items:
                        repo_dir = os.path.join(extract_dir, extracted_items[0])
                        return repo_dir, None
                    
                    return None, "Failed to extract repository"
                except Exception as e:
                    return None, str(e)

            def analyze_codebase(self, repo_path: str):
                import os
                import ast
                
                try:
                    context = {"file_structure": "", "dependencies": "No dependency file found.", "python_code_summary": {}}
                    ignore_list = ['.git', '__pycache__', 'node_modules', '.venv', 'venv', 'target', 'dist', 'build']
                    file_structure_list = []
                    
                    for root, dirs, files in os.walk(repo_path, topdown=True):
                        dirs[:] = [d for d in dirs if d not in ignore_list]
                        level = root.replace(repo_path, '').count(os.sep)
                        indent = ' ' * 4 * level
                        file_structure_list.append(f"{indent}📂 {os.path.basename(root)}/")
                        sub_indent = ' ' * 4 * (level + 1)
                        
                        for f in files:
                            file_structure_list.append(f"{sub_indent}📄 {f}")
                            file_path = os.path.join(root, f)
                            
                            if f.endswith('.py'):
                                try:
                                    with open(file_path, 'r', encoding='utf-8') as py_file:
                                        source_code = py_file.read()
                                        tree = ast.parse(source_code)
                                        summary = {"functions": [], "classes": []}
                                        for node in ast.walk(tree):
                                            if isinstance(node, ast.FunctionDef):
                                                docstring = ast.get_docstring(node) or "No docstring."
                                                summary["functions"].append(f"def {node.name}(...): # {docstring[:80]}")
                                            elif isinstance(node, ast.ClassDef):
                                                docstring = ast.get_docstring(node) or "No docstring."
                                                summary["classes"].append(f"class {node.name}: # {docstring[:80]}")
                                        if summary["functions"] or summary["classes"]:
                                             context["python_code_summary"][f] = summary
                                except Exception as e:
                                    print(f"Could not parse Python file {file_path}: {e}")
                            elif f in ['requirements.txt', 'package.json', 'pyproject.toml', 'pom.xml']:
                                try:
                                    with open(file_path, 'r', encoding='utf-8') as file_content:
                                        context["dependencies"] = file_content.read()
                                except Exception: pass
                    
                    context["file_structure"] = "\n".join(file_structure_list)
                    return context, None
                except Exception as e:
                    return None, str(e)
        
        test_handler = TestableHandler()
        
        # Test URL normalization
        test_url = "https://github.com/Deepender25/CursorViaCam.git"
        normalized = test_handler.normalize_github_url(test_url)
        print(f"✅ URL normalization: {test_url} -> {normalized}")
        
        # Test download (this might take a moment)
        print("📥 Testing repository download (this may take a few seconds)...")
        repo_path, error = test_handler.download_repo(test_url)
        
        if error:
            print(f"❌ Download error: {error}")
            return False
        else:
            print(f"✅ Repository downloaded to: {repo_path}")
            
            # Test analysis
            print("🔍 Testing code analysis...")
            analysis, error = test_handler.analyze_codebase(repo_path)
            
            if error:
                print(f"❌ Analysis error: {error}")
                return False
            else:
                file_count = len(analysis['file_structure'].split('\n')) if analysis['file_structure'] else 0
                python_files = len(analysis.get('python_code_summary', {}))
                print(f"✅ Analysis complete: {file_count} files, {python_files} Python files")
                return True
                
    except Exception as e:
        print(f"❌ Error testing repository download: {str(e)}")
        return False

def test_full_generation():
    """Test full README generation"""
    print("\n📝 Testing full README generation...")
    
    try:
        # Import the AI generation function directly
        import google.generativeai as genai
        import os
        
        class FullTestHandler:
            def normalize_github_url(self, repo_url: str) -> str:
                """Normalize GitHub URL by removing .git suffix and trailing slashes"""
                normalized_url = repo_url.strip()
                if normalized_url.endswith('/'):
                    normalized_url = normalized_url[:-1]
                if normalized_url.endswith('.git'):
                    normalized_url = normalized_url[:-4]
                return normalized_url

            def download_repo(self, repo_url: str):
                import tempfile
                import shutil
                import requests
                import zipfile
                import os
                
                try:
                    # First normalize the URL
                    normalized_url = self.normalize_github_url(repo_url)
                    
                    if "github.com" in normalized_url:
                        api_url = normalized_url.replace("github.com", "api.github.com/repos")
                        zip_url = api_url + "/zipball"
                    else:
                        return None, "Invalid GitHub URL"
                    
                    response = requests.get(zip_url, timeout=30)
                    if response.status_code != 200:
                        return None, f"Failed to download repository: {response.status_code}"
                    
                    temp_dir = tempfile.mkdtemp()
                    zip_path = os.path.join(temp_dir, "repo.zip")
                    
                    with open(zip_path, 'wb') as f:
                        f.write(response.content)
                    
                    extract_dir = os.path.join(temp_dir, "extracted")
                    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                        zip_ref.extractall(extract_dir)
                    
                    extracted_items = os.listdir(extract_dir)
                    if extracted_items:
                        repo_dir = os.path.join(extract_dir, extracted_items[0])
                        return repo_dir, None
                    
                    return None, "Failed to extract repository"
                except Exception as e:
                    return None, str(e)

            def analyze_codebase(self, repo_path: str):
                import os
                import ast
                
                try:
                    context = {"file_structure": "", "dependencies": "No dependency file found.", "python_code_summary": {}}
                    ignore_list = ['.git', '__pycache__', 'node_modules', '.venv', 'venv', 'target', 'dist', 'build']
                    file_structure_list = []
                    
                    for root, dirs, files in os.walk(repo_path, topdown=True):
                        dirs[:] = [d for d in dirs if d not in ignore_list]
                        level = root.replace(repo_path, '').count(os.sep)
                        indent = ' ' * 4 * level
                        file_structure_list.append(f"{indent}📂 {os.path.basename(root)}/")
                        sub_indent = ' ' * 4 * (level + 1)
                        
                        for f in files:
                            file_structure_list.append(f"{sub_indent}📄 {f}")
                            file_path = os.path.join(root, f)
                            
                            if f.endswith('.py'):
                                try:
                                    with open(file_path, 'r', encoding='utf-8') as py_file:
                                        source_code = py_file.read()
                                        tree = ast.parse(source_code)
                                        summary = {"functions": [], "classes": []}
                                        for node in ast.walk(tree):
                                            if isinstance(node, ast.FunctionDef):
                                                docstring = ast.get_docstring(node) or "No docstring."
                                                summary["functions"].append(f"def {node.name}(...): # {docstring[:80]}")
                                            elif isinstance(node, ast.ClassDef):
                                                docstring = ast.get_docstring(node) or "No docstring."
                                                summary["classes"].append(f"class {node.name}: # {docstring[:80]}")
                                        if summary["functions"] or summary["classes"]:
                                             context["python_code_summary"][f] = summary
                                except Exception as e:
                                    print(f"Could not parse Python file {file_path}: {e}")
                            elif f in ['requirements.txt', 'package.json', 'pyproject.toml', 'pom.xml']:
                                try:
                                    with open(file_path, 'r', encoding='utf-8') as file_content:
                                        context["dependencies"] = file_content.read()
                                except Exception: pass
                    
                    context["file_structure"] = "\n".join(file_structure_list)
                    return context, None
                except Exception as e:
                    return None, str(e)
                    
            def generate_readme_with_gemini(self, analysis_context: dict, project_name: str = None, include_demo: bool = False, num_screenshots: int = 0, num_videos: int = 0):
                api_key = os.environ.get("GOOGLE_API_KEY")
                if not api_key:
                    return None, "Google AI API key not configured"
                
                try:
                    # Configure Gemini
                    genai.configure(api_key=api_key)
                    
                    # Create a simple prompt for testing
                    python_summary_str = ""
                    for filename, summary in analysis_context.get('python_code_summary', {}).items():
                        python_summary_str += f"\nFile: `{filename}`:\n"
                        if summary['classes']: 
                            python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
                        if summary['functions']: 
                            python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"
                    
                    title_instruction = ""
                    if project_name and project_name.strip():
                        title_instruction = f"Use the exact project title \"{project_name}\". Center it and add a compelling tagline."
                    else:
                        title_instruction = "Create a compelling, professional title based on the analysis."
                    
                    prompt = f"""
Based on this repository analysis, generate a comprehensive README.md:

File Structure:
{analysis_context['file_structure'][:2000]}

Dependencies:
{analysis_context['dependencies'][:500]}

Python Code Summary:
{python_summary_str[:1000]}

{title_instruction}

Generate a professional README.md with proper sections: title, overview, features, tech stack, installation, usage, contributing, license.
Return only the markdown content.
"""
                    
                    model = genai.GenerativeModel('gemini-2.0-flash-exp')
                    response = model.generate_content(prompt)
                    
                    if response.parts and response.text:
                        return response.text.strip(), None
                    else:
                        return None, "No response from AI"
                        
                except Exception as e:
                    return None, str(e)
        
        test_handler = FullTestHandler()
        
        # Test the full generation pipeline
        test_url = "https://github.com/Deepender25/CursorViaCam.git"
        
        print(f"🔄 Generating README for: {test_url}")
        
        # Download repository
        repo_path, error = test_handler.download_repo(test_url)
        if error:
            print(f"❌ Download failed: {error}")
            return False
            
        # Analyze codebase
        analysis, error = test_handler.analyze_codebase(repo_path)
        if error:
            print(f"❌ Analysis failed: {error}")
            return False
            
        # Generate README
        readme_content, error = test_handler.generate_readme_with_gemini(
            analysis, "CursorViaCam", False, 0, 0
        )
        
        if error:
            print(f"❌ README generation failed: {error}")
            return False
        else:
            print(f"✅ README generated successfully! Length: {len(readme_content)} characters")
            
            # Show first few lines
            lines = readme_content.split('\n')[:10]
            print("\n📄 First few lines of generated README:")
            print("-" * 50)
            for line in lines:
                print(line)
            print("-" * 50)
            
            return True
            
    except Exception as e:
        print(f"❌ Error testing full generation: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🧪 Direct API Testing for README Generator")
    print("=" * 50)
    
    # Test 1: Google AI connection
    ai_works = test_google_ai()
    
    # Test 2: Repository download
    download_works = test_download_repo()
    
    # Test 3: Full generation (only if previous tests pass)
    if ai_works and download_works:
        generation_works = test_full_generation()
    else:
        print("\n⚠️ Skipping full generation test due to previous failures")
        generation_works = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Google AI API: {'✅ Working' if ai_works else '❌ Failed'}")
    print(f"   Repository Download: {'✅ Working' if download_works else '❌ Failed'}")
    print(f"   Full README Generation: {'✅ Working' if generation_works else '❌ Failed'}")
    
    if ai_works and download_works and generation_works:
        print("\n🎉 All tests passed! The API should work correctly.")
        print("💡 Issue might be with development server setup or routing.")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    main()
