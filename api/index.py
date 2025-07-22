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

    def do_request(self):
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        if parsed_url.path == '/auth/github':
            self.handle_github_auth()
        elif parsed_url.path == '/auth/callback':
            self.handle_github_callback(query_params)
        elif parsed_url.path == '/api/repositories':
            self.handle_repositories()
        elif parsed_url.path == '/api/generate':
            self.handle_generate(query_params)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def handle_github_auth(self):
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
            self.send_json_response({'error': 'GitHub OAuth not configured.'}, 500)
            return
            
        github_auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={GITHUB_REDIRECT_URI}&scope=repo"
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
            self.send_header('Location', '/?session=success')
            
            cookie_value = f'github_user={session_data}; Path=/; Max-Age=86400; SameSite=Lax'
            self.send_header('Set-Cookie', cookie_value)
            
            self.end_headers()
            
        except Exception as e:
            self.send_response(302)
            self.send_header('Location', f'/?error=auth_failed')
            self.end_headers()

    def handle_repositories(self):
        user_data = self.get_user_from_cookie()
        
        if not user_data:
            self.send_json_response({'error': 'Authentication required.'}, 401)
            return
        
        if 'access_token' not in user_data:
            self.send_json_response({'error': 'Invalid authentication.'}, 401)
            return
        
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
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as py_file:
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
                                if summary["functions"] or summary['classes']:
                                    context["python_code_summary"][f] = summary
                        except Exception:
                            pass
                    
                    elif f in ['requirements.txt', 'package.json', 'pyproject.toml', 'pom.xml']:
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as file_content:
                                context["dependencies"] = file_content.read()
                        except Exception:
                            pass
            
            context["file_structure"] = "\n".join(file_structure_list)
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
                demo_section = "\n\n## 📸 Demo & Screenshots\n\n"
                
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

            prompt = f"""
            You are a Principal Solutions Architect and technical copywriter. Create a comprehensive, professional README.md file.

            **Source Analysis:**
            1. **Project File Structure:**
            ```
            {analysis_context['file_structure']}
            ```
            2. **Dependencies:**
            ```
            {analysis_context['dependencies']}
            ```
            3. **Python Code Summary:**
            ```
            {python_summary_str if python_summary_str else "No Python files analyzed."}
            ```

            **README Structure:**
            {title_instruction}

            2. **Badges:** Create centered static placeholder badges with HTML comment for replacement.
            3. **Table of Contents:** Clickable navigation.
            4. **⭐ Overview:** Hook, problem, solution, architecture.
            5. **✨ Key Features:** Detailed bulleted list (4-5 features).
            6. **🛠️ Tech Stack:** Markdown table with Technology, Purpose, Why columns.
            {demo_section}
            7. **🚀 Getting Started:** Prerequisites and installation steps.
            8. **🔧 Usage:** Clear run instructions with examples.
            9. **🤝 Contributing:** Welcoming contribution guidelines.
            10. **📝 License:** License information.

            Output ONLY the raw Markdown content. Be professional, engaging, and use rich formatting.
            """

            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            
            if not response.parts:
                return None, "Content generation failed due to safety filters"
            
            return response.text, None
            
        except Exception as e:
            return None, str(e)
