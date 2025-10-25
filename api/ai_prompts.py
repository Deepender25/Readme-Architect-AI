"""
Unified AI prompt system for README generation
Contains the master prompt template used across all generation endpoints
"""

def get_readme_generation_prompt(analysis_context: dict, project_name: str = None, include_demo: bool = False, num_screenshots: int = 0, num_videos: int = 0) -> str:
    """
    Generate the comprehensive AI prompt for README generation
    
    Args:
        analysis_context: Dictionary containing file structure, dependencies, and code analysis
        project_name: Optional project name to use in the README
        include_demo: Whether to include demo section
        num_screenshots: Number of screenshot placeholders to include
        num_videos: Number of video demo placeholders to include
    
    Returns:
        Complete prompt string for AI generation
    """
    
    # Prepare Python code summary
    python_summary_str = ""
    for filename, summary in analysis_context.get('python_code_summary', {}).items():
        python_summary_str += f"\nFile: `{filename}`:\n"
        if summary['classes']: 
            python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
        if summary['functions']: 
            python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"

    # Enhanced demo section - only if demo is enabled AND has content
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

    # Master prompt template from generate.py
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
    curl -X POST http://localhost:8000/api/resource \\
      -H "Content-Type: application/json" \\
      -d '{{"name": "example", "value": 123}}'
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

    return prompt