# main.py

# --- Standard Library Imports ---
import os
import shutil
import tempfile
import traceback
import ast
from typing import Optional

# --- Third-Party Imports ---
import git
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import asyncio
import json

# --- 1. Configuration and Initialization ---

load_dotenv()

try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except TypeError:
    raise RuntimeError("GOOGLE_API_KEY is not set. Please create a .env file and add your API key.") from None

class RepoRequest(BaseModel):
    repo_url: str
    project_name: Optional[str] = Field(default=None, description="Optional user-defined project name.")
    include_demo: bool = Field(default=False)
    num_screenshots: int = Field(default=0, ge=0, le=10)
    num_videos: int = Field(default=0, ge=0, le=5)

app = FastAPI(
    title="AutoDoc AI",
    description="An API to generate premium README files for a GitHub repository using Google Gemini.",
    version="2.0.3",
)


# --- 2. Core Logic Functions ---

def clone_repo(repo_url: str) -> str:
    try:
        temp_dir = tempfile.mkdtemp()
        print(f"Cloning {repo_url} into {temp_dir}...")
        git.Repo.clone_from(repo_url, temp_dir, depth=1)
        print("Cloning successful.")
        return temp_dir
    except git.exc.GitCommandError as e:
        print(f"GitCommandError: {e}")
        # Make sure to cleanup the temp directory on failure
        cleanup_repo(temp_dir)
        raise HTTPException(status_code=400, detail=f"Failed to clone. Is the URL correct and public? Error: {e.stderr}")
    except Exception as e:
        print(f"An unexpected error occurred during cloning: {e}")
        # Make sure to cleanup the temp directory on failure
        cleanup_repo(temp_dir)
        raise HTTPException(status_code=500, detail=f"An unexpected error during cloning: {e}")

def cleanup_repo(path: str):
    if path and os.path.exists(path):
        try:
            shutil.rmtree(path)
            print(f"Cleaned up temporary directory: {path}")
        except Exception as e:
            print(f"Error cleaning up directory {path}: {e}")

def analyze_codebase(repo_path: str) -> dict:
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
    return context

def create_prompt(analysis_context: dict, demo_options: dict, project_name: Optional[str] = None) -> str:
    """Creates a massively improved, highly-detailed, and structured prompt for the Gemini model."""
    
    python_summary_str = ""
    for filename, summary in analysis_context['python_code_summary'].items():
        python_summary_str += f"\nFile: `{filename}`:\n"
        if summary['classes']: python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
        if summary['functions']: python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"

    demo_mandate = ""
    num_screenshots = demo_options.get("num_screenshots", 0)
    num_videos = demo_options.get("num_videos", 0)

    if num_screenshots > 0 or num_videos > 0: # Only add section if there are demos
        demo_mandate += "\n\n## 📸 Demo & Screenshots\n\n"

        if num_screenshots > 0:
            if num_screenshots > 0: # Keep this check to avoid empty section
                demo_mandate += "## 🖼️ Screenshots\n\n" # Use a sub-heading instead of details
                for i in range(1, num_screenshots + 1):
                    demo_mandate += f'  <img src="https://placehold.co/800x450/2d2d4d/ffffff?text=App+Screenshot+{i}" alt="App Screenshot {i}" width="100%">\n'
                    demo_mandate += f'  <em><p align="center">Caption for screenshot {i}.</p></em>\n'
                demo_mandate += "\n" # Add a newline for spacing
        
        if num_videos > 0: # Keep this check to avoid empty section
            demo_mandate += "## 🎬 Video Demos\n\n" # Use a sub-heading instead of details
            for i in range(1, num_videos + 1):
                demo_mandate += f'  <a href="https://example.com/your-video-link-{i}" target="_blank">\n'
                demo_mandate += f'    <img src="https://placehold.co/800x450/2d2d4d/c5a8ff?text=Watch+Video+Demo+{i}" alt="Video Demo {i}" width="100%">\n'
                demo_mandate += f'  </a>\n'
                demo_mandate += f'  <em><p align="center">Caption for video demo {i}.</p></em>\n'
            demo_mandate += "\n" # Add a newline for spacing

    # Conditionally set the instruction for the project title
    title_instruction = ""
    if project_name and project_name.strip():
        # User has provided a name, so instruct the AI to use it.
        title_instruction = f"""1.  **Project Title:** Use the exact project title "{project_name}". Center it, and then create a concise, powerful tagline to go underneath it.
        `<h1 align="center"> {project_name} </h1>`
        `<p align="center"> [CREATE A COMPELLING TAGLINE HERE] </p>`"""
    else:
        # No name provided, instruct the AI to create one.
        title_instruction = """1.  **Project Title:** Create a compelling, professional title based on the analysis. Center it and add a concise, powerful tagline underneath.
        `<h1 align="center"> [PROJECT TITLE] </h1>`
        `<p align="center"> [TAGLINE] </p>`"""

    return f"""
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

    3.  **Table of Contents:** Create a clickable table of contents.
        - [Overview](#-overview)
        - [Key Features](#-key-features)
        ... and so on for all major sections.

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

    {demo_mandate}

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

def generate_readme_with_gemini(prompt: str) -> str:
    """Sends the prompt to Gemini Pro and returns the generated README."""
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        if not response.parts:
            reason = "Unknown"
            try: reason = response.prompt_feedback.block_reason.name
            except AttributeError: pass 
            error_message = f"Content generation failed due to safety filters. Reason: {reason}."
            print(f"Gemini Error: {error_message}")
            raise HTTPException(status_code=400, detail=error_message)

        return response.text
        
    except Exception as e:
        print(f"An error occurred while communicating with the Gemini API: {e}")
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"An error occurred with the AI model: {e}")


@app.get("/api/generate")
async def generate(
    repo_url: str,
    project_name: Optional[str] = None,
    include_demo: bool = False,
    num_screenshots: int = 0,
    num_videos: int = 0
):
    async def event_stream():
        repo_path = None
        try:
            # --- 1. Cloning ---
            yield f"data: {json.dumps({'status': 'Cloning repository...'})}\n\n"
            await asyncio.sleep(1) # Simulate work
            repo_path = await asyncio.to_thread(clone_repo, repo_url)

            # --- 2. Analyzing ---
            yield f"data: {json.dumps({'status': 'Analyzing codebase...'})}\n\n"
            await asyncio.sleep(1) # Simulate work
            analysis = await asyncio.to_thread(analyze_codebase, repo_path)

            # --- 3. Prompting ---
            yield f"data: {json.dumps({'status': 'Building prompt for AI...'})}\n\n"
            await asyncio.sleep(1) # Simulate work
            demo_options = {
                "include_demo": include_demo,
                "num_screenshots": num_screenshots,
                "num_videos": num_videos,
            }
            prompt = create_prompt(analysis, demo_options, project_name)

            # --- 4. Generating ---
            yield f"data: {json.dumps({'status': 'Generating README with Gemini...'})}\n\n"
            await asyncio.sleep(1) # Simulate work
            readme_content = await asyncio.to_thread(generate_readme_with_gemini, prompt)
            
            # --- 5. Success ---
            yield f"data: {json.dumps({'readme': readme_content})}\n\n"

        except Exception as e:
            traceback.print_exc()
            error_detail = e.detail if isinstance(e, HTTPException) else str(e)
            yield f"data: {json.dumps({'error': error_detail})}\n\n"
        finally:
            if repo_path:
                cleanup_repo(repo_path)

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/")
async def read_root(): return FileResponse('static/index.html')
app.mount("/static", StaticFiles(directory="static"), name="static")

