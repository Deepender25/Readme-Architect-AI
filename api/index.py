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
                
                elif f in ['requirements.txt', 'package.json', 'pyproject.toml']:
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

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        
        if parsed_url.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoDoc AI</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css">
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background-color: #0a0a0f; color: #e0e0e0; height: 100vh; overflow: hidden; }
        .spline-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
        .main-container { position: relative; z-index: 2; height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; padding: 20px; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes subtleGlow { 0%, 100% { box-shadow: 0 0 20px rgba(168, 178, 255, 0.1); } 50% { box-shadow: 0 0 30px rgba(168, 178, 255, 0.2); } }
        
        .glass-morphism-container { 
            /* Professional Glass Container - Sweet Spot Size */
            background: rgba(255, 255, 255, 0.08); 
            backdrop-filter: blur(20px) saturate(120%); 
            -webkit-backdrop-filter: blur(20px) saturate(120%); 
            border-radius: 16px; 
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 
                0 4px 24px rgba(0, 0, 0, 0.15),
                0 1px 4px rgba(0, 0, 0, 0.1);
            
            padding: 36px 44px; 
            width: 100%; 
            max-width: 1400px;
            height: 88vh;
            display: flex; 
            flex-direction: column; 
            position: relative; 
            overflow: hidden; 
            animation: fadeInUp 0.6s ease-out forwards; 
        }
        
        /* Remove border animation - no glare */
        
        /* Liquid Glass Hover Effect */
        .glass-morphism-container:hover {
            transform: translateY(-2px) scale(1.002);
            box-shadow: 
                0 16px 64px rgba(0, 0, 0, 0.5),
                0 4px 16px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.25),
                inset 0 -1px 0 rgba(255, 255, 255, 0.15);
        }
        
        /* Liquid Glass Animations */
        @keyframes liquidGlassIntro {
            0% {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
                backdrop-filter: blur(0px) saturate(100%);
                border-radius: 8px;
            }
            50% {
                opacity: 0.7;
                transform: translateY(10px) scale(0.98);
                backdrop-filter: blur(20px) saturate(140%);
                border-radius: 24px;
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                backdrop-filter: blur(40px) saturate(180%);
                border-radius: 32px;
            }
        }
        
        @keyframes liquidFloat {
            0%, 100% {
                transform: translateY(0) rotateX(0deg) rotateY(0deg);
            }
            25% {
                transform: translateY(-3px) rotateX(0.5deg) rotateY(-0.5deg);
            }
            50% {
                transform: translateY(-1px) rotateX(-0.3deg) rotateY(0.3deg);
            }
            75% {
                transform: translateY(-4px) rotateX(0.2deg) rotateY(-0.2deg);
            }
        }
        
        @keyframes liquidBorderFlow {
            0%, 100% {
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.3) 0%,
                    rgba(255, 255, 255, 0.1) 25%,
                    rgba(168, 178, 255, 0.2) 50%,
                    rgba(255, 255, 255, 0.1) 75%,
                    rgba(255, 255, 255, 0.3) 100%
                );
            }
            33% {
                background: linear-gradient(135deg, 
                    rgba(168, 178, 255, 0.2) 0%,
                    rgba(255, 255, 255, 0.3) 25%,
                    rgba(255, 255, 255, 0.1) 50%,
                    rgba(168, 178, 255, 0.2) 75%,
                    rgba(255, 255, 255, 0.3) 100%
                );
            }
            66% {
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(168, 178, 255, 0.2) 25%,
                    rgba(255, 255, 255, 0.3) 50%,
                    rgba(255, 255, 255, 0.1) 75%,
                    rgba(168, 178, 255, 0.2) 100%
                );
            }
        }
        
        .app-header {
            display: grid; 
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            width: 100%;
            padding: 24px 0;
            margin-bottom: 32px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
        }
        

        
        .title-container { grid-column: 2; text-align: center; }
        .title { 
            font-size: 2.4rem; 
            font-weight: 600; 
            color: #ffffff;
            letter-spacing: -0.02em;
            margin-bottom: 8px;
        }
        .subtitle { 
            color: #a0a8b8; 
            font-size: 1rem; 
            font-weight: 400;
            opacity: 0.9;
        }
        
        .back-btn {
            grid-column: 3; 
            justify-self: end; 
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #f0f0f0;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            visibility: hidden;
            opacity: 0;
        }
        .back-btn.visible { visibility: visible; opacity: 1; }
        .back-btn:hover { 
            background: rgba(255, 255, 255, 0.2); 
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .content-stage { flex-grow: 1; display: flex; align-items: center; justify-content: center; min-height: 0; position: relative; }
        #input-view, #output-view, #loader-view { 
            width: 100%; 
            height: 100%; 
            display: flex; 
            position: absolute; 
            top: 0; 
            left: 0; 
        }
        #input-view { flex-direction: column; align-items: center; justify-content: center; }
        
        #repo-form { display: flex; flex-direction: column; width: 100%; max-width: 1000px; gap: 25px; }
        .form-main { display: flex; gap: 15px; width: 100%; }
        
        #repo-url { 
            flex-grow: 1; 
            padding: 16px 20px; 
            font-size: 1rem; 
            font-weight: 400;
            
            /* Professional Input Styling */
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px; 
            color: #ffffff; 
            outline: 0; 
            
            /* Clean Shadow */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            
            transition: all 0.3s ease;
        }
        
        #repo-url::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, 
                transparent 0%,
                rgba(168, 178, 255, 0.1) 50%,
                transparent 100%
            );
            transform: translateX(-100%);
            transition: transform 0.6s ease;
        }
        
        #repo-url:focus::before {
            transform: translateX(100%);
        }
        
        #repo-url::placeholder { 
            color: rgba(255, 255, 255, 0.6); 
            font-weight: 400;
        }
        
        #repo-url:focus { 
            border-color: rgba(168, 178, 255, 0.6);
            background: linear-gradient(135deg, 
                rgba(168, 178, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(168, 178, 255, 0.08) 100%
            );
            box-shadow: 
                0 0 0 4px rgba(168, 178, 255, 0.15),
                0 8px 32px rgba(168, 178, 255, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            transform: translateY(-2px) scale(1.01);
        }
        
        #generate-btn { 
            padding: 22px 40px; 
            border-radius: 20px; 
            border: 0; 
            font-size: 1.2rem; 
            font-weight: 600; 
            color: #fff; 
            position: relative;
            overflow: hidden;
            
            /* iOS 26 Liquid Glass Button */
            background: linear-gradient(135deg,
                rgba(142, 68, 173, 0.9) 0%,
                rgba(52, 152, 219, 0.9) 100%
            );
            backdrop-filter: blur(20px) saturate(150%);
            box-shadow: 
                0 8px 32px rgba(142, 68, 173, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            
            cursor: pointer; 
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        #generate-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(90deg, 
                transparent 0%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 100%
            );
            transform: translateX(-100%);
            transition: transform 0.6s ease;
        }
        
        #generate-btn:hover::before {
            transform: translateX(100%);
        }
        
        #generate-btn:hover:not(:disabled) { 
            transform: translateY(-3px) scale(1.02);
            background: linear-gradient(135deg,
                rgba(142, 68, 173, 1) 0%,
                rgba(52, 152, 219, 1) 100%
            );
            box-shadow: 
                0 12px 48px rgba(142, 68, 173, 0.4),
                0 4px 16px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        #generate-btn:disabled { 
            background: linear-gradient(135deg,
                rgba(85, 85, 85, 0.6) 0%,
                rgba(68, 68, 68, 0.6) 100%
            );
            cursor: not-allowed; 
            opacity: 0.6;
            transform: none;
        }
        
        .form-options {
            /* Thick Liquid Glass Slab */
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 25%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.08) 75%,
                rgba(255, 255, 255, 0.15) 100%
            );
            backdrop-filter: blur(35px) saturate(170%);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 32px 36px;
            
            /* Thick Glass Shadow System */
            box-shadow: 
                0 12px 40px rgba(0, 0, 0, 0.3),
                0 4px 16px rgba(0, 0, 0, 0.2),
                0 1px 4px rgba(0, 0, 0, 0.1),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                inset 0 -2px 0 rgba(255, 255, 255, 0.1),
                inset 2px 0 0 rgba(255, 255, 255, 0.05),
                inset -2px 0 0 rgba(255, 255, 255, 0.05);
            
            display: flex;
            flex-direction: column;
            gap: 28px;
            max-width: 800px;
            width: 100%;
            align-self: center;
            position: relative;
            
            /* Glass Thickness Effect */
            transform: translateZ(0);
            transform-style: preserve-3d;
            
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        /* Removed shimmer animation to eliminate glare */
        
        .form-options:hover {
            transform: translateY(-2px) translateZ(10px);
            box-shadow: 
                0 16px 50px rgba(0, 0, 0, 0.4),
                0 6px 20px rgba(0, 0, 0, 0.25),
                0 2px 8px rgba(0, 0, 0, 0.15),
                inset 0 2px 0 rgba(255, 255, 255, 0.25),
                inset 0 -2px 0 rgba(255, 255, 255, 0.15);
        }
        
        @keyframes glassShimmer {
            0%, 100% { opacity: 0; transform: translateX(-100%) skewX(-15deg); }
            50% { opacity: 1; transform: translateX(100%) skewX(-15deg); }
        }
        
        .option-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .option-group:last-of-type { padding-bottom: 0; border-bottom: none; }
        .option-row { display: flex; justify-content: space-between; align-items: center; }
        
        .text-option-input { 
            flex-grow: 1; 
            background: rgba(0,0,0,0.3); 
            border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 8px; 
            color: #fff; 
            outline: 0; 
            transition: all .3s ease; 
            padding: 10px 15px; 
            font-size: 0.95rem; 
            margin-left: 20px; 
            max-width: 250px; 
        }
        .text-option-input::placeholder { color: #888; }
        .text-option-input:focus { border-color: #a8b2ff; }
        
        .option-label { font-size: 1.1rem; color: #d0d0f0; font-weight: 500; margin-right: 20px; }
        
        .toggle-switch { position: relative; display: inline-block; width: 60px; height: 34px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider-label { 
            position: absolute; 
            cursor: pointer; 
            top: 0; left: 0; right: 0; bottom: 0; 
            background-color: #3e3e52; 
            border: 1px solid rgba(255, 255, 255, 0.2); 
            border-radius: 34px; 
            transition: .4s; 
        }
        .slider-label:before { 
            position: absolute; 
            content: ""; 
            height: 26px; 
            width: 26px; 
            left: 3px; 
            bottom: 3px; 
            background-color: white; 
            border-radius: 50%; 
            transition: .4s; 
        }
        input:checked + .slider-label { background-color: #8e44ad; border-color: #c5a8ff; }
        input:checked + .slider-label:before { transform: translateX(26px); }
        
        .demo-counts { 
            display: none;
            justify-content: space-around; 
            gap: 30px; 
            border-top: 1px solid rgba(255,255,255,0.1); 
            padding-top: 25px; 
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }
        .demo-counts.visible { 
            display: flex; 
            opacity: 1; 
            transform: translateY(0); 
        }
        
        .quantity-selector { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            background-color: rgba(0,0,0,0.2); 
            padding: 12px 20px; 
            border-radius: 12px; 
        }
        .quantity-selector label { font-size: 1rem; color: #ccc; }
        .quantity-selector svg { stroke: #a8b2ff; width: 22px; height: 22px; }
        .quantity-selector input[type="number"] { 
            background: rgba(0,0,0,0.3); 
            border: 1px solid rgba(255,255,255,0.15); 
            color: #fff; 
            padding: 8px 10px; 
            border-radius: 8px; 
            width: 70px; 
            font-size: 1rem; 
            outline: none; 
            text-align: center; 
        }
        .quantity-selector input[type="number"]:focus { border-color: #a8b2ff; }
        
        #output-view { flex-direction: row; gap: 20px; }
        .pane { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            min-width: 0;
            
            /* Thick Liquid Glass Pane Slab */
            background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.06) 25%,
                rgba(255, 255, 255, 0.04) 50%,
                rgba(255, 255, 255, 0.06) 75%,
                rgba(255, 255, 255, 0.12) 100%
            );
            backdrop-filter: blur(40px) saturate(180%);
            border: 2px solid rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            
            /* Thick Glass Shadow System */
            box-shadow: 
                0 16px 48px rgba(0, 0, 0, 0.25),
                0 6px 20px rgba(0, 0, 0, 0.15),
                0 2px 8px rgba(0, 0, 0, 0.1),
                inset 0 2px 0 rgba(255, 255, 255, 0.15),
                inset 0 -2px 0 rgba(255, 255, 255, 0.08),
                inset 2px 0 0 rgba(255, 255, 255, 0.05),
                inset -2px 0 0 rgba(255, 255, 255, 0.05);
            
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        /* Removed pane shimmer animation to eliminate glare */
        
        .pane:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.3),
                0 8px 24px rgba(0, 0, 0, 0.2),
                0 3px 12px rgba(0, 0, 0, 0.15),
                inset 0 2px 0 rgba(255, 255, 255, 0.2),
                inset 0 -2px 0 rgba(255, 255, 255, 0.1);
        }
        
        @keyframes paneShimmer {
            0%, 100% { opacity: 0; transform: rotate(45deg) translateX(-200%); }
            50% { opacity: 1; transform: rotate(45deg) translateX(200%); }
        }
        .pane-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px 20px; 
            flex-shrink: 0; 
            background: rgba(0,0,0,0.15); 
            border-bottom: 1px solid rgba(255,255,255,.1); 
        }
        .pane-header h2 { font-size: 0.875rem; color: #aaa; font-weight: 500; }
        
        .copy-btn { 
            display: flex; 
            align-items: center; 
            gap: 6px; 
            background: transparent; 
            border: 1px solid rgba(255,255,255,0.2); 
            color: #ccc; 
            padding: 6px 12px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 0.8rem; 
            transition: all 0.3s ease; 
        }
        .copy-btn:hover { 
            background: rgba(255,255,255,0.1); 
            transform: translateY(-1px);
        }
        
        .pane pre { flex-grow: 1; overflow-y: auto; margin: 0; min-height: 0; }
        .pane pre code { white-space: pre-wrap; word-break: break-word; }
        #preview-content { flex-grow: 1; overflow-y: auto; padding: 20px; min-height: 0; }
        
        #loader-view { flex-direction: column; align-items: center; justify-content: center; gap: 40px; }
        .loader-text { font-size: 1.5rem; color: #d0d0f0; font-weight: 500; }
        
        .github-octocat-loader { 
            position: relative; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            border-radius: 50%; 
        }
        .github-octocat-loader svg { 
            animation: breathe 2.5s ease-in-out infinite; 
        }
        .github-octocat-loader svg path { fill: #c5a8ff; }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .glass-morphism-container { padding: 20px; height: 95vh; }
            .title { font-size: 2rem; }
            .subtitle { font-size: 1rem; }
            .form-main { flex-direction: column; }
            #repo-url, #generate-btn { font-size: 1rem; padding: 18px 24px; }
            .form-options { padding: 20px; }
            .option-row { flex-direction: column; align-items: flex-start; gap: 10px; }
            .text-option-input { max-width: 100%; margin-left: 0; }
            .demo-counts { flex-direction: column; }
            #output-view { flex-direction: column; }
            .app-header { grid-template-columns: auto 1fr; }
            .title-container { text-align: left; }
            .back-btn { grid-column: 2; }
        }
    </style>
</head>
<body>
    <div class="spline-background">
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.32/build/spline-viewer.js"></script>
        <spline-viewer url="https://prod.spline.design/1JMRk3yqXSOTghO3/scene.splinecode"></spline-viewer>
    </div>
    
    <div class="main-container">
        <div class="glass-morphism-container">
            <div class="app-header">
                <div class="title-container">
                    <h1 class="title">AutoDoc AI</h1>
                    <p class="subtitle">Smart docs for smart code.</p>
                </div>
                <button id="back-btn" class="back-btn">Start New</button>
            </div>
            
            <div class="content-stage">
                <div id="input-view">
                    <form id="repo-form">
                        <div class="form-main">
                            <input type="url" id="repo-url" placeholder="Paste your public GitHub repository URL..." required>
                            <button type="submit" id="generate-btn"><span>Forge Docs</span></button>
                        </div>
                        <div class="form-options">
                            <div class="option-group">
                                <div class="option-row">
                                    <label for="project-name" class="option-label">Project Name</label>
                                    <input type="text" id="project-name" class="text-option-input" placeholder="Optional: Let AI decide">
                                </div>
                            </div>
                            <div class="option-group">
                                <div class="option-row">
                                    <label for="include-demo" class="option-label">Include Demo Placeholders</label>
                                    <div class="toggle-switch">
                                        <input type="checkbox" id="include-demo">
                                        <label for="include-demo" class="slider-label"></label>
                                    </div>
                                </div>
                                <div id="demo-counts-container" class="demo-counts">
                                    <div class="quantity-selector">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        <label for="num-screenshots">Screenshots</label>
                                        <input type="number" id="num-screenshots" value="2" min="0" max="10">
                                    </div>
                                    <div class="quantity-selector">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                        <label for="num-videos">Videos</label>
                                        <input type="number" id="num-videos" value="1" min="0" max="5">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div id="output-view" style="display: none;">
                    <div class="pane">
                        <div class="pane-header">
                            <h2>Markdown Code</h2>
                            <button onclick="copyCode()" id="copy-btn" class="copy-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                <span>Copy</span>
                            </button>
                        </div>
                        <pre><code id="code-view" class="language-markdown"></code></pre>
                    </div>
                    <div class="pane">
                        <div class="pane-header"><h2>Live Preview</h2></div>
                        <div id="preview-content"></div>
                    </div>
                </div>

                <div id="loader-view" style="display: none;">
                    <div class="github-octocat-loader">
                        <svg height="120" viewBox="0 0 16 16" version="1.1" width="120" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    </div>
                    <p id="loader-text" class="loader-text">Connecting to GitHub...</p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    
    <script>
        // Professional AutoDoc AI JavaScript
        const form = document.getElementById('repo-form');
        const repoUrlInput = document.getElementById('repo-url');
        const projectNameInput = document.getElementById('project-name');
        const generateBtn = document.getElementById('generate-btn');
        const backBtn = document.getElementById('back-btn');
        const includeDemoCheckbox = document.getElementById('include-demo');
        const demoCountsContainer = document.getElementById('demo-counts-container');
        const numScreenshotsInput = document.getElementById('num-screenshots');
        const numVideosInput = document.getElementById('num-videos');
        const inputView = document.getElementById('input-view');
        const outputView = document.getElementById('output-view');
        const loaderView = document.getElementById('loader-view');
        const loaderText = document.getElementById('loader-text');
        const codeView = document.getElementById('code-view');
        const previewContent = document.getElementById('preview-content');
        const copyBtn = document.getElementById('copy-btn');

        let currentView = 'input';
        let isAnimating = false;

        const loadingMessages = [
            "Connecting to GitHub...",
            "Downloading repository...",
            "Analyzing file structure...",
            "Parsing code dependencies...",
            "Generating with AI...",
            "Finalizing README..."
        ];
        let messageIndex = 0;

        function updateLoaderText() {
            loaderText.textContent = loadingMessages[messageIndex];
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }

        // Demo placeholders functionality
        includeDemoCheckbox.addEventListener('change', () => {
            if (includeDemoCheckbox.checked) {
                demoCountsContainer.classList.add('visible');
            } else {
                demoCountsContainer.classList.remove('visible');
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const repoUrl = repoUrlInput.value;
            if (!repoUrl || isAnimating) return;

            setView('loader');
            const loaderInterval = setInterval(updateLoaderText, 2000);

            const params = new URLSearchParams({
                repo_url: repoUrl,
                project_name: projectNameInput.value.trim(),
                include_demo: includeDemoCheckbox.checked,
                num_screenshots: parseInt(numScreenshotsInput.value, 10) || 0,
                num_videos: parseInt(numVideosInput.value, 10) || 0,
            });

            try {
                const response = await fetch('/api/generate?' + params.toString());
                const data = await response.json();

                clearInterval(loaderInterval);

                if (data.error) {
                    previewContent.innerHTML = '<div style="color: #ff8a8a; padding: 20px;"><h3>Generation Failed</h3><p>' + data.error + '</p></div>';
                    codeView.textContent = '/* Error: ' + data.error + ' */';
                } else {
                    codeView.textContent = data.readme;
                    previewContent.innerHTML = marked.parse(data.readme);
                    hljs.highlightAll();
                }
                
                setView('output');
            } catch (error) {
                clearInterval(loaderInterval);
                previewContent.innerHTML = '<div style="color: #ff8a8a; padding: 20px;"><h3>Connection Error</h3><p>' + error.message + '</p></div>';
                codeView.textContent = '/* Error: ' + error.message + ' */';
                setView('output');
            }
        });

        backBtn.addEventListener('click', () => {
            if (isAnimating) return;
            setView('input');
            repoUrlInput.value = '';
            projectNameInput.value = '';
            includeDemoCheckbox.checked = false;
            demoCountsContainer.classList.remove('visible');
        });

        function setView(viewName) {
            if (viewName === currentView || isAnimating) return;
            isAnimating = true;

            const currentViewEl = document.getElementById(currentView + '-view');
            const nextViewEl = document.getElementById(viewName + '-view');
            
            const timeline = anime.timeline({
                easing: 'easeOutCubic',
                duration: 300,
                complete: () => {
                    isAnimating = false;
                    currentView = viewName;
                }
            });

            if (currentViewEl) {
                timeline.add({
                    targets: currentViewEl,
                    opacity: [1, 0],
                    translateY: [0, -20],
                    duration: 150,
                    complete: () => {
                        currentViewEl.style.display = 'none';
                    }
                });
            }

            timeline.add({
                targets: nextViewEl,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 250,
                begin: () => {
                    nextViewEl.style.display = 'flex';
                },
                complete: () => {
                    if (viewName === 'output') {
                        backBtn.classList.add('visible');
                    } else if (viewName === 'input') {
                        backBtn.classList.remove('visible');
                    }
                }
            });
        }

        function copyCode() {
            navigator.clipboard.writeText(codeView.textContent).then(() => {
                showCopySuccess();
            }).catch(() => {
                alert('Failed to copy text.');
            });
        }

        function showCopySuccess() {
            // 1. Button animation with bounce
            const originalText = copyBtn.querySelector('span').textContent;
            const span = copyBtn.querySelector('span');
            
            anime({
                targets: span,
                scale: [1, 1.3, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .6)',
                complete: () => {
                    span.textContent = 'Copied!';
                    copyBtn.style.background = 'rgba(34, 197, 94, 0.3)';
                    copyBtn.style.borderColor = '#22c55e';
                    copyBtn.style.color = '#22c55e';
                }
            });

            // 2. Enhanced toast notification with liquid glass
            const toast = document.createElement('div');
            toast.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>README copied to clipboard!</span>
                </div>
            `;
            toast.style.cssText = `
                position: fixed;
                top: 30px;
                right: 30px;
                background: linear-gradient(135deg, 
                    rgba(34, 197, 94, 0.15) 0%,
                    rgba(34, 197, 94, 0.1) 50%,
                    rgba(34, 197, 94, 0.15) 100%
                );
                backdrop-filter: blur(30px) saturate(180%);
                border: 1px solid rgba(34, 197, 94, 0.4);
                border-radius: 16px;
                padding: 18px 24px;
                color: #22c55e;
                font-weight: 600;
                font-size: 0.95rem;
                z-index: 10000;
                transform: translateX(120%) scale(0.8);
                opacity: 0;
                box-shadow: 
                    0 12px 40px rgba(34, 197, 94, 0.2),
                    0 4px 16px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            `;
            document.body.appendChild(toast);

            // 3. Sparkle explosion effect
            createSparkleExplosion(copyBtn);

            // 4. Ripple effect on copy button
            createCopyRipple(copyBtn);

            // 5. Flash effect across code pane
            createCodeFlash();

            // Animate toast in
            anime({
                targets: toast,
                translateX: [120, 0],
                scale: [0.8, 1.05, 1],
                opacity: [0, 1],
                duration: 600,
                easing: 'easeOutElastic(1, .8)',
                complete: () => {
                    // Auto-hide after 3.5 seconds
                    setTimeout(() => {
                        anime({
                            targets: toast,
                            translateX: [0, 120],
                            scale: [1, 0.8],
                            opacity: [1, 0],
                            duration: 400,
                            easing: 'easeInBack',
                            complete: () => toast.remove()
                        });
                    }, 3500);
                }
            });

            // Reset button after delay
            setTimeout(() => {
                anime({
                    targets: span,
                    scale: [1, 0.9, 1],
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: () => {
                        span.textContent = originalText;
                        copyBtn.style.background = 'transparent';
                        copyBtn.style.borderColor = 'rgba(255,255,255,0.2)';
                        copyBtn.style.color = '#ccc';
                    }
                });
            }, 3000);
        }

        function createSparkleExplosion(element) {
            const rect = element.getBoundingClientRect();
            const sparkleCount = 12;
            
            for (let i = 0; i < sparkleCount; i++) {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle, #22c55e, #16a34a);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10001;
                    box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
                `;
                
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                sparkle.style.left = x + 'px';
                sparkle.style.top = y + 'px';
                
                document.body.appendChild(sparkle);

                const angle = (i / sparkleCount) * Math.PI * 2;
                const distance = 60 + Math.random() * 40;
                const targetX = Math.cos(angle) * distance;
                const targetY = Math.sin(angle) * distance;

                anime({
                    targets: sparkle,
                    translateX: targetX,
                    translateY: targetY,
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                    duration: 1000 + Math.random() * 500,
                    easing: 'easeOutQuart',
                    complete: () => sparkle.remove()
                });
            }
        }

        function createCopyRipple(element) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                margin: -50px 0 0 -50px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent);
                transform: scale(0);
                pointer-events: none;
                z-index: 10;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);

            anime({
                targets: ripple,
                scale: [0, 3],
                opacity: [0.6, 0],
                duration: 800,
                easing: 'easeOutQuart',
                complete: () => ripple.remove()
            });
        }

        function createCodeFlash() {
            const codePane = codeView.closest('.pane');
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(34, 197, 94, 0.3), 
                    rgba(34, 197, 94, 0.1),
                    transparent
                );
                pointer-events: none;
                z-index: 10;
            `;
            
            codePane.style.position = 'relative';
            codePane.style.overflow = 'hidden';
            codePane.appendChild(flash);

            anime({
                targets: flash,
                left: ['-100%', '100%'],
                duration: 1000,
                easing: 'easeOutQuart',
                complete: () => flash.remove()
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            inputView.style.display = 'flex';
            outputView.style.display = 'none';
            loaderView.style.display = 'none';
        });
    </script>
</body>
</html>'''
            self.wfile.write(html.encode())
            
        elif parsed_url.path == '/api/generate':
            query_params = urllib.parse.parse_qs(parsed_url.query)
            repo_url = query_params.get('repo_url', [''])[0]
            project_name = query_params.get('project_name', [''])[0]
            include_demo = query_params.get('include_demo', ['false'])[0].lower() == 'true'
            num_screenshots = int(query_params.get('num_screenshots', ['0'])[0])
            num_videos = int(query_params.get('num_videos', ['0'])[0])
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if not repo_url:
                response = {"error": "Repository URL is required"}
                self.wfile.write(json.dumps(response).encode())
                return
            
            try:
                repo_path, error = download_repo(repo_url)
                if error:
                    response = {"error": error}
                    self.wfile.write(json.dumps(response).encode())
                    return
                
                analysis, error = analyze_codebase(repo_path)
                if error:
                    response = {"error": error}
                    self.wfile.write(json.dumps(response).encode())
                    return
                
                readme_content, error = generate_readme(analysis, project_name, include_demo, num_screenshots, num_videos)
                if error:
                    response = {"error": error}
                    self.wfile.write(json.dumps(response).encode())
                    return
                
                if repo_path and os.path.exists(repo_path):
                    shutil.rmtree(os.path.dirname(repo_path), ignore_errors=True)
                
                response = {"readme": readme_content}
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                response = {"error": str(e)}
                self.wfile.write(json.dumps(response).encode())
            
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')