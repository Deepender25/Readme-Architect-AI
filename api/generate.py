from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
import os
import tempfile
import shutil
import requests
import zipfile
import ast
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
        # Get origin from request headers for CORS with credentials
        origin = self.headers.get('Origin', '*')
        if origin != '*':
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Access-Control-Allow-Credentials', 'true')
        else:
            self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
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
        
        # Get user authentication for private repository access
        user_data = None
        access_token = None
        try:
            cookie_header = self.headers.get('Cookie', '')
            print(f"🍪 Cookie header received: {cookie_header[:100] if cookie_header else 'None'}...")
            
            if 'auth_token=' in cookie_header:
                for cookie in cookie_header.split(';'):
                    if cookie.strip().startswith('auth_token='):
                        # Extract JWT token and decode it to get GitHub access token
                        jwt_token = cookie.split('=')[1].strip()
                        print(f"🔑 JWT token extracted: {jwt_token[:50]}...")
                        user_data, access_token = self.decode_jwt_auth(jwt_token)
                        if user_data:
                            print(f"🔐 Authenticated user: {user_data.get('username', 'unknown')}")
                            print(f"🔑 Access token available: {'Yes' if access_token else 'No'}")
                        else:
                            print(f"❌ JWT decoding failed")
                        break
            else:
                print(f"❌ No auth_token found in cookies")
        except Exception as e:
            print(f"⚠️ Could not extract user authentication: {e}")
            import traceback
            traceback.print_exc()
        
        repo_path = None
        try:
            # Download repository
            repo_path, error = self.download_repo(repo_url, access_token, user_data)
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
            
            print(f"✅ README generated successfully ({len(readme_content)} chars)")
            
            # Save to history if user is authenticated
            try:
                # Use the user_data we already extracted from JWT
                
                if user_data and readme_content:
                    from .database import save_readme_history
                    try:
                        # Extract repository name from normalized URL
                        normalized_url = self.normalize_github_url(repo_url)
                        repo_name = normalized_url.split('/')[-2:] if '/' in normalized_url else [normalized_url]
                        repo_name = '/'.join(repo_name)
                        
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
            
            # Simplified error handling for Vercel
            print(f"⚠️ API Error: {str(e)}")
            
            self.send_json_response({"error": str(e)}, 500)
        
        finally:
            # Always clean up temporary files
            if repo_path and os.path.exists(repo_path):
                try:
                    temp_root = os.path.dirname(repo_path)
                    if temp_root.startswith(('/tmp', tempfile.gettempdir())):
                        print(f"🧹 Cleaning up temporary directory: {temp_root}")
                        shutil.rmtree(temp_root, ignore_errors=True)
                except Exception as cleanup_error:
                    print(f"⚠️ Cleanup warning: {cleanup_error}")

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        # Get origin from request headers for CORS with credentials
        origin = self.headers.get('Origin', '*')
        if origin != '*':
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Access-Control-Allow-Credentials', 'true')
        else:
            self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def decode_jwt_auth(self, jwt_token: str):
        """Decode JWT token to extract user data and GitHub access token"""
        try:
            import jwt
            import os
            
            # Use the same secret as the auth system
            jwt_secret = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
            
            # Decode the JWT token
            payload = jwt.decode(jwt_token, jwt_secret, algorithms=['HS256'])
            
            user_data = {
                'id': payload.get('sub'),
                'github_id': payload.get('github_id'),
                'username': payload.get('username'),
                'name': payload.get('name'),
                'email': payload.get('email'),
                'avatar_url': payload.get('avatar_url'),
                'html_url': payload.get('html_url')
            }
            
            access_token = payload.get('github_access_token')
            
            return user_data, access_token
            
        except Exception as e:
            print(f"⚠️ JWT decode error: {e}")
            return None, None

    def check_repository_access(self, repo_url: str, access_token: str, user_data: dict):
        """Check if user has access to the repository"""
        try:
            # Extract owner and repo name from URL
            normalized_url = self.normalize_github_url(repo_url)
            if "github.com" not in normalized_url:
                return False, "Invalid GitHub URL"
            
            # Parse owner/repo from URL
            parts = normalized_url.replace("https://github.com/", "").split("/")
            if len(parts) < 2:
                return False, "Invalid repository URL format"
            
            owner = parts[0]
            repo = parts[1]
            
            # Check repository info using GitHub API
            api_url = f"https://api.github.com/repos/{owner}/{repo}"
            headers = {'Authorization': f'token {access_token}'}
            
            response = requests.get(api_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                repo_data = response.json()
                
                # If repository is public, allow access
                if not repo_data.get('private', False):
                    return True, None
                
                # If repository is private, check ownership/access
                if repo_data.get('private', False):
                    # Check if user is the owner
                    repo_owner = repo_data.get('owner', {}).get('login', '')
                    user_login = user_data.get('username', '')
                    
                    if repo_owner.lower() == user_login.lower():
                        return True, None
                    
                    # Check if user has access (collaborator, organization member, etc.)
                    # The fact that we got a 200 response with private=true means user has access
                    return True, None
                
                return True, None
                
            elif response.status_code == 404:
                return False, "Repository not found or you don't have access to this private repository"
            elif response.status_code == 401:
                return False, "Authentication failed. Please log in again to access private repositories"
            else:
                return False, f"Failed to verify repository access: {response.status_code}"
                
        except Exception as e:
            print(f"⚠️ Repository access check error: {e}")
            return False, "Failed to verify repository access"

    def normalize_github_url(self, repo_url: str) -> str:
        """Normalize GitHub URL by removing .git suffix and trailing slashes"""
        normalized_url = repo_url.strip()
        if normalized_url.endswith('/'):
            normalized_url = normalized_url[:-1]
        if normalized_url.endswith('.git'):
            normalized_url = normalized_url[:-4]
        return normalized_url

    def download_repo(self, repo_url: str, access_token: str = None, user_data: dict = None):
        temp_dir = None
        try:
            # First normalize the URL
            normalized_url = self.normalize_github_url(repo_url)
            
            if "github.com" in normalized_url:
                api_url = normalized_url.replace("github.com", "api.github.com/repos")
                zip_url = api_url + "/zipball"
            else:
                return None, "Invalid GitHub URL"
            
            # Check repository access if user is authenticated
            if access_token and user_data:
                has_access, access_error = self.check_repository_access(repo_url, access_token, user_data)
                if not has_access:
                    return None, access_error
            
            # Prepare headers with authentication if token is provided
            headers = {}
            if access_token:
                headers['Authorization'] = f'token {access_token}'
                print(f"🔐 Using authenticated access for repository download")
            else:
                print(f"🌐 Using public access for repository download")
            
            print(f"📥 Downloading repository: {repo_url}")
            response = requests.get(zip_url, headers=headers, timeout=30, stream=True)
            if response.status_code == 404:
                if access_token:
                    return None, "Repository not found or you don't have access to this private repository"
                else:
                    return None, "Repository not found. If this is a private repository, please log in and try again"
            elif response.status_code == 401:
                return None, "Authentication failed. Please log in again to access private repositories"
            elif response.status_code == 403:
                return None, "This is a private repository and you don't have access to it"
            elif response.status_code != 200:
                return None, f"Failed to download repository: {response.status_code}"
            
            # Simplified download for Vercel environment
            temp_dir = tempfile.mkdtemp(prefix='readme_gen_')
            zip_path = os.path.join(temp_dir, "repo.zip")
            
            # Simple download without streaming (works better on Vercel)
            with open(zip_path, 'wb') as f:
                f.write(response.content)
            
            total_size = len(response.content)
            print(f"📦 Downloaded {total_size} bytes, extracting...")
            
            extract_dir = os.path.join(temp_dir, "extracted")
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Simple extraction for Vercel environment
                zip_ref.extractall(extract_dir)
            
            # Delete zip file immediately to save space
            try:
                os.remove(zip_path)
            except:
                pass
            
            extracted_items = os.listdir(extract_dir)
            if extracted_items:
                repo_dir = os.path.join(extract_dir, extracted_items[0])
                print(f"✅ Repository extracted to: {repo_dir}")
                return repo_dir, None
            
            return None, "Failed to extract repository"
            
        except Exception as e:
            error_msg = str(e)
            if "No space left on device" in error_msg:
                error_msg = "Server storage is full. Please try again later."
            elif "too large" in error_msg:
                error_msg = "Repository is too large to process. Please try with a smaller repository."
            
            # Clean up on error
            if temp_dir and os.path.exists(temp_dir):
                try:
                    shutil.rmtree(temp_dir, ignore_errors=True)
                except:
                    pass
            
            return None, error_msg

    def analyze_codebase(self, repo_path: str):
        try:
            print("🔍 Starting enhanced deep code analysis...")
            
            # Import the enhanced analyzer
            from .deep_analyzer import enhance_analysis_context
            
            # Get enhanced analysis
            enhanced_context = enhance_analysis_context(repo_path)
            
            # Create traditional file structure for compatibility
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
            
            # Add enhanced analysis to context
            context["enhanced_analysis"] = enhanced_context
            
            print("✅ Enhanced deep code analysis completed")
            return context, None
        except Exception as e:
            print(f"❌ Analysis error: {str(e)}")
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
                print(f"❌ Gemini AI error: {str(e)}")
                
                # Simplified error logging for Vercel
                print(f"⚠️ AI Generation Error: {str(e)}")
                    
                # Return user-friendly error message instead of fallback template
                return None, "AI generation service is currently unavailable. Our team has been notified and is working to resolve this issue. Please try again in a few minutes."
                
        except Exception as e:
            return None, str(e)