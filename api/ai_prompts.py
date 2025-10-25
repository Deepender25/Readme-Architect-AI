"""
Unified AI prompt system for README generation
Contains the master prompt template used across all generation endpoints
"""

def get_readme_generation_prompt(analysis_context: dict, project_name: str = None, include_demo: bool = False, num_screenshots: int = 0, num_videos: int = 0) -> str:
    """
    Generate the comprehensive AI prompt for README generation with enhanced analysis
    
    Args:
        analysis_context: Dictionary containing file structure, dependencies, and enhanced code analysis
        project_name: Optional project name to use in the README
        include_demo: Whether to include demo section
        num_screenshots: Number of screenshot placeholders to include
        num_videos: Number of video demo placeholders to include
    
    Returns:
        Complete prompt string for AI generation with 100% accurate project insights
    """
    
    # Prepare Python code summary (legacy compatibility)
    python_summary_str = ""
    for filename, summary in analysis_context.get('python_code_summary', {}).items():
        python_summary_str += f"\nFile: `{filename}`:\n"
        if summary['classes']: 
            python_summary_str += "  - Classes: " + ", ".join(summary['classes']) + "\n"
        if summary['functions']: 
            python_summary_str += "  - Functions: " + ", ".join(summary['functions']) + "\n"
    
    # Extract enhanced analysis if available
    enhanced_analysis = analysis_context.get('enhanced_analysis', {})
    
    # Prepare enhanced analysis sections
    project_overview = enhanced_analysis.get('project_overview', {})
    technical_stack = enhanced_analysis.get('technical_stack', {})
    functionality = enhanced_analysis.get('functionality', {})
    project_structure = enhanced_analysis.get('project_structure', {})
    environment = enhanced_analysis.get('environment', {})
    metrics = enhanced_analysis.get('metrics', {})
    
    # Create detailed analysis summary for AI
    enhanced_summary = f"""
**ENHANCED PROJECT ANALYSIS (100% ACCURATE):**

🎯 **Project Type & Complexity:**
- Type: {project_overview.get('type', 'Unknown')}
- Complexity: {project_overview.get('complexity', 'Unknown')}
- Primary Languages: {', '.join(project_overview.get('primary_languages', []))}
- Architecture Patterns: {', '.join(project_overview.get('architecture_patterns', []))}

🎯 **PROJECT PURPOSE DETECTION:**
Based on file names and structure, this appears to be a README generation tool that:
- Analyzes GitHub repositories (evident from repository-related files)
- Generates documentation using AI (evident from AI/generation related files)
- Provides user authentication and history (evident from auth and history files)
- Offers a web interface for users (evident from React/Next.js structure)

**FOCUS YOUR README ON THIS CORE PURPOSE**: This is a tool that helps users automatically generate professional README files for their GitHub repositories.

🛠️ **Technical Stack (VERIFIED):**
- Frontend: {', '.join(technical_stack.get('frontend', [])) or 'None detected'}
- Backend: {', '.join(technical_stack.get('backend', [])) or 'None detected'}
- Databases: {', '.join(technical_stack.get('databases', [])) or 'None detected'}
- Testing: {', '.join(technical_stack.get('testing', [])) or 'None detected'}
- Build Tools: {', '.join(technical_stack.get('build_tools', [])) or 'None detected'}
- Deployment: {', '.join(technical_stack.get('deployment', [])) or 'None detected'}

⚡ **ACTUAL FUNCTIONALITY (EXTRACTED FROM CODE):**
{chr(10).join(f"- {feature}" for feature in functionality.get('actual_features', [])) or '- No specific functionality detected'}

🔌 **API ENDPOINTS (REAL):**
{chr(10).join(f"- {endpoint.get('methods', ['GET'])[0]} {endpoint.get('path', '')} ({endpoint.get('framework', 'unknown')})" for endpoint in functionality.get('api_endpoints', [])) or '- No API endpoints detected'}

📊 **DATA MODELS (ACTUAL):**
{chr(10).join(f"- {model}" for model in functionality.get('data_models', [])) or '- No data models detected'}

🎨 **UI COMPONENTS (REAL):**
{chr(10).join(f"- {comp}" for comp in functionality.get('ui_components', [])) or '- No UI components detected'}

🌐 **EXTERNAL INTEGRATIONS (VERIFIED):**
{chr(10).join(f"- {service.title()}" for service in functionality.get('external_integrations', [])) or '- No external integrations detected'}

🔧 **PROJECT STRUCTURE (VERIFIED):**
- Entry Points: {', '.join(project_structure.get('entry_points', [])) or 'None detected'}
- Config Files: {', '.join(project_structure.get('config_files', [])) or 'None detected'}
- Available Scripts: {', '.join(project_structure.get('scripts', [])) or 'None detected'}

🌍 **ENVIRONMENT & SETUP (REAL REQUIREMENTS):**
- Package Managers: {', '.join(environment.get('package_managers', [])) or 'None detected'}
- Required Environment Variables: {', '.join(environment.get('required_variables', [])) or 'None detected'}

📈 **CODE METRICS:**
- Total Files: {metrics.get('total_files', 0)}
- Total Lines: {metrics.get('total_lines', 0)}
- Languages: {', '.join(metrics.get('languages', [])) or 'Unknown'}
"""

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

    # Master prompt template with enhanced analysis
    prompt = f"""
**Your Role:** You are a Principal Solutions Architect and a world-class technical copywriter with expertise in creating stunning, comprehensive, and professional README.md files for open-source projects. Your documentation must be impeccable, visually appealing, and thoroughly detailed.

**CRITICAL INSTRUCTION: USE ONLY VERIFIED INFORMATION**
You have been provided with ENHANCED ANALYSIS that contains 100% accurate, verified information extracted directly from the codebase. DO NOT make assumptions or add features that are not explicitly mentioned in the analysis. Every single detail in your README must be factually correct based on the provided analysis.

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

{enhanced_summary}

**Core Mandate:**
Based *exclusively* on the VERIFIED ANALYSIS above, generate a complete, professional README.md that focuses on USER VALUE and REAL-WORLD BENEFITS. You MUST use ONLY the factual information provided in the enhanced analysis. DO NOT invent features, technologies, or capabilities that are not explicitly mentioned.

**CRITICAL FOCUS REQUIREMENTS:**
- **USER-CENTRIC APPROACH**: Focus on what users can accomplish, not how it's built
- **REAL-WORLD PROBLEMS**: Describe actual user pain points, not technical challenges
- **BUSINESS VALUE**: Emphasize outcomes and benefits, not implementation details
- **USER EXPERIENCE**: Highlight what makes this tool useful and valuable

**ACCURACY REQUIREMENTS:**
- Use ONLY technologies listed in the verified technical stack
- Mention ONLY the actual functionality extracted from code
- Include ONLY the real API endpoints that were detected
- Reference ONLY the actual environment variables found
- Describe ONLY the verified external integrations
- Use ONLY the real project structure and entry points

**TONE & APPROACH:**
- Write from the USER'S PERSPECTIVE, not the developer's
- Focus on BENEFITS and OUTCOMES, not features and technologies
- Describe WHAT the project does, not HOW it does it
- Emphasize VALUE PROPOSITION and USER EXPERIENCE

The tone must be professional, engaging, and polished. Use rich Markdown formatting, including emojis, tables, and blockquotes, to create a visually stunning and informative document that is significantly detailed (aim for 1500+ words minimum) while maintaining 100% factual accuracy.

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
    -   **Hook:** Start with a compelling, single-sentence summary that describes what the project DOES FOR USERS, not how it's built.
        **EXAMPLE**: "AutoDoc AI is an intelligent documentation generator that transforms any GitHub repository into a professional, comprehensive README.md file in seconds."
        **NOT**: "AutoDoc AI is a React-based web application with Python backend services."
    
    -   **The Problem:** In a blockquote, describe the REAL-WORLD USER PROBLEM this project solves:
        **EXAMPLE**: 
        > Creating comprehensive, professional documentation for software projects is time-consuming and often inconsistent. Developers spend hours writing README files, frequently leaving out important details or struggling to present their work professionally. Many projects suffer from poor documentation, making them less accessible to contributors and users.
        
        **NOT**: "The challenge of integrating diverse server-side utilities into a cohesive client-side interface..."
    
    -   **The Solution:** Describe the VALUE this project provides to users:
        **EXAMPLE**: "AutoDoc AI eliminates the documentation burden by automatically analyzing your codebase and generating professional README files. Simply provide a GitHub repository URL, and get a complete, well-structured README with installation instructions, usage examples, and feature descriptions."
        
        **NOT**: "This system provides a highly polished interface built on Component-based Architecture..."
    
    -   **Architecture Overview:** Briefly mention the high-level approach using verified technologies: {', '.join(project_overview.get('architecture_patterns', []))} with {', '.join(project_overview.get('main_frameworks', []))}.

5.  **✨ Key Features:**
    -   **FOCUS ON USER BENEFITS**: Describe what users can DO with each feature, not the technical implementation.
    -   **USER VALUE FIRST**: Each feature should answer "What does this do for the user?"
    -   Use emojis to make each feature visually distinct.
    -   **Transform technical capabilities into user benefits:**
        
        **VERIFIED FUNCTIONALITY to translate into user benefits:**
        {chr(10).join(f"        - {feature}" for feature in functionality.get('actual_features', [])) or '        - No specific features detected - infer user benefits from verified tech stack'}
        
        **VERIFIED INTEGRATIONS to describe as user capabilities:**
        {chr(10).join(f"        - {service.title()} integration" for service in functionality.get('external_integrations', [])) or '        - No external integrations detected'}
        
        **REAL API CAPABILITIES to present as user actions:**
        {chr(10).join(f"        - {endpoint.get('methods', ['GET'])[0]} {endpoint.get('path', '')} endpoint" for endpoint in functionality.get('api_endpoints', [])) or '        - No API endpoints detected'}
    
    -   **EXAMPLE FORMAT (focus on user value):**
        - 🚀 **Fast Processing:** Get results in seconds, not hours
        - 🔒 **Secure Access:** Your data stays private and protected
        - 📱 **Easy to Use:** Simple interface that anyone can master

6.  **🛠️ Tech Stack & Architecture:**
    -   **CRITICAL:** Use ONLY the verified technologies from the enhanced analysis.
    -   **VERIFIED FRONTEND:** {', '.join(technical_stack.get('frontend', [])) or 'None detected'}
    -   **VERIFIED BACKEND:** {', '.join(technical_stack.get('backend', [])) or 'None detected'}
    -   **VERIFIED DATABASES:** {', '.join(technical_stack.get('databases', [])) or 'None detected'}
    -   **VERIFIED BUILD TOOLS:** {', '.join(technical_stack.get('build_tools', [])) or 'None detected'}
    -   **VERIFIED DEPLOYMENT:** {', '.join(technical_stack.get('deployment', [])) or 'None detected'}
    -   Create a table using ONLY these verified technologies.
    -   Include columns for "Technology", "Purpose", and "Why it was Chosen".
    -   DO NOT add technologies not listed in the verified analysis above.

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
    -   **ONLY include if environment variables were detected:** {len(environment.get('required_variables', [])) > 0}
    -   **VERIFIED ENVIRONMENT VARIABLES FOUND:**
        {chr(10).join(f"        - {var}" for var in environment.get('required_variables', [])) or '        - No environment variables detected'}
    -   **VERIFIED EXTERNAL SERVICES requiring API keys:**
        {chr(10).join(f"        - {service.title()}" for service in functionality.get('external_integrations', [])) or '        - No external services detected'}
    -   Create a table using ONLY the verified environment variables above.
    -   DO NOT add environment variables that were not detected in the analysis.
    -   If no environment variables were detected, skip this section entirely.

9.  **🔑 API Keys Setup:**
    -   **ONLY include if external services were detected:** {len(functionality.get('external_integrations', [])) > 0}
    -   **VERIFIED EXTERNAL SERVICES requiring API keys:**
        {chr(10).join(f"        - {service.title()}" for service in functionality.get('external_integrations', [])) or '        - No external services detected requiring API keys'}
    -   **If external services were detected, provide setup instructions for ONLY these verified services:**
        - Create detailed setup instructions for each verified service above
        - DO NOT include services that were not detected in the analysis
        - Use the actual service names from the verified list
    -   **If no external services were detected, skip this section entirely.**

{demo_section}

10. **🚀 Getting Started:**
    -   **Prerequisites based on VERIFIED technologies:**
        - Use ONLY the verified primary languages: {', '.join(project_overview.get('primary_languages', []))}
        - Use ONLY the verified package managers: {', '.join(environment.get('package_managers', []))}
        - Use ONLY the verified databases if any: {', '.join(technical_stack.get('databases', []))}
    
    -   **Installation using VERIFIED package managers and scripts:**
        - **VERIFIED ENTRY POINTS:** {', '.join(project_structure.get('entry_points', [])) or 'None detected'}
        - **VERIFIED SCRIPTS:** {', '.join(project_structure.get('scripts', [])) or 'None detected'}
        - **VERIFIED CONFIG FILES:** {', '.join(project_structure.get('config_files', [])) or 'None detected'}
        
        Create installation steps using ONLY:
        - The verified package managers above
        - The verified scripts above  
        - The verified config files above
        - DO NOT include steps for technologies not in the verified analysis

11. **🔧 Usage:**
    -   **VERIFIED PROJECT TYPE:** {project_overview.get('type', 'Unknown')}
    -   **REAL API ENDPOINTS (if any):**
        {chr(10).join(f"        - {endpoint.get('methods', ['GET'])[0]} {endpoint.get('path', '')} ({endpoint.get('framework', 'unknown')})" for endpoint in functionality.get('api_endpoints', [])) or '        - No API endpoints detected'}
    -   **VERIFIED ENTRY POINTS:** {', '.join(project_structure.get('entry_points', [])) or 'None detected'}
    -   **VERIFIED SCRIPTS:** {', '.join(project_structure.get('scripts', [])) or 'None detected'}
    
    Provide usage instructions based on:
    - The verified project type above
    - The real API endpoints above (if any)
    - The verified entry points above
    - The verified scripts above
    - DO NOT create fake endpoints or usage examples not supported by the analysis

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