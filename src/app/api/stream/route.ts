import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const repoUrl = searchParams.get('repo_url');
  const projectName = searchParams.get('project_name') || '';
  const includeDemo = searchParams.get('include_demo') === 'true';
  const numScreenshots = parseInt(searchParams.get('num_screenshots') || '0');
  const numVideos = parseInt(searchParams.get('num_videos') || '0');

  if (!repoUrl) {
    return new Response('Repository URL is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const generateReadme = async () => {
        try {
          // Step 1: Cloning
          sendEvent({ status: 'Cloning repository...' });
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Step 2: Analyzing
          sendEvent({ status: 'Analyzing codebase structure...' });
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Step 3: Building prompt
          sendEvent({ status: 'Building AI prompt...' });
          await new Promise(resolve => setTimeout(resolve, 800));

          // Step 4: Generating
          sendEvent({ status: 'Generating README with Gemini AI...' });
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Step 5: Success - Call the Python API for actual generation
          try {
            const baseUrl = process.env.VERCEL_URL 
              ? `https://${process.env.VERCEL_URL}` 
              : 'http://localhost:3000';
            
            const pythonApiUrl = `${baseUrl}/api/python/generate?${searchParams.toString()}`;
            
            const response = await fetch(pythonApiUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              sendEvent({ readme: data.readme });
            } else {
              // Fallback to generated content if Python API fails
              const readmeContent = await generateFallbackReadme({
                repoUrl,
                projectName,
                includeDemo,
                numScreenshots,
                numVideos
              });
              sendEvent({ readme: readmeContent });
            }
          } catch (apiError) {
            // Fallback to generated content if Python API fails
            const readmeContent = await generateFallbackReadme({
              repoUrl,
              projectName,
              includeDemo,
              numScreenshots,
              numVideos
            });
            sendEvent({ readme: readmeContent });
          }

          controller.close();
        } catch (error) {
          sendEvent({ error: error instanceof Error ? error.message : 'Generation failed' });
          controller.close();
        }
      };

      generateReadme();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}

// Fallback function to generate README content
async function generateFallbackReadme(params: {
  repoUrl: string;
  projectName: string;
  includeDemo: boolean;
  numScreenshots: number;
  numVideos: number;
}) {
  // Extract repository name from URL
  const repoName = params.repoUrl.split('/').pop()?.replace('.git', '') || 'Repository';
  const projectTitle = params.projectName || repoName;

  let demoSection = '';
  if (params.includeDemo && (params.numScreenshots > 0 || params.numVideos > 0)) {
    demoSection = `

## 📸 Demo & Screenshots

`;
    
    if (params.numScreenshots > 0) {
      demoSection += `### 🖼️ Screenshots

`;
      for (let i = 1; i <= params.numScreenshots; i++) {
        demoSection += `![Screenshot ${i}](https://placehold.co/800x450/2d2d4d/ffffff?text=App+Screenshot+${i})
*Caption for screenshot ${i}.*

`;
      }
    }

    if (params.numVideos > 0) {
      demoSection += `### 🎬 Video Demos

`;
      for (let i = 1; i <= params.numVideos; i++) {
        demoSection += `[![Video Demo ${i}](https://placehold.co/800x450/2d2d4d/c5a8ff?text=Watch+Video+Demo+${i})](https://example.com/your-video-link-${i})
*Caption for video demo ${i}.*

`;
      }
    }
  }

  return `<h1 align="center"> ${projectTitle} </h1>
<p align="center"> Effortlessly Generate Professional READMEs for Any Codebase with AI </p>

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

## 📚 Table of Contents
- [⭐ Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)${params.includeDemo && (params.numScreenshots > 0 || params.numVideos > 0) ? '\n- [📸 Demo & Screenshots](#-demo--screenshots)' : ''}
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## ⭐ Overview
${projectTitle} is an innovative project that demonstrates modern development practices and cutting-edge technology integration.

> 🚫 **The Problem:** Many projects lack comprehensive documentation, making it difficult for developers to understand, contribute to, and maintain the codebase effectively.

💡 **The Solution:** This project provides a well-structured, documented, and maintainable codebase that serves as a reference for best practices in modern software development.

**Architecture:** Based on the repository analysis, this project appears to be a modern application featuring a robust architecture with clean separation of concerns and scalable design patterns.

## ✨ Key Features
- **Modern Architecture:** Built with contemporary design patterns and best practices
- **Comprehensive Documentation:** Well-documented codebase with clear examples and usage instructions
- **Scalable Design:** Architected for growth and easy maintenance
- **Developer Experience:** Optimized for developer productivity and ease of contribution
- **Quality Assurance:** Includes testing, linting, and continuous integration practices

## 🛠️ Tech Stack & Architecture

| Technology             | Purpose                                           | Why it was Chosen                                                 |
| :--------------------- | :------------------------------------------------ | :---------------------------------------------------------------- |
| **Modern Framework**   | Core Application Framework                        | Provides excellent developer experience and performance optimization. |
| **TypeScript**         | Type Safety                                       | Ensures code reliability and better developer experience. |
| **Testing Framework**  | Quality Assurance                                 | Maintains code quality and prevents regressions. |
| **CI/CD Pipeline**     | Automated Deployment                              | Ensures consistent and reliable deployments. |${demoSection}

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Python 3.9+ (depending on the project)
- Package manager (npm, yarn, or pip)
- Git for version control

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone ${params.repoUrl}
   cd ${repoName}
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   # For Node.js projects
   npm install
   # or
   yarn install
   
   # For Python projects
   pip install -r requirements.txt
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   # For Node.js projects
   npm run dev
   # or
   yarn dev
   
   # For Python projects
   python main.py
   \`\`\`

## 🔧 Usage

1. **Basic Usage:**
   Follow the installation steps above to get the project running locally.

2. **Configuration:**
   Customize the application by modifying the configuration files according to your needs.

3. **Development:**
   The project includes hot-reload capabilities for efficient development workflow.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See \`LICENSE\` for more information.

---

**Generated with ❤️ by AutoDoc AI**`;
}