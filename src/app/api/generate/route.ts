import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Try the direct Python API endpoint first
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const pythonApiUrl = `${baseUrl}/api/python/generate?${searchParams.toString()}`;
    
    try {
      const response = await fetch(pythonApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('Cookie') || '',
          'User-Agent': 'NextJS-Internal-Request',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      } else {
        console.log('Python API failed, falling back to local generation');
      }
    } catch (error) {
      console.log('Python API error, falling back to local generation:', error);
    }
    
    // Fallback: Use local generation logic
    const repoUrl = searchParams.get('repo_url');
    const projectName = searchParams.get('project_name') || '';
    const includeDemo = searchParams.get('include_demo') === 'true';
    const numScreenshots = parseInt(searchParams.get('num_screenshots') || '0');
    const numVideos = parseInt(searchParams.get('num_videos') || '0');
    
    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }
    
    // Simple fallback README generation
    const fallbackReadme = generateFallbackReadme(repoUrl, projectName, includeDemo, numScreenshots, numVideos);
    
    return NextResponse.json({ readme: fallbackReadme });
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate README' },
      { status: 500 }
    );
  }
}

function generateFallbackReadme(repoUrl: string, projectName: string, includeDemo: boolean, numScreenshots: number, numVideos: number): string {
  const repoName = projectName || repoUrl.split('/').pop()?.replace('.git', '') || 'Project';
  
  let readme = `<h1 align="center">${repoName}</h1>
<p align="center">A modern, feature-rich application built with cutting-edge technologies</p>

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

## 📋 Table of Contents

- [⭐ Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)`;

  if (includeDemo && (numScreenshots > 0 || numVideos > 0)) {
    readme += `
- [📸 Demo & Screenshots](#-demo--screenshots)`;
  }

  readme += `
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## ⭐ Overview

${repoName} is a powerful application designed to solve modern development challenges with an elegant and efficient approach.

> **The Problem:** Developers need robust, scalable solutions that can adapt to changing requirements while maintaining high performance and user experience.

**The Solution:** This project provides a comprehensive framework that combines modern technologies with best practices to deliver exceptional results.

## ✨ Key Features

- **🚀 High Performance:** Optimized for speed and efficiency
- **🔧 Modular Architecture:** Clean, maintainable codebase
- **📱 Responsive Design:** Works seamlessly across all devices
- **🔒 Secure by Default:** Built with security best practices
- **🌐 API Integration:** RESTful API with comprehensive documentation

## 🛠️ Tech Stack

| Technology | Purpose | Why it was Chosen |
|------------|---------|-------------------|
| TypeScript | Type Safety | Provides compile-time error checking and better developer experience |
| React | UI Framework | Component-based architecture for maintainable user interfaces |
| Node.js | Runtime | JavaScript runtime for server-side development |
| Next.js | Full-stack Framework | Server-side rendering and API routes in one framework |`;

  if (includeDemo && (numScreenshots > 0 || numVideos > 0)) {
    readme += `

## 📸 Demo & Screenshots`;

    if (numScreenshots > 0) {
      readme += `

### 🖼️ Screenshots

`;
      for (let i = 1; i <= numScreenshots; i++) {
        readme += `<img src="https://placehold.co/800x450/2d2d4d/ffffff?text=App+Screenshot+${i}" alt="App Screenshot ${i}" width="100%">
<p align="center"><em>Caption for screenshot ${i}.</em></p>

`;
      }
    }

    if (numVideos > 0) {
      readme += `### 🎬 Video Demos

`;
      for (let i = 1; i <= numVideos; i++) {
        readme += `<a href="https://example.com/your-video-link-${i}" target="_blank">
  <img src="https://placehold.co/800x450/2d2d4d/c5a8ff?text=Watch+Video+Demo+${i}" alt="Video Demo ${i}" width="100%">
</a>
<p align="center"><em>Caption for video demo ${i}.</em></p>

`;
      }
    }
  }

  readme += `

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn package manager
- Git for version control

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone ${repoUrl}
   cd ${repoName.toLowerCase()}
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

## 🔧 Usage

Once the development server is running, open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### API Usage

\`\`\`bash
curl -X GET "http://localhost:3000/api/example" \\
  -H "Content-Type: application/json"
\`\`\`

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See \`LICENSE\` for more information.

---

<p align="center">Made with ❤️ by the development team</p>`;

  return readme;
}

export async function POST(request: NextRequest) {
  return GET(request);
}