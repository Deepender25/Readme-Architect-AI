from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import os
import tempfile
import shutil
import requests
import zipfile
import ast

# Google AI Configuration
try:
    import google.generativeai as genai
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("WARNING: GOOGLE_API_KEY environment variable not set")
        AI_AVAILABLE = False
    else:
        genai.configure(api_key=api_key)
        AI_AVAILABLE = True
        print("Google AI API configured successfully")
except Exception as e:
    print(f"ERROR configuring Google AI: {str(e)}")
    AI_AVAILABLE = False

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            self.handle_generate()
        except Exception as e:
            print(f"ERROR in do_GET: {str(e)}")
            self.send_json_response({"error": f"Server error: {str(e)}"}, 500)

    def do_POST(self):
        try:
            self.handle_generate()
        except Exception as e:
            print(f"ERROR in do_POST: {str(e)}")
            self.send_json_response({"error": f"Server error: {str(e)}"}, 500)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def handle_generate(self):
        # Parse query parameters
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        print(f"📝 Generate request: {self.path}")
        print(f"📝 Query params: {query_params}")
        
        # Health check endpoint
        if query_params.get('health'):
            self.send_json_response({
                "status": "ok", 
                "ai_available": AI_AVAILABLE,
                "message": "README Generator API is running"
            })
            return
        
        # Extract parameters
        repo_url = query_params.get('repo_url', [''])[0]
        project_name = query_params.get('project_name', [''])[0]
        include_demo = query_params.get('include_demo', ['false'])[0].lower() == 'true'
        
        try:
            num_screenshots = int(query_params.get('num_screenshots', ['0'])[0])
            num_videos = int(query_params.get('num_videos', ['0'])[0])
        except ValueError:
            num_screenshots = 0
            num_videos = 0
        
        # Validate required parameters
        if not repo_url:
            self.send_json_response({"error": "Repository URL is required"}, 400)
            return
            
        if not ("github.com" in repo_url):
            self.send_json_response({"error": "Only GitHub repositories are supported"}, 400)
            return
        
        print(f"🔄 Processing: {repo_url}")
        
        try:
            # Download repository
            repo_path, error = self.download_repo(repo_url)
            if error:
                self.send_json_response({"error": error}, 400)
                return
            
            # Analyze codebase
            analysis, error = self.analyze_codebase(repo_path)
            if error:
                self.send_json_response({"error": error}, 500)
                return
            
            # Generate README
            readme_content, error = self.generate_readme_with_gemini(
                analysis, project_name, include_demo, num_screenshots, num_videos
            )
            if error:
                self.send_json_response({"error": error}, 500)
                return
            
            # Clean up temporary files
            if repo_path and os.path.exists(repo_path):
                try:
                    shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
                except:
                    pass
            
            print(f"✅ README generated successfully ({len(readme_content)} chars)")
            
            # Save to history if user is authenticated
            try:
                # Check for user authentication via cookie
                cookie_header = self.headers.get('Cookie', '')
                user_data = None
                
                if 'github_user=' in cookie_header:
                    for cookie in cookie_header.split(';'):
                        if cookie.strip().startswith('github_user='):
                            try:
                                import base64
                                import json
                                cookie_value = cookie.split('=')[1].strip()
                                user_data = json.loads(base64.b64decode(cookie_value).decode())
                                break
                            except Exception:
                                pass
                
                if user_data and readme_content:
                    from .database import save_readme_history
                    try:
                        # Extract repository name from URL
                        repo_name = repo_url.split('/')[-2:] if '/' in repo_url else [repo_url]
                        repo_name = '/'.join(repo_name).replace('.git', '')
                        
                        print(f"💾 Saving history for user: {user_data.get('username', 'unknown')}")
                        
                        success = save_readme_history(
                            user_id=str(user_data.get('github_id', '')),
                            username=user_data.get('username', ''),
                            repository_url=repo_url,
                            repository_name=repo_name,
                            readme_content=readme_content,
                            project_name=project_name if project_name else None,
                            generation_params={
                                'include_demo': include_demo,
                                'num_screenshots': num_screenshots,
                                'num_videos': num_videos
                            }
                        )
                        
                        if success:
                            print("✅ History saved successfully in generate.py")
                        else:
                            print("❌ History save failed in generate.py")
                            
                    except Exception as e:
                        print(f"⚠️ Failed to save history in generate.py: {e}")
                else:
                    print("⚠️ No user authentication or content - history not saved in generate.py")
                        
            except Exception as e:
                print(f"⚠️ Error checking user authentication in generate.py: {e}")
            
            self.send_json_response({"readme": readme_content})
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            self.send_json_response({"error": str(e)}, 500)

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def download_repo(self, repo_url: str):
        try:
            if "github.com" in repo_url:
                repo_url = repo_url.replace("github.com", "api.github.com/repos")
                if repo_url.endswith("/"):
                    repo_url = repo_url[:-1]
                zip_url = repo_url + "/zipball"
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
        try:
            print("Starting deep code analysis...")
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
            print("Deep code analysis finished.")
            return context, None
        except Exception as e:
            return None, str(e)

    def generate_readme_with_gemini(self, analysis_context: dict, project_name: str = None, include_demo: bool = False, num_screenshots: int = 0, num_videos: int = 0):
        if not AI_AVAILABLE:
            return None, "Google AI not available. Please check your API key configuration."
        
        print(f"🤖 Starting README generation for: {project_name or 'Unnamed Project'}")
        
        try:
            # Prepare Python code summary
            python_summary_str = ""
            for filename, summary in analysis_context.get('python_code_summary', {}).items():
                python_summary_str += f"\nFile: `{filename}`:\n"
                if summary['classes']: 
                    python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
                if summary['functions']: 
                    python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"

            # Enhanced demo section from main.py - only if demo is enabled AND has content
            demo_section = ""
            if include_demo and (num_screenshots > 0 or num_videos > 0):
                demo_section += "\n\n## 📸 Demo & Screenshots\n\n"
                
                if num_screenshots > 0:
                    demo_section += "## 🖼️ Screenshots\n\n"
                    for i in range(1, num_screenshots + 1):
                        demo_section += f'  <img src="https://placehold.co/800x450/2d2d4d/ffffff?text=App+Screenshot+{i}" alt="App Screenshot {i}" width="100%">\n'
                        demo_section += f'  <em><p align="center">Caption for screenshot {i}.</p></em>\n'
                    demo_section += "\n"
                
                if num_videos > 0:
                    demo_section += "## 🎬 Video Demos\n\n"
                    for i in range(1, num_videos + 1):
                        demo_section += f'  <a href="https://example.com/your-video-link-{i}" target="_blank">\n'
                        demo_section += f'    <img src="https://placehold.co/800x450/2d2d4d/c5a8ff?text=Watch+Video+Demo+{i}" alt="Video Demo {i}" width="100%">\n'
                        demo_section += f'  </a>\n'
                        demo_section += f'  <em><p align="center">Caption for video demo {i}.</p></em>\n'
                    demo_section += "\n"

            # Set title instruction based on provided project name
            title_instruction = ""
            if project_name and project_name.strip():
                title_instruction = f"""Use the exact project title "{project_name}". Center it and add a compelling tagline.
                `<h1 align="center"> {project_name} </h1>`
                `<p align="center"> [CREATE A COMPELLING TAGLINE HERE] </p>`"""
            else:
                title_instruction = """Create a compelling, professional title based on the analysis. Center it and add a concise tagline.
                `<h1 align="center"> [PROJECT TITLE] </h1>`
                `<p align="center"> [TAGLINE] </p>`"""

            # Restored original working prompt with better aesthetics
            prompt = f"""
**Your Role:** You are a Principal Solutions Architect and a world-class technical copywriter. You are tasked with writing a stunning, comprehensive, and professional README.md file for a new open-source project. Your work must be impeccable.

**Source Analysis Provided:**
1.  **Project File Structure:**
    ```
    {analysis_context['file_structure']}
    ```
2.  **Dependencies:**
    ```
    {analysis_context['dependencies']}
    ```
3.  **Python Code Semantic Summary:**
    ```
    {python_summary_str if python_summary_str else "No Python files were analyzed."}
    ```

**Core Mandate:**
Based *only* on the analysis above, generate a complete README.md. You MUST make intelligent, bold inferences about the project's purpose, architecture, and features. The tone must be professional, engaging, and polished. Use rich Markdown formatting, including emojis, tables, and blockquotes, to create a visually appealing document.

**Strict README.md Structure (Follow this format precisely):**

{title_instruction}

2.  **Badges:** Create a centered paragraph of **static placeholder badges**. These badges must look professional and use generic, positive text (e.g., "Build: Passing"). This prevents "repo not found" errors on first generation. CRUCIALLY, you MUST add an HTML comment `<!-- ... -->` right after the badges, instructing the user to replace them with their own live badges.
    Example format to follow exactly:
    <p align="center">
      <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
      <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-blue?style=for-the-badge">
      <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
      <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
    </p>
    <!-- 
      **Note:** These are static placeholder badges. Replace them with your project's actual badges.
      You can generate your own at https://shields.io
    -->

3.  **Table of Contents:** Create a clickable table of contents with these sections:
    - [Overview](#-overview)
    - [Key Features](#-key-features)
    - [Tech Stack & Architecture](#️-tech-stack--architecture)
    {f"- [Demo & Screenshots](#-demo--screenshots)" if include_demo and (num_screenshots > 0 or num_videos > 0) else ""}
    - [Getting Started](#-getting-started)
    - [Usage](#-usage)
    - [Contributing](#-contributing)
    - [License](#-license)

4.  **⭐ Overview:**
    -   **Hook:** Start with a compelling, single-sentence summary of the project.
    -   **The Problem:** In a blockquote, describe the problem this project solves.
    -   **The Solution:** Describe how your project provides an elegant solution to that problem.
    -   **Inferred Architecture:** Based on the file structure and dependencies, describe the high-level architecture (e.g., "This project is a FastAPI-based web service...").

5.  **✨ Key Features:**
    -   A detailed, bulleted list. For each feature, provide a brief but impactful explanation.
    -   Infer at least 4-5 key features from the code and file structure.
    -   Example: `- **Automated Analysis:** Leverages AST to perform deep static analysis of Python code.`

6.  **🛠️ Tech Stack & Architecture:**
    -   Create a Markdown table listing the primary technologies, languages, and major libraries.
    -   Include columns for "Technology", "Purpose", and "Why it was Chosen".
    -   Example Row: `| FastAPI | API Framework | For its high performance, async support, and automatic docs generation. |`

{demo_section}

7.  **🚀 Getting Started:**
    -   **Prerequisites:** A bulleted list of software the user needs (e.g., Python 3.9+, Node.js v18+).
    -   **Installation:** A numbered, step-by-step guide with explicit, copy-pastable commands in code blocks for different package managers if inferable (e.g., `pip install -r requirements.txt`).

8.  **🔧 Usage:**
    -   Provide clear instructions on how to run the application (e.g., `uvicorn main:app --reload`).
    -   If it's an API, provide a `curl` example. If it's a CLI, provide a command-line example.

9.  **🤝 Contributing:**
    -   A welcoming section encouraging contributions.
    -   Briefly outline the fork -> branch -> pull request workflow.

10. **📝 License:**
    -   State the license (e.g., "Distributed under the MIT License. See `LICENSE` for more information.").

**Final Instruction:** The output MUST be ONLY the raw Markdown content. Do not add any commentary, greetings, or explanations before or after the Markdown. Adhere strictly to the requested format and quality bar.
"""

            # Create a fallback README in case the API fails
            fallback_readme = f"""# {project_name or "Project README"}

## Overview
This is an auto-generated README for your project.

## Features
- Feature 1
- Feature 2
- Feature 3

## Getting Started
1. Clone the repository
2. Install dependencies
3. Run the application

## License
MIT
"""
            
            try:
                # Use gemini-2.5-flash for better results (from main.py)
                print("🤖 Initializing Gemini 2.5 Flash model...")
                model = genai.GenerativeModel('gemini-2.5-flash')
                
                print("🤖 Sending enhanced prompt to Gemini...")
                response = model.generate_content(prompt)
                
                if not response.parts:
                    print("❌ Content generation failed due to safety filters")
                    return None, "Content generation failed due to safety filters"
                
                readme_content = response.text.strip()
                print(f"✅ Enhanced README generated successfully ({len(readme_content)} chars)")
                
                return readme_content, None
                
            except Exception as e:
                print(f"❌ Gemini error: {str(e)}")
                return None, f"AI generation failed: {str(e)}"
                
        except Exception as e:
            return None, str(e)