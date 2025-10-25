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
            # Download repository
            repo_path, error = self.download_repo(repo_url, access_token)
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
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def normalize_github_url(self, repo_url: str) -> str:
        """Normalize GitHub URL by removing .git suffix and trailing slashes"""
        normalized_url = repo_url.strip()
        if normalized_url.endswith('/'):
            normalized_url = normalized_url[:-1]
        if normalized_url.endswith('.git'):
            normalized_url = normalized_url[:-4]
        return normalized_url

    def download_repo(self, repo_url: str, access_token: str = None):
        temp_dir = None
        try:
            # First normalize the URL
            normalized_url = self.normalize_github_url(repo_url)
            
            if "github.com" in normalized_url:
                api_url = normalized_url.replace("github.com", "api.github.com/repos")
                zip_url = api_url + "/zipball"
            else:
                return None, "Invalid GitHub URL"
            
            # Skip disk space check on Vercel as statvfs may not be available
            
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
                    return None, "Repository not found. If this is a private repository, please make sure you're logged in"
            elif response.status_code == 401:
                return None, "Authentication failed. Please log in again to access private repositories"
            elif response.status_code != 200:
                return None, f"Failed to download repository: {response.status_code}"
            
            # Simplified download for Vercel environment
            temp_dir = tempfile.mkdtemp(prefix='readme_gen_')
            zip_path = os.path.join(temp_dir, "repo.zip")
            
            # Simple download without streaming (works better on Vercel)
            with open(zip_path, 'wb') as f:
                f.write(response.content)
            
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

            # Enhanced prompt with improved sections for better README generation
            prompt = f"""
**Your Role:** You are a Principal Solutions Architect and a world-class technical copywriter with expertise in creating stunning, comprehensive, and professional README.md files for open-source projects. Your documentation must be impeccable, visually appealing, and thoroughly detailed.

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
Based *only* on the analysis above, generate a complete, professional README.md. You MUST make intelligent, bold inferences about the project's purpose, architecture, and features. The tone must be professional, engaging, and polished. Use rich Markdown formatting, including emojis, tables, and blockquotes, to create a visually stunning and informative document that is significantly detailed (aim for 1500+ words minimum).

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
    - [Tech Stack & Architecture](#-tech-stack--architecture)
    - [Project Structure](#-project-structure)
    {f"- [Demo & Screenshots](#-demo--screenshots)" if include_demo and (num_screenshots > 0 or num_videos > 0) else ""}
    - [Environment Variables](#-environment-variables) *(Include if project uses .env files or requires configuration)*
    - [API Keys Setup](#-api-keys-setup) *(Include only if project requires API keys from external services)*
    - [Getting Started](#-getting-started)
    - [Usage](#-usage)
    - [Contributing](#-contributing)
    - [License](#-license)

4.  **⭐ Overview:**
    -   **Hook:** Start with a compelling, single-sentence summary of the project that captures attention.
    -   **The Problem:** In a blockquote, describe the problem this project solves in 2-3 detailed sentences.
    -   **The Solution:** Describe in detail (4-5 sentences minimum) how your project provides an elegant solution to that problem.
    -   **Inferred Architecture:** Based on the file structure and dependencies, describe the high-level architecture in detail (e.g., "This project is a FastAPI-based microservice architecture with..."). Include information about patterns, design principles, and key architectural decisions.

5.  **✨ Key Features:**
    -   A detailed, bulleted list with at least 6-8 key features.
    -   For each feature, provide a brief but impactful explanation (1-2 sentences per feature).
    -   Use emojis to make each feature visually distinct.
    -   Infer features from the code structure, dependencies, and file organization.
    -   Example format:
        - 🚀 **High Performance:** Built with FastAPI for lightning-fast async request handling and automatic API documentation.
        - 🔒 **Secure Authentication:** Implements OAuth 2.0 with JWT tokens for robust security.

6.  **🛠️ Tech Stack & Architecture:**
    -   Create a comprehensive Markdown table listing all primary technologies, languages, and major libraries.
    -   Include columns for "Technology", "Purpose", and "Why it was Chosen".
    -   Be thorough - include at least 5-7 entries.
    -   Example format:
    
    | Technology | Purpose | Why it was Chosen |
    |-----------|---------|-------------------|
    | FastAPI | API Framework | High performance, async support, automatic OpenAPI docs generation |
    | PostgreSQL | Database | Robust ACID compliance, excellent for relational data |
    | Redis | Caching | In-memory data store for high-speed caching and session management |

7.  **📁 Project Structure:**
    -   **MANDATORY:** Create a comprehensive, well-formatted directory tree showing the project's file structure.
    -   **CRITICAL:** Use 📁 emoji for folders/directories and 📄 emoji for files.
    -   Use the file structure data provided in the analysis to create an accurate representation.
    -   Format it as a code block with appropriate tree symbols (├──, └──, │).
    -   Add brief, inline comments for key directories and important files.
    -   **Example format (FOLLOW THIS EXACTLY):**
    ```
    project-name/
    ├── 📁 src/                    # Source code directory
    │   ├── 📁 components/         # React components
    │   │   ├── 📄 Header.tsx      # Application header component
    │   │   └── 📄 Footer.tsx      # Application footer component
    │   ├── 📁 pages/             # Application pages
    │   │   ├── 📄 Home.tsx        # Home page
    │   │   └── 📄 About.tsx       # About page
    │   └── 📁 utils/             # Utility functions
    │       └── 📄 helpers.ts      # Helper functions
    ├── 📁 api/                   # Backend API files
    │   ├── 📄 index.py           # Main API entry point
    │   └── 📄 routes.py          # API route definitions
    ├── 📁 public/                # Static assets
    │   └── 📄 favicon.ico        # Application icon
    ├── 📁 tests/                 # Test files
    │   └── 📄 test_api.py        # API unit tests
    ├── 📄 package.json           # Node.js dependencies and scripts
    ├── 📄 requirements.txt       # Python dependencies
    ├── 📄 README.md             # Project documentation
    ├── 📄 .env.example          # Environment variables template
    └── 📄 .gitignore            # Git ignore rules
    ```
    -   **Important:** Base this EXACTLY on the provided file structure data. Don't make up directories that don't exist.
    -   Ensure ALL folders use 📁 and ALL files use 📄.

8.  **🔐 Environment Variables:**
    -   **Include this section if:** The project has .env files, config files, or requires environment configuration.
    -   Create a professional table with ALL environment variables the project needs.
    -   **Table format (MANDATORY):**
    
    | Variable Name | Description | Required | Default Value | Example |
    |--------------|-------------|----------|---------------|----------|
    | `DATABASE_URL` | PostgreSQL connection string | Yes | None | `postgresql://user:pass@localhost:5432/dbname` |
    | `PORT` | Server port number | No | `8000` | `8000` |
    | `DEBUG` | Enable debug mode | No | `false` | `true` |
    | `SECRET_KEY` | JWT signing secret | Yes | None | `your-secret-key-here` |
    
    -   Add a note after the table: "Create a `.env` file in the root directory and add these variables with your values."

9.  **🔑 API Keys Setup:**
    -   **Include this section ONLY if:** The project requires API keys from external services (OpenAI, Google Cloud, AWS, Stripe, etc.).
    -   **If applicable, provide:**
        1. A table listing all required API keys:
        
        | Service | API Key Variable | Purpose | Free Tier Available |
        |---------|-----------------|---------|--------------------|
        | OpenAI | `OPENAI_API_KEY` | AI text generation | Yes (trial) |
        | Google Cloud | `GOOGLE_API_KEY` | Cloud services | Yes |
        | Stripe | `STRIPE_SECRET_KEY` | Payment processing | Yes (test mode) |
        
        2. **Detailed step-by-step instructions for EACH service:**
        
        ### OpenAI API Key
        1. Visit [OpenAI Platform](https://platform.openai.com/)
        2. Sign up or log in to your account
        3. Navigate to **API Keys** section in your dashboard
        4. Click **Create new secret key**
        5. Copy the key and add it to your `.env` file as `OPENAI_API_KEY=your-key-here`
        6. ⚠️ **Important:** Keep this key secure and never commit it to version control
        
        ### Google Cloud API Key
        1. Go to [Google Cloud Console](https://console.cloud.google.com/)
        2. Create a new project or select an existing one
        3. Navigate to **APIs & Services** > **Credentials**
        4. Click **Create Credentials** > **API Key**
        5. Copy the key and add it to your `.env` file as `GOOGLE_API_KEY=your-key-here`
        6. Enable required APIs (e.g., Gemini AI API) in the API Library
        
        -   Add a professional warning box:
        > **⚠️ Security Warning**
        > Never share your API keys publicly or commit them to version control. Add `.env` to your `.gitignore` file. Rotate keys immediately if exposed.

{demo_section}

10. **🚀 Getting Started:**
    -   **Prerequisites:** A detailed bulleted list of ALL software/tools the user needs with specific versions.
        Example:
        - 🐍 Python 3.9 or higher
        - 📦 Node.js v18+ and npm v9+
        - 🐘 PostgreSQL 14+
        - 🔧 Git for version control
    
    -   **Installation:** A comprehensive, numbered, step-by-step guide:
        
        ### Installation Steps
        
        1. **Clone the repository**
           ```bash
           git clone https://github.com/username/project-name.git
           cd project-name
           ```
        
        2. **Create a virtual environment** (for Python projects)
           ```bash
           python -m venv venv
           source venv/bin/activate  # On Windows: venv\\Scripts\\activate
           ```
        
        3. **Install dependencies**
           ```bash
           pip install -r requirements.txt
           # OR for Node.js projects:
           npm install
           # OR:
           yarn install
           ```
        
        4. **Set up environment variables**
           ```bash
           cp .env.example .env
           # Edit .env with your actual values
           ```
        
        5. **Initialize the database** (if applicable)
           ```bash
           python manage.py migrate
           # OR:
           npm run db:migrate
           ```
        
        6. **Run the application**
           ```bash
           python main.py
           # OR:
           npm run dev
           ```

11. **🔧 Usage:**
    -   Provide comprehensive, detailed instructions on how to use the application.
    -   Include multiple examples for different use cases.
    -   **For APIs:** Provide at least 3 `curl` examples with different endpoints.
    -   **For CLIs:** Provide at least 3 command-line examples with explanations.
    -   **For web apps:** Provide step-by-step usage instructions with URLs.
    -   Example format:
    
    ### Running the Development Server
    ```bash
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    
    ### API Examples
    
    **Create a new resource:**
    ```bash
    curl -X POST http://localhost:8000/api/resource \
      -H "Content-Type: application/json" \
      -d '{"name": "example", "value": 123}'
    ```
    
    **Get all resources:**
    ```bash
    curl http://localhost:8000/api/resources
    ```
    
    **Access the interactive API documentation:**
    - Swagger UI: http://localhost:8000/docs
    - ReDoc: http://localhost:8000/redoc

12. **🤝 Contributing:**
    -   Create a welcoming, detailed contributing section that encourages participation.
    -   **Use this enhanced format:**
    
    We welcome contributions to improve [Project Name]! Your input helps make this project better for everyone.
    
    ### How to Contribute
    
    1. **Fork the repository** - Click the 'Fork' button at the top right of this page
    2. **Create a feature branch** 
       ```bash
       git checkout -b feature/amazing-feature
       ```
    3. **Make your changes** - Improve code, documentation, or features
    4. **Test thoroughly** - Ensure all functionality works as expected
       ```bash
       pytest tests/
       # OR
       npm test
       ```
    5. **Commit your changes** - Write clear, descriptive commit messages
       ```bash
       git commit -m 'Add: Amazing new feature that does X'
       ```
    6. **Push to your branch**
       ```bash
       git push origin feature/amazing-feature
       ```
    7. **Open a Pull Request** - Submit your changes for review
    
    ### Development Guidelines
    
    - ✅ Follow the existing code style and conventions
    - 📝 Add comments for complex logic and algorithms
    - 🧪 Write tests for new features and bug fixes
    - 📚 Update documentation for any changed functionality
    - 🔄 Ensure backward compatibility when possible
    - 🎯 Keep commits focused and atomic
    
    ### Ideas for Contributions
    
    We're looking for help with:
    
    - 🐛 **Bug Fixes:** Report and fix bugs
    - ✨ **New Features:** Implement requested features from issues
    - 📖 **Documentation:** Improve README, add tutorials, create examples
    - 🎨 **UI/UX:** Enhance user interface and experience
    - ⚡ **Performance:** Optimize code and improve efficiency
    - 🌐 **Internationalization:** Add multi-language support
    - 🧪 **Testing:** Increase test coverage
    - ♿ **Accessibility:** Make the project more accessible
    
    ### Code Review Process
    
    - All submissions require review before merging
    - Maintainers will provide constructive feedback
    - Changes may be requested before approval
    - Once approved, your PR will be merged and you'll be credited
    
    ### Questions?
    
    Feel free to open an issue for any questions or concerns. We're here to help!

13. **📝 License:**
    -   Create a professional, detailed license section.
    -   **Enhanced format:**
    
    ## 📝 License
    
    This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.
    
    ### What this means:
    
    - ✅ **Commercial use:** You can use this project commercially
    - ✅ **Modification:** You can modify the code
    - ✅ **Distribution:** You can distribute this software
    - ✅ **Private use:** You can use this project privately
    - ⚠️ **Liability:** The software is provided "as is", without warranty
    - ⚠️ **Trademark:** This license does not grant trademark rights
    
    ### Copyright Notice
    
    Copyright (c) [YEAR] [COPYRIGHT HOLDER]
    
    ```
    MIT License
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    ```
    
    ---
    
    <p align="center">Made with ❤️ by the [Project Name] Team</p>
    <p align="center">
      <a href="#">⬆️ Back to Top</a>
    </p>

**Critical Final Instructions:** 
- The output MUST be ONLY the raw Markdown content - no commentary, greetings, or explanations.
- The README must be substantially detailed with at least 1500 words.
- All sections must be comprehensive and thoroughly explained.
- Use proper emojis, tables, code blocks, and formatting throughout.
- Ensure 📁 for ALL folders and 📄 for ALL files in the project structure.
- Adhere strictly to the requested format and quality bar.
"""

            # No fallback README - return proper errors instead
            
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