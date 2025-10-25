from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import os
import tempfile
import shutil
import requests
import zipfile
import ast
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
            self.handle_stream()
        except Exception as e:
            print(f"ERROR in do_GET: {str(e)}")
            self.send_error_event(f"Server error: {str(e)}")

    def do_POST(self):
        try:
            self.handle_stream()
        except Exception as e:
            print(f"ERROR in do_POST: {str(e)}")
            self.send_error_event(f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def handle_stream(self):
        # Parse query parameters
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        print(f"📡 Stream request: {self.path}")
        
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
            self.send_error_event("Repository URL is required")
            return
            
        if not ("github.com" in repo_url):
            self.send_error_event("Only GitHub repositories are supported")
            return
        
        # Setup Server-Sent Events
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Connection', 'keep-alive')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        # Get user authentication for private repository access
        user_data = None
        access_token = None
        try:
            cookie_header = self.headers.get('Cookie', '')
            if 'github_user=' in cookie_header:
                for cookie in cookie_header.split(';'):
                    if cookie.strip().startswith('github_user='):
                        import base64
                        import json
                        cookie_value = cookie.split('=')[1].strip()
                        user_data = json.loads(base64.b64decode(cookie_value).decode())
                        access_token = user_data.get('access_token')
                        break
        except Exception as e:
            print(f"⚠️ Could not extract user authentication: {e}")
        
        repo_path = None
        try:
            # Step 1: Cloning
            self.send_status_event("Cloning repository...")
            time.sleep(0.5)  # Small delay for better UX
            repo_path, error = self.download_repo(repo_url, access_token)
            if error:
                self.send_error_event(error)
                return
            
            # Step 2: Analyzing
            self.send_status_event("Analyzing codebase...")
            time.sleep(0.5)
            analysis, error = self.analyze_codebase(repo_path)
            if error:
                self.send_error_event(error)
                return
            
            # Step 3: Building prompt
            self.send_status_event("Building prompt for AI...")
            time.sleep(0.5)
            
            # Step 4: Generating
            self.send_status_event("Generating README with Gemini...")
            time.sleep(0.5)
            readme_content, error = self.generate_readme_with_gemini(
                analysis, project_name, include_demo, num_screenshots, num_videos
            )
            if error:
                self.send_error_event(error)
                return
            
            # Step 5: Save to history and send success
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
                            print("✅ History saved successfully in stream.py")
                        else:
                            print("❌ History save failed in stream.py")
                            
                    except Exception as e:
                        print(f"⚠️ Failed to save history in stream.py: {e}")
                else:
                    print("⚠️ No user authentication or content - history not saved in stream.py")
                        
            except Exception as e:
                print(f"⚠️ Error checking user authentication in stream.py: {e}")
            
            self.send_success_event(readme_content)
            
        except Exception as e:
            print(f"❌ Stream error: {str(e)}")
            self.send_error_event(str(e))
        finally:
            # Clean up temporary files
            if repo_path and os.path.exists(repo_path):
                try:
                    shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
                except:
                    pass

    def send_status_event(self, status):
        """Send a status update event"""
        data = json.dumps({"status": status})
        self.wfile.write(f"data: {data}\n\n".encode())
        self.wfile.flush()

    def send_success_event(self, readme_content):
        """Send the final success event with README content"""
        data = json.dumps({"readme": readme_content})
        self.wfile.write(f"data: {data}\n\n".encode())
        self.wfile.flush()

    def send_error_event(self, error_message):
        """Send an error event"""
        data = json.dumps({"error": error_message})
        self.wfile.write(f"data: {data}\n\n".encode())
        self.wfile.flush()

    def download_repo(self, repo_url: str, access_token: str = None):
        try:
            if "github.com" in repo_url:
                repo_url = repo_url.replace("github.com", "api.github.com/repos")
                if repo_url.endswith("/"):
                    repo_url = repo_url[:-1]
                zip_url = repo_url + "/zipball"
            else:
                return None, "Invalid GitHub URL"
            
            # Prepare headers with authentication if token is provided
            headers = {}
            if access_token:
                headers['Authorization'] = f'token {access_token}'
                print(f"🔐 Using authenticated access for repository download")
            else:
                print(f"🌐 Using public access for repository download")
            
            response = requests.get(zip_url, headers=headers, timeout=30)
            if response.status_code == 404:
                if access_token:
                    return None, "Repository not found or you don't have access to this private repository"
                else:
                    return None, "Repository not found. If this is a private repository, please make sure you're logged in"
            elif response.status_code == 401:
                return None, "Authentication failed. Please log in again to access private repositories"
            elif response.status_code != 200:
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
            # Import and use the unified prompt system
            from .ai_prompts import get_readme_generation_prompt
            
            prompt = get_readme_generation_prompt(
                analysis_context=analysis_context,
                project_name=project_name,
                include_demo=include_demo,
                num_screenshots=num_screenshots,
                num_videos=num_videos
            )
            
            try:
                # Use gemini-flash-latest for best performance and reliability
                print("🤖 Initializing Gemini Flash Latest model...")
                model = genai.GenerativeModel('gemini-flash-latest')
                
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