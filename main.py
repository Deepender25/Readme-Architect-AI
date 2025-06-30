# main.py

# --- Standard Library Imports ---
import os
import shutil
import tempfile
import traceback
import ast 

# --- Third-Party Imports ---
import git
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# --- 1. Configuration and Initialization ---

# Load environment variables from a .env file (for the API key)
load_dotenv()

# Configure the Gemini API with the key from the environment
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except TypeError:
    # This happens if the API key is not set. We raise an error to stop the server from starting.
    raise RuntimeError("GOOGLE_API_KEY is not set. Please create a .env file and add your API key.") from None


# Pydantic model to define the expected structure of the request body
class RepoRequest(BaseModel):
    repo_url: str

# Initialize the FastAPI application
app = FastAPI(
    title="Gemini README Forge",
    description="An API to generate a README file for a GitHub repository using Google Gemini.",
    version="1.0.0",
)


# --- 2. Core Logic Functions ---

def clone_repo(repo_url: str) -> str:
    """
    Clones a public GitHub repository to a temporary directory using a shallow clone for speed.
    Raises an HTTPException if the cloning fails.
    """
    try:
        temp_dir = tempfile.mkdtemp()
        print(f"Cloning {repo_url} into {temp_dir}...")
        # Use depth=1 for a shallow clone, which is much faster and uses less space.
        git.Repo.clone_from(repo_url, temp_dir, depth=1)
        print("Cloning successful.")
        return temp_dir
    except git.exc.GitCommandError as e:
        # This error is common for private repos or invalid URLs
        print(f"GitCommandError: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to clone repository. Is the URL correct and the repository public? Error: {e.stderr}",
        )
    except Exception as e:
        # Catch any other unexpected errors during cloning
        print(f"An unexpected error occurred during cloning: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during cloning: {e}")


def cleanup_repo(path: str):
    """Safely deletes the temporary directory and its contents."""
    if path and os.path.exists(path):
        try:
            shutil.rmtree(path)
            print(f"Cleaned up temporary directory: {path}")
        except Exception as e:
            # This is not a critical error for the user, but we should log it
            print(f"Error cleaning up directory {path}: {e}")


def analyze_codebase(repo_path: str) -> dict:
    """
    Performs a deep analysis of the codebase by parsing Python files with AST
    to extract functions, classes, and docstrings for a richer context.
    """
    print("Starting deep code analysis...")
    context = {
        "file_structure": "",
        "key_files": {},
        "dependencies": "No dependency file found.",
        "python_code_summary": {} # New section for detailed analysis
    }
    
    ignore_list = ['.git', '__pycache__', 'node_modules', '.venv', 'venv', 'target']
    
    file_structure_list = []
    for root, dirs, files in os.walk(repo_path, topdown=True):
        dirs[:] = [d for d in dirs if d not in ignore_list]
        
        level = root.replace(repo_path, '').count(os.sep)
        indent = ' ' * 4 * level
        file_structure_list.append(f"{indent}{os.path.basename(root)}/")
        
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            file_structure_list.append(f"{sub_indent}{f}")
            file_path = os.path.join(root, f)
            
            # --- AST Analysis for Python Files ---
            if f.endswith('.py'):
                try:
                    with open(file_path, 'r', encoding='utf-8') as py_file:
                        source_code = py_file.read()
                        tree = ast.parse(source_code)
                        
                        summary = {
                            "imports": [node.names[0].name for node in ast.walk(tree) if isinstance(node, ast.Import)],
                            "functions": [],
                            "classes": []
                        }
                        
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

            # --- Existing Logic for Other Key Files ---
            elif f in ['requirements.txt', 'package.json']:
                try:
                    with open(file_path, 'r', encoding='utf-8') as file_content:
                        context["dependencies"] = file_content.read()
                except Exception: pass

    context["file_structure"] = "\n".join(file_structure_list)
    print("Deep code analysis finished.")
    return context


def create_prompt(analysis_context: dict) -> str:
    """Creates a highly detailed, structured prompt for the Gemini model."""
    # Convert the Python summary to a readable string format for the prompt
    python_summary_str = ""
    for filename, summary in analysis_context['python_code_summary'].items():
        python_summary_str += f"\nFile: `{filename}`:\n"
        if summary['imports']:
            python_summary_str += "  - Imports: " + ", ".join(summary['imports']) + "\n"
        if summary['classes']:
            python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
        if summary['functions']:
            python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"

    return f"""
    You are a 10x developer and an expert technical writer. Your task is to create an exceptionally detailed and professional README.md for a software project based on the deep code analysis provided below. The README should be impressive, guiding a new developer from zero to understanding and running the project.

    **Deep Code Analysis Report:**

    **1. Project File & Directory Structure:**
    ```
    {analysis_context['file_structure']}
    ```

    **2. Dependencies (from files like requirements.txt or package.json):**
    ```
    {analysis_context['dependencies']}
    ```

    **3. Python Code Semantic Summary (from AST analysis):**
    This section outlines the key components found in the Python code, including their purpose if docstrings were available.
    ```
    {python_summary_str if python_summary_str else "No Python files with classes or functions were found or parsed."}
    ```

    **README Generation Mandate:**

    Based on all the information above, generate a complete README.md file. You MUST infer the project's purpose, architecture, and core functionality. Be bold in your inferences.

    **Required Sections (be extremely detailed in each):**

    - **Project Title:** A creative and fitting name for the project.
    - **Badges:** Include at least 3 relevant placeholder badges (e.g., Build Status, Code Coverage, License).
    - **⭐ Overview:** This is the most important section. Write a comprehensive, multi-paragraph description.
        - Start with a high-level summary of what the project does.
        - Infer the problem it solves and its target audience.
        - Describe the project's architecture (e.g., "This is a Flask-based web service with a frontend..."). Use the file structure and dependencies to figure this out.
    - **✨ Key Features:** A detailed, bulleted list. Don't just list features; add a brief explanation for each one.
        - Example: "- **Feature A:** Enables users to do X, which solves the problem of Y."
        - Infer at least 3-5 key features from the code summary.
    - **🛠️ Tech Stack & Architecture:**
        - Create a bulleted list of the primary technologies, languages, and major libraries used.
        - Briefly explain *why* each technology might have been chosen (e.g., "FastAPI was chosen for its high performance...").
    - **🚀 Getting Started:**
        - **Prerequisites:** A list of software the user absolutely needs (e.g., Python 3.9+, Node.js, Docker).
        - **Installation:** A numbered, step-by-step guide. Be explicit with commands.
            1. `git clone ...`
            2. `cd ...`
            3. `pip install -r requirements.txt` (or equivalent)
    - **🔧 Usage:**
        - Provide clear instructions on how to run the application (e.g., `uvicorn main:app --reload`).
        - If possible, give an example of how to interact with it (e.g., "Navigate to http://127.0.0.1:8000").
    - **🤝 How to Contribute:** A welcoming section encouraging contributions and outlining the basic process (fork, branch, pull request).
    - **📝 License:** State the license (e.g., "Distributed under the MIT License.").

    **Final Instruction:** The output must be ONLY the raw Markdown content. Do not add any commentary before or after the Markdown. Be impressive.
    """


def generate_readme_with_gemini(prompt: str) -> str:
    """
    Sends the prompt to Gemini Pro and returns the generated README.
    Handles potential API errors and content safety blocks gracefully.
    """
    try:
        model = genai.GenerativeModel('models/gemini-2.5-pro')
        response = model.generate_content(prompt)
        
        # Check if the model blocked the response or returned nothing
        if not response.parts:
            reason = "Unknown"
            try:
                # Access the safety feedback to give a more specific error
                reason = response.prompt_feedback.block_reason.name
            except AttributeError:
                pass # No block_reason available
            error_message = f"Content generation failed. The model returned an empty response. Reason: {reason}. This often happens due to safety filters."
            print(f"Gemini Error: {error_message}")
            raise HTTPException(status_code=400, detail=error_message)

        return response.text
        
    except Exception as e:
        # Catch exceptions raised from this function or any other API-related errors
        print(f"An error occurred while communicating with the Gemini API: {e}")
        # Re-raise as an HTTPException to be sent to the client
        if isinstance(e, HTTPException):
             raise e
        raise HTTPException(status_code=500, detail=f"An error occurred with the AI model: {e}")


# --- 3. API Endpoints ---

@app.post("/api/generate")
def generate(request: RepoRequest):
    """
    The main API endpoint. It takes a repository URL, orchestrates the cloning,
    analysis, and generation process, and returns the README.
    """
    repo_path = None
    try:
        # Step 1: Clone the repository
        repo_path = clone_repo(request.repo_url)
        
        # Step 2: Analyze the codebase
        analysis = analyze_codebase(repo_path)
        
        # Step 3: Create the prompt for the AI
        prompt = create_prompt(analysis)
        
        # Step 4: Generate the README using Gemini
        readme_content = generate_readme_with_gemini(prompt)
        
        # Step 5: Return the successful response
        return {"readme": readme_content}
        
    except Exception as e:
        # This is a master catch-all for any unhandled errors in the process.
        # It ensures the server doesn't crash and returns a structured error.
        print("--- AN UNHANDLED EXCEPTION OCCURRED IN /api/generate ---")
        traceback.print_exc()
        print("-----------------------------------------------------")
        
        # If the exception is already an HTTPException, re-raise it.
        # Otherwise, create a generic 500 error.
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=500, detail=f"An internal server error occurred: {e}")
            
    finally:
        # This block ALWAYS runs, whether the try block succeeded or failed.
        # It's crucial for cleaning up resources.
        if repo_path:
            cleanup_repo(repo_path)


# --- 4. Frontend Serving ---

# Mount the 'static' directory to serve files like index.html, css, js
@app.get("/")
async def read_root():
    return FileResponse('static/index.html')
# This line stays the same. It makes all files in the "static" directory available.
app.mount("/static", StaticFiles(directory="static"), name="static")

# To run this app:
# 1. Make sure you have a .env file with your GOOGLE_API_KEY.
# 2. In your terminal, run: uvicorn main:app --reload