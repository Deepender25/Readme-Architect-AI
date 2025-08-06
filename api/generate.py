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

            # Ultra-comprehensive prompt for maximum detail and quality
            prompt = f"""
**Your Role:** You are a Senior Principal Solutions Architect, Technical Lead, and world-class technical copywriter with 15+ years of experience. You are tasked with writing an absolutely stunning, comprehensive, and professional README.md file for a new open-source project. Your work must be impeccable and industry-leading.

**Source Analysis Provided:**
1.  **Project File Structure:**
    ```
    {analysis_context['file_structure']}
    ```
2.  **Dependencies & Configuration:**
    ```
    {analysis_context['dependencies']}
    ```
3.  **Python Code Semantic Analysis:**
    ```
    {python_summary_str if python_summary_str else "No Python files were analyzed."}
    ```

**Core Mandate:**
Based *exclusively* on the analysis above, generate a complete, production-ready README.md. You MUST make intelligent, sophisticated inferences about the project's purpose, architecture, features, and implementation details. The tone must be professional, engaging, and polished. Use rich Markdown formatting, including emojis, tables, blockquotes, code blocks, and visual elements to create a visually stunning document that developers will love.

**CRITICAL: Analyze the codebase deeply and provide specific, technical insights rather than generic descriptions.**

**Strict README.md Structure (Follow this format precisely):**

1.  **Project Title & Branding:** {title_instruction}

2.  **Professional Badge Section:** Create a centered paragraph of **static placeholder badges** with professional styling. Use shields.io format with for-the-badge style. Include build status, version, license, contributions, issues, and language-specific badges. CRUCIALLY, add an HTML comment instructing users to replace with live badges.
    
    Example format:
    ```html
    <p align="center">
      <img alt="Build Status" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github">
      <img alt="Version" src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge">
      <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
      <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-orange?style=for-the-badge">
      <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-green?style=for-the-badge">
    </p>
    <!-- 
      Replace these static badges with live ones from your repository.
      Visit https://shields.io to generate badges for your specific repo.
    -->
    ```

3.  **Comprehensive Table of Contents:** Create a detailed, clickable table of contents:
    ```markdown
    ## 📚 Table of Contents
    - [⭐ Overview](#-overview)
    - [🎯 Problem & Solution](#-problem--solution)
    - [✨ Key Features](#-key-features)
    - [🏗️ Architecture & Design](#️-architecture--design)
    - [🛠️ Tech Stack](#️-tech-stack)
    - [📋 Prerequisites](#-prerequisites)
    {f"- [📸 Demo & Screenshots](#-demo--screenshots)" if include_demo and (num_screenshots > 0 or num_videos > 0) else ""}
    - [🚀 Quick Start](#-quick-start)
    - [⚙️ Installation](#️-installation)
    - [🔧 Configuration](#-configuration)
    - [💻 Usage](#-usage)
    - [📖 API Documentation](#-api-documentation)
    - [🧪 Testing](#-testing)
    - [🚀 Deployment](#-deployment)
    - [🤝 Contributing](#-contributing)
    - [📝 License](#-license)
    - [🙏 Acknowledgments](#-acknowledgments)
    ```

4.  **⭐ Overview Section:**
    Write a compelling 2-3 paragraph overview that includes:
    - A powerful opening sentence that immediately conveys the project's value
    - The specific problem domain this project addresses
    - What makes this solution unique or innovative
    - Target audience (developers, businesses, etc.)
    - Brief mention of key technologies used

5.  **🎯 Problem & Solution Section:**
    ```markdown
    ## 🎯 Problem & Solution
    
    ### The Challenge
    > Describe the specific problem this project solves with a compelling blockquote
    
    ### Our Solution
    Explain how this project elegantly addresses the challenge with specific technical approaches.
    
    ### Why This Matters
    Articulate the broader impact and value proposition.
    ```

6.  **✨ Key Features Section:**
    Create a detailed feature list with at least 6-8 features. Each feature should:
    - Have a descriptive name with an emoji
    - Include a 1-2 sentence explanation of the feature
    - Mention specific technical implementation details when possible
    - Use sub-bullets for feature details when appropriate
    
    Example format:
    ```markdown
    - 🚀 **High-Performance Architecture** - Built with [specific technology] for optimal performance
      - Handles X requests per second
      - Memory-efficient design
      - Asynchronous processing capabilities
    ```

7.  **🏗️ Architecture & Design Section:**
    Based on the file structure and dependencies, create:
    - A high-level architecture description
    - Component interaction explanation
    - Design patterns used
    - Scalability considerations
    - Security measures implemented

8.  **🛠️ Tech Stack Section:**
    Create a comprehensive table with these columns:
    | Category | Technology | Version | Purpose | Why Chosen |
    
    Include categories like:
    - Backend Framework
    - Database
    - Frontend (if applicable)
    - Authentication
    - Testing
    - Deployment
    - Monitoring
    - Development Tools

{demo_section}

9.  **📋 Prerequisites Section:**
    List all requirements with specific versions:
    - Runtime requirements (Python 3.9+, Node.js 18+, etc.)
    - System dependencies
    - External services needed
    - Development tools required

10. **🚀 Quick Start Section:**
    Provide a rapid setup guide for users who want to get running immediately:
    ```bash
    # One-liner installation and setup
    git clone [repo] && cd [repo] && [setup commands]
    ```

11. **⚙️ Installation Section:**
    Detailed step-by-step installation with:
    - Multiple installation methods (pip, npm, docker, etc.)
    - Platform-specific instructions
    - Troubleshooting common issues
    - Verification steps

12. **🔧 Configuration Section:**
    - Environment variables explanation
    - Configuration file examples
    - Security considerations
    - Performance tuning options

13. **💻 Usage Section:**
    Provide comprehensive usage examples:
    - Basic usage with code examples
    - Advanced usage scenarios
    - Command-line interface examples
    - API usage examples with curl/code
    - Integration examples

14. **📖 API Documentation Section:**
    If the project has an API, include:
    - Endpoint overview
    - Authentication methods
    - Request/response examples
    - Error handling
    - Rate limiting information

15. **🧪 Testing Section:**
    - How to run tests
    - Test coverage information
    - Testing strategies used
    - How to write new tests

16. **🚀 Deployment Section:**
    - Production deployment guide
    - Docker deployment
    - Cloud platform instructions
    - Environment-specific configurations
    - Monitoring and logging setup

17. **🤝 Contributing Section:**
    Create a welcoming and detailed contribution guide:
    - Code of conduct reference
    - Development setup
    - Coding standards
    - Pull request process
    - Issue reporting guidelines
    - Recognition for contributors

18. **📝 License Section:**
    - License type and link
    - Copyright information
    - Third-party licenses if applicable

19. **🙏 Acknowledgments Section:**
    - Credits to contributors
    - Inspiration sources
    - Third-party tools and libraries used
    - Community thanks

**CRITICAL REQUIREMENTS:**
1. **Be Specific:** Use actual technical details from the analysis, not generic descriptions
2. **Be Comprehensive:** This should be a complete, production-ready README
3. **Be Professional:** Use proper technical terminology and industry best practices
4. **Be Visual:** Use emojis, tables, code blocks, and formatting for visual appeal
5. **Be Actionable:** Every instruction should be copy-pastable and executable
6. **Be Accurate:** Only include information that can be inferred from the provided analysis

**Final Instruction:** Output ONLY the raw Markdown content. No commentary, greetings, or explanations. The README should be immediately usable in a production repository.
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