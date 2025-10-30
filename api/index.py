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
GITHUB_REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "https://readmearchitect.vercel.app/api/auth/callback")

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
            '/api/history',
            '/api/history/', # for individual history items
            '/api/sessions' # for session management
        ]

        # Centralized authentication check (exclude /api/generate and /api/stream)
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
        elif parsed_url.path == '/api/stream':
            self.handle_stream(query_params)
        elif parsed_url.path == '/api/history':
            self.handle_history()
        elif parsed_url.path.startswith('/api/history/'):
            history_id = parsed_url.path.split('/')[-1]
            self.handle_history_item(history_id)
        elif parsed_url.path == '/api/sessions':
            self.handle_sessions()
        elif parsed_url.path.startswith('/api/sessions/'):
            session_action = parsed_url.path.split('/')[-1]
            self.handle_session_action(session_action)
        elif parsed_url.path == '/api/python/contact':
            self.handle_contact()
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def handle_github_auth(self):
        if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
            self.send_json_response({'error': 'GitHub OAuth not configured.'}, 500)
            return
        
        print(f"DEBUG: GitHub auth called")
        print(f"DEBUG: Raw path: {self.path}")
        
        # Parse query parameters to check for account switching
        from urllib.parse import urlparse, parse_qs
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        force_account_selection = query_params.get('force_account_selection', [False])[0]
        return_to = query_params.get('returnTo', [''])[0]
        
        print(f"DEBUG: Force account selection: {force_account_selection}")
        print(f"DEBUG: Return to: {return_to}")
        
        # Use the exact redirect URI from environment
        redirect_uri = GITHUB_REDIRECT_URI
        print(f"DEBUG: Using redirect_uri: {redirect_uri}")
        
        # Build state parameter with return URL
        import time
        if force_account_selection == 'true':
            # Use unique state for account switching to force fresh auth flow
            state = f'oauth_switch_{int(time.time())}'
            if return_to:
                state = f'{state}|returnTo={return_to}'
            print(f"DEBUG: Account switching - using unique state: {state}")
        else:
            state = 'oauth_login'
            if return_to:
                state = f'{state}|returnTo={return_to}'
            print(f"DEBUG: Regular login - using state: {state}")
        
        # Build GitHub OAuth URL
        github_params = {
            'client_id': GITHUB_CLIENT_ID,
            'redirect_uri': redirect_uri,
            'scope': 'repo',
            'state': state
        }
        
        # For account switching, force fresh authentication
        if force_account_selection == 'true':
            print("DEBUG: Adding parameters to force account switching")
            # Use prompt=select_account to force account selection
            github_params['prompt'] = 'select_account'
            # Allow signup to ensure all options are available
            github_params['allow_signup'] = 'true'
            # Add timestamp to make URL unique and bypass cache
            github_params['_t'] = str(int(time.time()))
        
        github_auth_url = f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(github_params)}"
        print(f"DEBUG: Redirecting to: {github_auth_url}")
        
        self.send_response(302)
        self.send_header('Location', github_auth_url)
        self.end_headers()

    def handle_github_callback(self, query_params):
        code_list = query_params.get('code', [None])
        code = code_list[0] if code_list else None
        
        print(f"DEBUG: Callback received - code exists: {code is not None}")
        
        if not code:
            print("DEBUG: No code received, redirecting to login with error")
            self.send_response(302)
            self.send_header('Location', '/login?error=no_code')
            self.end_headers()
            return
        
        try:
            print("DEBUG: Exchanging code for token...")
            token_response = requests.post('https://github.com/login/oauth/access_token', {
                'client_id': GITHUB_CLIENT_ID,
                'client_secret': GITHUB_CLIENT_SECRET,
                'code': code
            }, headers={'Accept': 'application/json'})
            
            token_data = token_response.json()
            access_token = token_data.get('access_token')
            
            print(f"DEBUG: Token exchange result: {token_data}")
            
            if not access_token:
                print("DEBUG: No access token received")
                self.send_response(302)
                self.send_header('Location', '/login?error=token_failed')
                self.end_headers()
                return
            
            print("DEBUG: Getting user data from GitHub...")
            user_response = requests.get('https://api.github.com/user', 
                headers={'Authorization': f'token {access_token}'})
            
            if user_response.status_code != 200:
                print(f"DEBUG: Failed to get user data: {user_response.status_code}")
                self.send_response(302)
                self.send_header('Location', '/login?error=user_failed')
                self.end_headers()
                return
            
            user_data = user_response.json()
            print(f"DEBUG: Successfully got user data for: {user_data.get('login', 'unknown')}")
            
            # Get user email if available
            try:
                email_response = requests.get('https://api.github.com/user/emails', 
                    headers={'Authorization': f'token {access_token}'})
                
                email = None
                if email_response.status_code == 200:
                    emails = email_response.json()
                    primary_email = next((e for e in emails if e.get('primary')), None)
                    if primary_email:
                        email = primary_email.get('email')
            except:
                email = None
            
            # Create user session data
            user_session_data = {
                'github_id': user_data['id'],
                'username': user_data['login'],
                'name': user_data.get('name', user_data['login']),
                'avatar_url': user_data['avatar_url'],
                'html_url': user_data['html_url'],
                'email': email
            }
            
            # Create secure session using session manager
            from .session_manager import create_user_session
            
            # Get client IP (best effort)
            client_ip = self.headers.get('X-Forwarded-For', self.headers.get('X-Real-IP', self.client_address[0]))
            
            # Create session
            session_token, success = create_user_session(
                user_id=str(user_data['id']),
                username=user_data['login'],
                user_data=user_session_data,
                access_token=access_token,
                request_headers=dict(self.headers),
                ip_address=client_ip
            )
            
            if not success or not session_token:
                print("DEBUG: Failed to create session")
                self.send_response(302)
                self.send_header('Location', '/login?error=session_failed')
                self.end_headers()
                return
            
            print(f"DEBUG: Created session for user: {user_data['login']}")
            
            # Parse state parameter to get return URL
            state_list = query_params.get('state', [None])
            state = state_list[0] if state_list else None
            return_to_url = '/'
            
            if state and '|returnTo=' in state:
                try:
                    return_to_url = state.split('|returnTo=')[1]
                    print(f"DEBUG: Extracted return URL from state: {return_to_url}")
                except:
                    return_to_url = '/'
            
            # Encode user data for frontend
            import urllib.parse
            import json
            
            # Prepare user data for frontend
            frontend_user_data = {
                'github_id': str(user_data['id']),
                'username': user_data['login'],
                'name': user_data.get('name', user_data['login']),
                'avatar_url': user_data['avatar_url'],
                'html_url': user_data['html_url'],
                'email': email,
                'access_token': access_token
            }
            
            # Encode user data as URL parameter
            encoded_user_data = urllib.parse.quote(json.dumps(frontend_user_data))
            
            # Redirect to intended page or home with user data
            redirect_url = f'{return_to_url}?auth_success={encoded_user_data}'
            
            print(f"DEBUG: Redirecting to: {redirect_url}")
            
            self.send_response(302)
            self.send_header('Location', redirect_url)
            
            # Set secure session cookie
            host = self.headers.get('Host', '')
            is_production = 'localhost' not in host
            
            # Set session token cookie
            if is_production:
                session_cookie = f'session_token={session_token}; Path=/; Max-Age=2592000; SameSite=Lax; Secure; HttpOnly'
            else:
                session_cookie = f'session_token={session_token}; Path=/; Max-Age=2592000; SameSite=Lax; HttpOnly'
            
            # Set user ID cookie for session validation
            if is_production:
                user_id_cookie = f'user_id={user_data["id"]}; Path=/; Max-Age=2592000; SameSite=Lax; Secure'
            else:
                user_id_cookie = f'user_id={user_data["id"]}; Path=/; Max-Age=2592000; SameSite=Lax'
            
            print(f"DEBUG: Setting session cookie for {user_data['login']}")
            self.send_header('Set-Cookie', session_cookie)
            self.send_header('Set-Cookie', user_id_cookie)
            
            self.end_headers()
            
        except Exception as e:
            print(f"DEBUG: Exception in callback: {str(e)}")
            import traceback
            traceback.print_exc()
            self.send_response(302)
            self.send_header('Location', '/login?error=auth_failed')
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
        try:
            num_screenshots = int(query_params.get('num_screenshots', ['0'])[0])
            num_videos = int(query_params.get('num_videos', ['0'])[0])
        except ValueError:
            num_screenshots = 0
            num_videos = 0
        
        if not repo_url:
            self.send_json_response({"error": "Repository URL is required"}, 400)
            return
        
        # Get user authentication for private repository access
        user_data = self.get_user_from_cookie()
        access_token = user_data.get('access_token') if user_data else None
        
        try:
            repo_path, error = self.download_repo(repo_url, access_token)
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
            # Send error notification for general API errors
            try:
                from .error_notifier import notify_api_error
                user_data = self.get_user_from_cookie()
                user_info = {'type': 'Anonymous user'}
                if user_data:
                    user_info = {
                        'username': user_data.get('username', 'Unknown'),
                        'github_id': user_data.get('github_id', 'Unknown')
                    }
                
                notify_api_error(
                    endpoint='/api/generate',
                    error_message=str(e),
                    request_data={
                        'repo_url': repo_url,
                        'project_name': project_name
                    },
                    user_info=user_info
                )
            except Exception as notify_error:
                print(f"⚠️ Failed to send API error notification: {notify_error}")
            
            self.send_json_response({"error": str(e)}, 500)

    def handle_stream(self, query_params):
        """Handle streaming README generation with real-time updates"""
        repo_url = query_params.get('repo_url', [''])[0]
        project_name = query_params.get('project_name', [''])[0]
        include_demo = query_params.get('include_demo', ['false'])[0].lower() == 'true'
        try:
            num_screenshots = int(query_params.get('num_screenshots', ['0'])[0])
            num_videos = int(query_params.get('num_videos', ['0'])[0])
        except ValueError:
            num_screenshots = 0
            num_videos = 0
        
        if not repo_url:
            self.send_json_response({"error": "Repository URL is required"}, 400)
            return
        
        # Set up Server-Sent Events headers
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Connection', 'keep-alive')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        def send_stream_event(data):
            try:
                event_data = json.dumps(data)
                self.wfile.write(f"data: {event_data}\n\n".encode('utf-8'))
                self.wfile.flush()
            except Exception as e:
                print(f"Error sending stream event: {e}")
        
        try:
            # Send initial status
            send_stream_event({"status": "🔄 Connecting to repository..."})
            
            # Get user authentication for private repository access
            user_data = self.get_user_from_cookie()
            access_token = user_data.get('access_token') if user_data else None
            
            # Download repository
            send_stream_event({"status": "📥 Downloading repository files..."})
            repo_path, error = self.download_repo(repo_url, access_token)
            if error:
                send_stream_event({"error": error})
                return
            
            # Analyze codebase
            send_stream_event({"status": "🔍 Analyzing codebase structure..."})
            analysis, error = self.analyze_codebase(repo_path)
            if error:
                send_stream_event({"error": error})
                return
            
            # Generate README
            send_stream_event({"status": "🤖 Generating professional documentation..."})
            readme_content, error = self.generate_readme_with_gemini(
                analysis, project_name, include_demo, num_screenshots, num_videos
            )
            if error:
                # Log error and send notification for streaming failures
                try:
                    from .error_notifier import notify_ai_failure
                    user_data = self.get_user_from_cookie()
                    user_info = {'type': 'Anonymous user'}
                    if user_data:
                        user_info = {
                            'username': user_data.get('username', 'Unknown'),
                            'github_id': user_data.get('github_id', 'Unknown')
                        }
                    
                    notify_ai_failure(
                        repo_url=repo_url,
                        project_name=project_name,
                        error_message=error,
                        user_info=user_info
                    )
                except Exception as notify_error:
                    print(f"⚠️ Failed to send error notification in stream: {notify_error}")
                
                send_stream_event({"error": error})
                return
            
            # Clean up temporary files
            if repo_path and os.path.exists(repo_path):
                shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
            
            # Save to history if user is authenticated
            user_data = self.get_user_from_cookie()
            if user_data and readme_content:
                try:
                    from .database import save_readme_history
                    repo_name = repo_url.split('/')[-2:] if '/' in repo_url else [repo_url]
                    repo_name = '/'.join(repo_name).replace('.git', '')
                    
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
                        print("✅ History saved successfully in streaming")
                except Exception as e:
                    print(f"⚠️ Failed to save history in streaming: {e}")
            
            # Send final result
            send_stream_event({"readme": readme_content})
            
        except Exception as e:
            # Send error notification for stream errors
            try:
                from .error_notifier import notify_api_error
                user_data = self.get_user_from_cookie()
                user_info = {'type': 'Anonymous user'}
                if user_data:
                    user_info = {
                        'username': user_data.get('username', 'Unknown'),
                        'github_id': user_data.get('github_id', 'Unknown')
                    }
                
                notify_api_error(
                    endpoint='/api/stream',
                    error_message=str(e),
                    request_data={
                        'repo_url': repo_url,
                        'project_name': project_name
                    },
                    user_info=user_info
                )
            except Exception as notify_error:
                print(f"⚠️ Failed to send stream error notification: {notify_error}")
            
            send_stream_event({"error": str(e)})

    def get_user_from_cookie(self):
        """Get user data from session cookie"""
        cookie_header = self.headers.get('Cookie', '')
        
        session_token = None
        user_id = None
        
        # Parse cookies to get session_token and user_id
        for cookie in cookie_header.split(';'):
            cookie = cookie.strip()
            if cookie.startswith('session_token='):
                session_token = cookie.split('=', 1)[1].strip()
            elif cookie.startswith('user_id='):
                user_id = cookie.split('=', 1)[1].strip()
        
        if not session_token or not user_id:
            # Fall back to old cookie system for backward compatibility
            if 'github_user=' in cookie_header:
                for cookie in cookie_header.split(';'):
                    if cookie.strip().startswith('github_user='):
                        try:
                            cookie_value = cookie.split('=')[1].strip()
                            user_data = json.loads(base64.b64decode(cookie_value).decode())
                            print("⚠️ Using legacy cookie authentication - consider upgrading")
                            return user_data
                        except Exception as e:
                            return None
            return None
        
        # Validate session using session manager
        try:
            from .session_manager import get_user_session_by_user_id
            
            session_data = get_user_session_by_user_id(user_id, session_token)
            
            if session_data:
                # Return the user data with access_token for API calls
                user_data = session_data['user_data'].copy()
                user_data['access_token'] = session_data['access_token']
                return user_data
            else:
                print(f"❌ Invalid session for user {user_id}")
                return None
                
        except Exception as e:
            print(f"❌ Error validating session: {e}")
            return None

    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

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
            return None, "Google AI not available."
        
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
            
            # Import error notifier and send notification
            try:
                from .error_notifier import notify_ai_failure
                
                # Get user info if available from cookie
                user_info = None
                try:
                    user_data = self.get_user_from_cookie()
                    if user_data:
                        user_info = {
                            'username': user_data.get('username', 'Unknown'),
                            'github_id': user_data.get('github_id', 'Unknown')
                        }
                    else:
                        user_info = {'type': 'Anonymous user'}
                except Exception:
                    user_info = {'type': 'Anonymous user'}
                
                # Send error notification
                notify_ai_failure(
                    repo_url='Not available in index.py context',
                    project_name=project_name,
                    error_message=str(e),
                    user_info=user_info
                )
            except Exception as notify_error:
                print(f"⚠️ Failed to send error notification: {notify_error}")
            
            # Return user-friendly error message instead of fallback template
            return None, "AI generation service is currently unavailable. Our team has been notified and is working to resolve this issue. Please try again in a few minutes."

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
    
    def handle_sessions(self):
        """Handle session management requests"""
        user_data = self.get_user_from_cookie()  # user_data is guaranteed to be valid here
        
        if self.command == 'GET':
            # Get all user sessions
            from .session_manager import get_all_user_sessions
            try:
                user_id = str(user_data.get('github_id', ''))
                sessions = get_all_user_sessions(user_id)
                
                self.send_json_response({'sessions': sessions})
            except Exception as e:
                print(f"❌ Error retrieving sessions: {str(e)}")
                self.send_json_response({'error': f'Failed to retrieve sessions: {str(e)}'}, 500)
        
        elif self.command == 'DELETE':
            # Revoke all sessions except current one
            from .session_manager import revoke_all_user_sessions, hash_session_token
            try:
                user_id = str(user_data.get('github_id', ''))
                
                # Get current session token to exclude it
                cookie_header = self.headers.get('Cookie', '')
                current_session_token = None
                
                for cookie in cookie_header.split(';'):
                    cookie = cookie.strip()
                    if cookie.startswith('session_token='):
                        current_session_token = cookie.split('=', 1)[1].strip()
                        break
                
                current_session_hash = hash_session_token(current_session_token) if current_session_token else None
                
                success = revoke_all_user_sessions(user_id, except_session=current_session_hash)
                
                if success:
                    self.send_json_response({'message': 'All other sessions revoked successfully'})
                else:
                    self.send_json_response({'error': 'Failed to revoke sessions'}, 400)
                    
            except Exception as e:
                print(f"❌ Error revoking sessions: {str(e)}")
                self.send_json_response({'error': f'Failed to revoke sessions: {str(e)}'}, 500)
        
        else:
            self.send_json_response({'error': 'Method not allowed'}, 405)
    
    def handle_session_action(self, action):
        """Handle individual session actions"""
        user_data = self.get_user_from_cookie()  # user_data is guaranteed to be valid here
        
        if action == 'revoke' and self.command == 'POST':
            # Revoke a specific session
            from .session_manager import revoke_session
            try:
                # Get request body
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    session_id = data.get('session_id', '')
                else:
                    self.send_json_response({'error': 'Missing session_id'}, 400)
                    return
                
                user_id = str(user_data.get('github_id', ''))
                
                success = revoke_session(user_id, session_id)
                
                if success:
                    self.send_json_response({'message': 'Session revoked successfully'})
                else:
                    self.send_json_response({'error': 'Failed to revoke session'}, 400)
                    
            except Exception as e:
                print(f"❌ Error revoking session: {str(e)}")
                self.send_json_response({'error': f'Failed to revoke session: {str(e)}'}, 500)
        
        elif action == 'cleanup' and self.command == 'POST':
            # Cleanup expired sessions
            from .session_manager import cleanup_expired_sessions
            try:
                user_id = str(user_data.get('github_id', ''))
                
                success = cleanup_expired_sessions(user_id)
                
                if success:
                    self.send_json_response({'message': 'Expired sessions cleaned up'})
                else:
                    self.send_json_response({'error': 'Failed to cleanup sessions'}, 400)
                    
            except Exception as e:
                print(f"❌ Error cleaning up sessions: {str(e)}")
                self.send_json_response({'error': f'Failed to cleanup sessions: {str(e)}'}, 500)
        
        else:
            self.send_json_response({'error': 'Invalid action or method'}, 405)

    def handle_contact(self):
        """Handle contact form submissions"""
        if self.command != 'POST':
            self.send_json_response({'error': 'Method not allowed'}, 405)
            return
            
        try:
            # Get request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            subject = data.get('subject', '').strip()
            message = data.get('message', '').strip()
            
            # Validation
            if not all([name, email, subject, message]):
                self.send_json_response({'error': 'All fields are required'}, 400)
                return
                
            # Email validation
            import re
            email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_pattern, email):
                self.send_json_response({'error': 'Invalid email address'}, 400)
                return
            
            # Check environment variables
            email_user = os.getenv('EMAIL_USER')
            email_pass = os.getenv('EMAIL_PASS')
            
            if not email_user or not email_pass:
                print('❌ Missing email configuration')
                self.send_json_response({'error': 'Email service not configured'}, 500)
                return
            
            print(f'📧 Processing contact form: {name} <{email}> - {subject}')
            
            # Send email using Python
            success = self.send_contact_email(name, email, subject, message, email_user, email_pass)
            
            if success:
                print('✅ Contact email sent successfully')
                self.send_json_response({
                    'message': 'Email sent successfully!',
                    'success': True
                })
            else:
                print('❌ Failed to send contact email')
                self.send_json_response({'error': 'Failed to send email'}, 500)
                
        except Exception as e:
            print(f'❌ Contact form error: {str(e)}')
            self.send_json_response({'error': 'Internal server error'}, 500)
    
    def send_contact_email(self, name, email, subject, message, email_user, email_pass):
        """Send contact form email using Python smtplib"""
        try:
            import smtplib
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            from datetime import datetime
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = f'"ReadmeArchitect Contact Form" <{email_user}>'
            msg['To'] = email_user
            msg['Reply-To'] = email
            msg['Subject'] = f'🚀 ReadmeArchitect Contact: {subject} - from {name}'
            
            # Create HTML content
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Contact Form Submission - ReadmeArchitect</title>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }}
                    .header {{ background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }}
                    .content {{ background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
                    .field {{ margin-bottom: 15px; }}
                    .field-label {{ font-weight: bold; color: #10b981; display: block; margin-bottom: 5px; }}
                    .field-value {{ background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #10b981; }}
                    .message-content {{ background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981; white-space: pre-wrap; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🚀 ReadmeArchitect - New Contact Form Submission</h1>
                        <p>Someone reached out through your website!</p>
                    </div>
                    
                    <div style="background: #e1f5fe; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                        <strong>Received:</strong> {datetime.now().strftime('%A, %B %d, %Y at %I:%M %p')}
                    </div>

                    <div class="content">
                        <div class="field">
                            <span class="field-label">👤 Name:</span>
                            <div class="field-value">{name}</div>
                        </div>
                        <div class="field">
                            <span class="field-label">📧 Email:</span>
                            <div class="field-value"><a href="mailto:{email}">{email}</a></div>
                        </div>
                        <div class="field">
                            <span class="field-label">📋 Subject:</span>
                            <div class="field-value">{subject}</div>
                        </div>
                        <div class="field">
                            <span class="field-label">💬 Message:</span>
                            <div class="message-content">{message}</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
                        <p>This email was sent from your ReadmeArchitect contact form.</p>
                        <p>🌟 ReadmeArchitect - Making documentation beautiful!</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Create text content
            text_content = f"""
New Contact Form Submission - ReadmeArchitect

Received: {datetime.now().strftime('%A, %B %d, %Y at %I:%M %p')}

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This email was sent from your ReadmeArchitect contact form.
Reply directly to respond to {name}.
            """
            
            # Attach parts
            msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            print('🔧 Connecting to Gmail SMTP...')
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(email_user, email_pass)
            
            print('📧 Sending notification email...')
            server.send_message(msg)
            
            # Send confirmation email to user
            confirm_msg = MIMEMultipart('alternative')
            confirm_msg['From'] = f'"Deepender from ReadmeArchitect" <{email_user}>'
            confirm_msg['To'] = email
            confirm_msg['Subject'] = 'Thank you for contacting ReadmeArchitect! 🚀'
            
            confirm_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Thank You - ReadmeArchitect</title>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }}
                    .header {{ background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Thank You, {name}! 🙏</h1>
                        <p>Your message has been received</p>
                    </div>
                    <p>Hi {name},</p>
                    <p>Thank you for reaching out! I've received your message about "<strong>{subject}</strong>" and I'll get back to you within 24-48 hours.</p>
                    <p>In the meantime, feel free to:</p>
                    <ul>
                        <li>🚀 Try out ReadmeArchitect: <a href="https://readmearchitect.vercel.app/generate">Generate a README</a></li>
                        <li>⭐ Star us on GitHub: <a href="https://github.com/Deepender25/Readme-Architect-AI">GitHub Repository</a></li>
                    </ul>
                    <p>Best regards,<br>Deepender Yadav<br>Creator of ReadmeArchitect</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
                        <p>ReadmeArchitect - Making documentation beautiful! 🎨</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            confirm_msg.attach(MIMEText(confirm_html, 'html'))
            
            print('📧 Sending confirmation email...')
            server.send_message(confirm_msg)
            
            server.quit()
            print('✅ All emails sent successfully')
            return True
            
        except Exception as e:
            print(f'❌ Email sending failed: {str(e)}')
            return False

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
