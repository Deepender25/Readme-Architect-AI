# api/generate.py - Simple, focused API just for README generation
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
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    AI_AVAILABLE = True
except:
    AI_AVAILABLE = False

def download_repo(repo_url):
    """Download repository as ZIP from GitHub"""
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

def analyze_codebase(repo_path):
    """Analyze the codebase structure"""
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
                            
                            if summary["functions"] or summary["classes"]:
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

def generate_readme(analysis_context, project_name=None, include_demo=False, num_screenshots=0, num_videos=0):
    """Generate README using Google Gemini"""
    if not AI_AVAILABLE:
        return None, "Google AI not available"
    
    try:
        python_summary_str = ""
        for filename, summary in analysis_context.get('python_code_summary', {}).items():
            python_summary_str += f"\nFile: `{filename}`:\n"
            if summary['classes']: 
                python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
            if summary['functions']: 
                python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"
        
        title_instruction = f"""Create a compelling, professional title based on the analysis. Center it and add a concise, powerful tagline underneath.
        `<h1 align="center"> [PROJECT TITLE] </h1>`
        `<p align="center"> [TAGLINE] </p>`"""
        
        if project_name and project_name.strip():
            title_instruction = f"""Use the exact project title "{project_name}". Center it, and then create a concise, powerful tagline to go underneath it.
            `<h1 align="center"> {project_name} </h1>`
            `<p align="center"> [CREATE A COMPELLING TAGLINE HERE] </p>`"""
        
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

class Handler(BaseHTTPRequestHandler):
    def send_json_response(self, data, status_code=200):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        repo_url = query_params.get('repo_url', [''])[0]
        project_name = query_params.get('project_name', [''])[0]
        include_demo = query_params.get('include_demo', ['false'])[0].lower() == 'true'
        num_screenshots = int(query_params.get('num_screenshots', ['0'])[0])
        num_videos = int(query_params.get('num_videos', ['0'])[0])
        
        if not repo_url:
            self.send_json_response({"error": "Repository URL is required"}, 400)
            return
        
        try:
            # Step 1: Download repository
            repo_path, error = download_repo(repo_url)
            if error:
                self.send_json_response({"error": error}, 400)
                return
            
            # Step 2: Analyze codebase
            analysis, error = analyze_codebase(repo_path)
            if error:
                self.send_json_response({"error": error}, 500)
                return
            
            # Step 3: Generate README
            readme_content, error = generate_readme(analysis, project_name, include_demo, num_screenshots, num_videos)
            if error:
                self.send_json_response({"error": error}, 500)
                return
            
            # Step 4: Cleanup and return
            if repo_path and os.path.exists(repo_path):
                shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
            
            self.send_json_response({"readme": readme_content})
            
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)
# Export handler for Vercel
handler = Handler