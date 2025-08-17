from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import os
import tempfile
import shutil
import requests
import zipfile
import ast
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Google AI Configuration
try:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    AI_AVAILABLE = True
except:
    AI_AVAILABLE = False

# GitHub OAuth Configuration
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "https://autodocai.vercel.app/auth/callback")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.do_request()

    def do_POST(self):
        self.do_request()
    
    def do_DELETE(self):
        self.do_request()

    def do_request(self):
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)

        protected_paths = [
            '/api/repositories',
            '/api/generate',
            '/api/history',
            '/api/history/' # for individual history items
        ]

        # Centralized authentication check
        if any(parsed_url.path.startswith(p) for p in protected_paths):
            user_data = self.get_user_from_cookie()
            if not user_data:
                self.send_json_response({'error': 'Authentication required.'}, 401)
                return
            if 'access_token' not in user_data:
                self.send_json_response({'error': 'Invalid authentication.'}, 401)
                return

        if parsed_url.path == '/auth/github':
            self.handle_github_auth()
        elif parsed_url.path == '/auth/callback':
            self.handle_github_callback(query_params)
        elif parsed_url.path == '/api/repositories':
            self.handle_repositories()
        elif parsed_url.path == '/api/generate':
            self.handle_generate(query_params)
        elif parsed_url.path == '/api/history':
            self.handle_history()
        elif parsed_url.path.startswith('/api/history/'):
            history_id = parsed_url.path.split('/')[-1]
            self.handle_history_item(history_id)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def handle_github_auth(self):
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
            self.send_json_response({'error': 'GitHub OAuth not configured.'}, 500)
            return
        
        # Use environment variable first, then dynamic detection
        redirect_uri = os.getenv("GITHUB_REDIRECT_URI")
        if not redirect_uri:
            # Fallback to dynamic detection
            host = self.headers.get('Host')
            if host:
                protocol = 'https' if 'localhost' not in host else 'http'
                redirect_uri = f"{protocol}://{host}/auth/callback"
            else:
                # Final fallback
                redirect_uri = "https://autodocai.vercel.app/auth/callback"
            
        github_auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={redirect_uri}&scope=repo"
        self.send_response(302)
        self.send_header('Location', github_auth_url)
        self.end_headers()

    def handle_github_callback(self, query_params):
        code = query_params.get('code', [None])[0]
        if not code:
            self.send_error(400, "Missing authorization code")
            return
        
        try:
            token_response = requests.post('https://github.com/login/oauth/access_token', {
                'client_id': GITHUB_CLIENT_ID,
                'client_secret': GITHUB_CLIENT_SECRET,
                'code': code
            }, headers={'Accept': 'application/json'})
            
            token_data = token_response.json()
            access_token = token_data.get('access_token')
            
            if not access_token:
                self.send_response(302)
                self.send_header('Location', '/?error=token_failed')
                self.end_headers()
                return
            
            user_response = requests.get('https://api.github.com/user', 
                headers={'Authorization': f'token {access_token}'})
            
            if user_response.status_code != 200:
                self.send_response(302)
                self.send_header('Location', '/?error=user_failed')
                self.end_headers()
                return
            
            user_data = user_response.json()
            
            user_session_data = {
                'github_id': user_data['id'],
                'username': user_data['login'],
                'name': user_data.get('name', user_data['login']),
                'avatar_url': user_data['avatar_url'],
                'html_url': user_data['html_url'],
                'access_token': access_token
            }
            
            session_data = base64.b64encode(json.dumps(user_session_data).encode()).decode()
            
            self.send_response(302)
            self.send_header('Location', f'/?auth_success={urllib.parse.quote(session_data)}')
            
            cookie_value = f'github_user={session_data}; Path=/; Max-Age=86400; SameSite=Lax'
            self.send_header('Set-Cookie', cookie_value)
            
            self.end_headers()
            
        except Exception as e:
            self.send_response(302)
            self.send_header('Location', f'/?error=auth_failed')
            self.end_headers()

    def handle_repositories(self):
        user_data = self.get_user_from_cookie() # user_data is guaranteed to be valid here
        
        try:
            headers = {'Authorization': f'token {user_data["access_token"]}'}
            
            response = requests.get('https://api.github.com/user/repos?sort=updated&per_page=50', headers=headers)
            
            if response.status_code == 401:
                self.send_json_response({'error': 'GitHub authentication expired.'}, 401)
                return
            elif response.status_code != 200:
                self.send_json_response({'error': f'GitHub API error: {response.status_code}'}, 500)
                return
            
            repos = response.json()
            
            formatted_repos = []
            for repo in repos:
                formatted_repos.append({
                    'name': repo['name'],
                    'full_name': repo['full_name'],
                    'description': repo['description'],
                    'html_url': repo['html_url'],
                    'language': repo['language'],
                    'stargazers_count': repo['stargazers_count'],
                    'updated_at': repo['updated_at'],
                    'private': repo['private']
                })
            
            self.send_json_response({'repositories': formatted_repos})
            
        except Exception as e:
            self.send_json_response({'error': f'Failed to fetch repositories: {str(e)}'}, 500)

    def handle_generate(self, query_params):
        repo_url = query_params.get('repo_url', [''])[0]
        project_name = query_params.get('project_name', [''])[0]
        include_demo = query_params.get('include_demo', ['false'])[0].lower() == 'true'
        num_screenshots = int(query_params.get('num_screenshots', ['0'])[0])
        num_videos = int(query_params.get('num_videos', ['0'])[0])
        
        if not repo_url:
            self.send_json_response({"error": "Repository URL is required"}, 400)
            return
        
        try:
            repo_path, error = self.download_repo(repo_url)
            if error:
                self.send_json_response({"error": error}, 400)
                return
            
            analysis, error = self.analyze_codebase(repo_path)
            if error:
                self.send_json_response({"error": error}, 500)
                return
            
            readme_content, error = self.generate_readme_with_gemini(
                analysis, project_name, include_demo, num_screenshots, num_videos
            )
            if error:
                self.send_json_response({"error": error}, 500)
                return
            
            if repo_path and os.path.exists(repo_path):
                shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
            
            # Save to history if user is authenticated
            user_data = self.get_user_from_cookie()
            if user_data and readme_content:
                from .database import save_readme_history
                try:
                    # Extract repository name from URL
                    repo_name = repo_url.split('/')[-2:] if '/' in repo_url else [repo_url]
                    repo_name = '/'.join(repo_name).replace('.git', '')
                    
                    print(f"💾 Saving history for user: {user_data.get('username', 'unknown')}")
                    print(f"📁 Repository: {repo_name}")
                    
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
                        print("✅ History saved successfully")
                    else:
                        print("❌ History save failed")
                        
                except Exception as e:
                    print(f"⚠️ Failed to save history: {e}")
            else:
                if not user_data:
                    print("⚠️ No user authentication - history not saved")
                if not readme_content:
                    print("⚠️ No README content - history not saved")
            
            self.send_json_response({"readme": readme_content})
            
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

    def get_user_from_cookie(self):
        cookie_header = self.headers.get('Cookie', '')
        
        if 'github_user=' in cookie_header:
            for cookie in cookie_header.split(';'):
                if cookie.strip().startswith('github_user='):
                    try:
                        cookie_value = cookie.split('=')[1].strip()
                        user_data = json.loads(base64.b64decode(cookie_value).decode())
                        return user_data
                    except Exception as e:
                        return None
        
        return None

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
            return None, "Google AI not available."
        
        try:
            python_summary_str = ""
            for filename, summary in analysis_context.get('python_code_summary', {}).items():
                python_summary_str += f"\nFile: `{filename}`:\n"
                if summary['classes']: 
                    python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
                if summary['functions']: 
                    python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"

            demo_section = ""
            if include_demo and (num_screenshots > 0 or num_videos > 0):
                demo_section += "\n\n## 📸 Demo & Screenshots\n\n"
                
                if num_screenshots > 0:
                    demo_section += "### 🖼️ Screenshots\n\n"
                    for i in range(1, num_screenshots + 1):
                        demo_section += f'<img src="https://placehold.co/800x450/2d2d4d/ffffff?text=App+Screenshot+{i}" alt="App Screenshot {i}" width="100%">\n'
                        demo_section += f'<p align="center"><em>Caption for screenshot {i}.</em></p>\n\n'
                
                if num_videos > 0:
                    demo_section += "### 🎬 Video Demos\n\n"
                    for i in range(1, num_videos + 1):
                        demo_section += f'<a href="https://example.com/your-video-link-{i}" target="_blank">\n'
                        demo_section += f'  <img src="https://placehold.co/800x450/2d2d4d/c5a8ff?text=Watch+Video+Demo+{i}" alt="Video Demo {i}" width="100%">\n'
                        demo_section += f'</a>\n'
                        demo_section += f'<p align="center"><em>Caption for video demo {i}.</em></p>\n\n'

            title_instruction = ""
            if project_name and project_name.strip():
                title_instruction = f"""Use the exact project title "{project_name}". Center it and add a compelling tagline.
                `<h1 align="center"> {project_name} </h1>`
                `<p align="center"> [CREATE A COMPELLING TAGLINE HERE] </p>`"""
            else:
                title_instruction = """Create a compelling, professional title based on the analysis. Center it and add a concise tagline.
                `<h1 align="center"> [PROJECT TITLE] </h1>`
                `<p align="center"> [TAGLINE] </p>`"""

            # Enhanced prompt from main.py with superior structure
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

1.  **Project Title:** {title_instruction}

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
            return None, str(e)

    def handle_history(self):
        """Handle history requests"""
        print("🔄 History request received")
        user_data = self.get_user_from_cookie() # user_data is guaranteed to be valid here
        
        print(f"👤 User authenticated: {user_data.get('username', 'unknown')}")
        
        if self.command == 'GET':
            # Get user history
            from .database import get_user_history
            try:
                user_id = str(user_data.get('github_id', ''))
                print(f"🔍 Getting history for user ID: {user_id}")
                
                history = get_user_history(user_id)
                print(f"📊 Retrieved {len(history)} history items")
                
                self.send_json_response({'history': history})
            except Exception as e:
                print(f"❌ Error retrieving history: {str(e)}")
                self.send_json_response({'error': f'Failed to retrieve history: {str(e)}'}, 500)
        
        elif self.command == 'DELETE':
            # Delete all user history
            from .database import delete_all_user_history
            try:
                user_id = str(user_data.get('github_id', ''))
                print(f"🗑️ Deleting all history for user ID: {user_id}")
                
                success = delete_all_user_history(user_id)
                if success:
                    print("✅ All user history deleted successfully")
                    self.send_json_response({'message': 'All history deleted successfully'})
                else:
                    print("❌ Failed to delete user history")
                    self.send_json_response({'error': 'Failed to delete history'}, 400)
            except Exception as e:
                print(f"❌ Error deleting history: {str(e)}")
                self.send_json_response({'error': f'Failed to delete history: {str(e)}'}, 500)
        
        else:
            self.send_json_response({'error': 'Method not allowed'}, 405)

    def handle_history_item(self, history_id):
        """Handle individual history item requests"""
        user_data = self.get_user_from_cookie() # user_data is guaranteed to be valid here
        
        user_id = str(user_data.get('github_id', ''))
        
        if self.command == 'GET':
            # Get specific history item
            from .database import get_history_item
            try:
                item = get_history_item(history_id, user_id)
                if item:
                    self.send_json_response({'item': item})
                else:
                    self.send_json_response({'error': 'History item not found'}, 404)
            except Exception as e:
                self.send_json_response({'error': f'Failed to retrieve history item: {str(e)}'}, 500)
        
        elif self.command == 'DELETE':
            # Delete history item
            from .database import delete_history_item
            try:
                success = delete_history_item(history_id, user_id)
                if success:
                    self.send_json_response({'message': 'History item deleted successfully'})
                else:
                    self.send_json_response({'error': 'Failed to delete history item'}, 400)
            except Exception as e:
                self.send_json_response({'error': f'Failed to delete history item: {str(e)}'}, 500)
        
        else:
            self.send_json_response({'error': 'Method not allowed'}, 405)
