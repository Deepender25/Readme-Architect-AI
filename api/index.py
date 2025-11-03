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

        # Only handle generate, stream, and contact endpoints
        if parsed_url.path == '/api/generate':
            self.handle_generate(query_params)
        elif parsed_url.path == '/api/stream':
            self.handle_stream(query_params)
        elif parsed_url.path == '/api/python/contact':
            self.handle_contact()
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

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
            self.send_json_response({"error": f"Generation failed: {str(e)}"}, 500)

    def handle_stream(self, query_params):
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
        
        # Set headers for streaming
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Connection', 'keep-alive')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        try:
            # Stream progress updates
            self.stream_message("Starting README generation...")
            
            repo_path, error = self.download_repo(repo_url)
            if error:
                self.stream_message(f"Error: {error}")
                return
            
            self.stream_message("Repository downloaded successfully!")
            self.stream_message("Analyzing codebase...")
            
            analysis, error = self.analyze_codebase(repo_path)
            if error:
                self.stream_message(f"Error: {error}")
                return
            
            self.stream_message("Codebase analysis complete!")
            self.stream_message("Generating README with AI...")
            
            readme_content, error = self.generate_readme_with_gemini(
                analysis, project_name, include_demo, num_screenshots, num_videos
            )
            if error:
                self.stream_message(f"Error: {error}")
                return
            
            self.stream_message("README generation complete!")
            self.stream_message("FINAL_RESULT:" + readme_content)
            
            if repo_path and os.path.exists(repo_path):
                shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
                
        except Exception as e:
            self.stream_message(f"Error: Generation failed: {str(e)}")

    def handle_contact(self):
        if self.command != 'POST':
            self.send_json_response({'error': 'Method not allowed'}, 405)
            return
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            message = data.get('message', '').strip()
            
            if not all([name, email, message]):
                self.send_json_response({'error': 'All fields are required'}, 400)
                return
            
            # Send email using the email service
            from .email_service import send_contact_email
            success = send_contact_email(name, email, message)
            
            if success:
                self.send_json_response({'message': 'Message sent successfully!'})
            else:
                self.send_json_response({'error': 'Failed to send message'}, 500)
                
        except Exception as e:
            self.send_json_response({'error': f'Server error: {str(e)}'}, 500)

    def stream_message(self, message):
        """Send a message in the streaming response"""
        try:
            self.wfile.write(f"{message}\n".encode('utf-8'))
            self.wfile.flush()
        except:
            pass

    def download_repo(self, repo_url):
        """Download repository from GitHub URL"""
        try:
            # Parse GitHub URL
            if 'github.com' not in repo_url:
                return None, "Invalid GitHub URL"
            
            # Convert to API URL
            if repo_url.endswith('.git'):
                repo_url = repo_url[:-4]
            
            parts = repo_url.replace('https://github.com/', '').split('/')
            if len(parts) < 2:
                return None, "Invalid repository URL format"
            
            owner, repo = parts[0], parts[1]
            api_url = f"https://api.github.com/repos/{owner}/{repo}/zipball"
            
            # Create temp directory
            temp_dir = tempfile.mkdtemp()
            zip_path = os.path.join(temp_dir, 'repo.zip')
            
            # Download repository
            response = requests.get(api_url, stream=True)
            if response.status_code != 200:
                return None, f"Failed to download repository: {response.status_code}"
            
            with open(zip_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Extract repository
            extract_path = os.path.join(temp_dir, 'extracted')
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
            
            # Find the actual repo directory
            extracted_items = os.listdir(extract_path)
            if len(extracted_items) == 1:
                repo_path = os.path.join(extract_path, extracted_items[0])
            else:
                repo_path = extract_path
            
            return repo_path, None
            
        except Exception as e:
            return None, f"Download failed: {str(e)}"

    def analyze_codebase(self, repo_path):
        """Analyze the codebase structure and content"""
        try:
            analysis = {
                'structure': {},
                'languages': {},
                'key_files': {},
                'dependencies': {},
                'readme_exists': False
            }
            
            # Walk through the repository
            for root, dirs, files in os.walk(repo_path):
                # Skip hidden directories and common ignore patterns
                dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', 'venv', 'env']]
                
                rel_path = os.path.relpath(root, repo_path)
                if rel_path == '.':
                    rel_path = ''
                
                for file in files:
                    if file.startswith('.'):
                        continue
                    
                    file_path = os.path.join(root, file)
                    rel_file_path = os.path.join(rel_path, file) if rel_path else file
                    
                    # Get file extension
                    _, ext = os.path.splitext(file)
                    ext = ext.lower()
                    
                    # Count languages
                    if ext:
                        analysis['languages'][ext] = analysis['languages'].get(ext, 0) + 1
                    
                    # Check for key files
                    if file.lower() in ['readme.md', 'readme.txt', 'readme']:
                        analysis['readme_exists'] = True
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                analysis['key_files']['readme'] = f.read()[:2000]  # First 2000 chars
                        except:
                            pass
                    
                    elif file in ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml']:
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                analysis['key_files'][file] = f.read()
                        except:
                            pass
                    
                    # Sample some code files
                    elif ext in ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.php'] and len(analysis['key_files']) < 10:
                        try:
                            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()[:1000]  # First 1000 chars
                                analysis['key_files'][rel_file_path] = content
                        except:
                            pass
            
            return analysis, None
            
        except Exception as e:
            return None, f"Analysis failed: {str(e)}"

    def generate_readme_with_gemini(self, analysis, project_name, include_demo, num_screenshots, num_videos):
        """Generate README using Google Gemini AI"""
        if not AI_AVAILABLE:
            return None, "AI service not available"
        
        try:
            # Create the prompt
            prompt = self.create_readme_prompt(analysis, project_name, include_demo, num_screenshots, num_videos)
            
            # Generate with Gemini
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            
            if response.text:
                return response.text, None
            else:
                return None, "AI generated empty response"
                
        except Exception as e:
            return None, f"AI generation failed: {str(e)}"

    def create_readme_prompt(self, analysis, project_name, include_demo, num_screenshots, num_videos):
        """Create a comprehensive prompt for README generation"""
        
        # Determine primary language
        languages = analysis.get('languages', {})
        primary_lang = max(languages.keys(), key=languages.get) if languages else 'Unknown'
        
        # Get project info
        project_info = f"Project Name: {project_name or 'Unknown'}\n"
        project_info += f"Primary Language: {primary_lang}\n"
        project_info += f"Languages Found: {', '.join(languages.keys())}\n"
        
        # Add key files info
        key_files = analysis.get('key_files', {})
        if 'package.json' in key_files:
            project_info += "Framework: Node.js/JavaScript\n"
        elif 'requirements.txt' in key_files:
            project_info += "Framework: Python\n"
        elif 'Cargo.toml' in key_files:
            project_info += "Framework: Rust\n"
        
        prompt = f"""
Create a comprehensive, professional README.md file for this project:

{project_info}

Key Files Analysis:
{json.dumps(key_files, indent=2)[:2000]}

Requirements:
1. Create an engaging project title and description
2. Include installation instructions
3. Add usage examples
4. Include contribution guidelines
5. Add license information
6. Use proper markdown formatting
7. Make it professional and well-structured

{"8. Include a demo section with placeholder for screenshots" if include_demo else ""}
{"9. Add placeholders for " + str(num_screenshots) + " screenshots" if num_screenshots > 0 else ""}
{"10. Add placeholders for " + str(num_videos) + " videos" if num_videos > 0 else ""}

Generate a complete, ready-to-use README.md file:
"""
        
        return prompt

    def send_json_response(self, data, status_code=200):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        response_json = json.dumps(data, ensure_ascii=False)
        self.wfile.write(response_json.encode('utf-8'))