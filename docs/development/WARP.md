# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**AutoDoc AI** is a modern full-stack README generator that combines Next.js frontend with Python serverless functions to automatically create professional README files from GitHub repositories using AI analysis.

### Architecture
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Framer Motion
- **Backend**: Python serverless functions (Vercel) with Google Gemini AI integration
- **Authentication**: GitHub OAuth with persistent sessions
- **Database**: GitHub repository-based storage for user history
- **Deployment**: Vercel with hybrid Next.js + Python serverless architecture

## Common Development Commands

### Development
```bash
# Start development server
npm run dev

# Run development with detailed logging
npm run dev -- --turbo

# Start local Python development server
python local_dev_server.py
```

### Building & Testing
```bash
# Build for production
npm run build

# Start production server locally
npm run start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Deployment
```bash
# Deploy to Vercel (production)
npm run deploy

# Deploy preview
npm run deploy:preview

# Or use scripts
./deploy.sh        # Unix
deploy.bat         # Windows
```

### Testing API Endpoints
```bash
# Test Python serverless functions locally
curl http://localhost:3000/api/python/generate?health=1

# Test Next.js API routes
curl http://localhost:3000/api/generate?health=1
```

## Key Architecture Patterns

### Hybrid Frontend/Backend Structure
The project uses a unique dual-interface approach:
- **Modern Interface**: Next.js app in `src/` with React components
- **Legacy Interface**: Static HTML/JS files in `static/` (maintained for compatibility)
- **Python Backend**: Serverless functions in `api/` for AI processing

### Authentication Flow
```mermaid
graph TD
    A[User clicks GitHub login] --> B[/auth/github redirect]
    B --> C[GitHub OAuth authorization]
    C --> D[/auth/callback with code]
    D --> E[Exchange code for token]
    E --> F[Get user data from GitHub]
    F --> G[Set encrypted cookie]
    G --> H[Redirect to dashboard]
```

### AI Generation Pipeline
1. **Repository Analysis**: Downloads repo, parses file structure, analyzes Python AST
2. **Context Preparation**: Extracts dependencies, code summaries, project structure
3. **AI Generation**: Uses Google Gemini with enhanced prompts for README creation
4. **History Storage**: Saves generated content to GitHub-based database

### Component Architecture
- **Background System**: Multiple animated background components with performance optimization
- **Editor Components**: Split-pane editor with syntax highlighting and live preview  
- **Authentication Context**: React context for user state management across the app
- **History System**: GitHub repository-based persistence for user generations

## Environment Configuration

### Required Environment Variables
```bash
# AI Integration
GOOGLE_API_KEY=your_google_gemini_api_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_oauth_app_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
GITHUB_REDIRECT_URI=https://readmearchitect.vercel.app/api/auth/callback

# Database (GitHub-based)
GITHUB_DATA_REPO_OWNER=username
GITHUB_DATA_REPO_NAME=data-storage-repo
GITHUB_DATA_TOKEN=github_personal_access_token

# Email (optional, for contact form)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Development Setup
1. Copy `.env.example` to `.env.local`
2. Configure GitHub OAuth app at https://github.com/settings/developers
3. Set redirect URI to `http://localhost:3000/api/auth/callback` for development
4. Create a private GitHub repository for data storage
5. Generate GitHub personal access token with repo permissions

## Key Files and Their Purposes

### Core Application Files
- **`src/app/layout.tsx`**: Root layout with background system and page transitions
- **`src/app/page.tsx`**: Home page with main README generation interface
- **`api/index.py`**: Main API handler (auth, repositories, history, contact)
- **`api/generate.py`**: README generation with repository analysis
- **`api/stream.py`**: Streaming generation for real-time updates
- **`api/database.py`**: GitHub-based database operations

### Authentication & Data Flow
- **`src/lib/auth.tsx`**: Authentication context and user session management
- **`src/components/withAuth.tsx`**: HOC for protecting authenticated routes
- **`src/components/seamless-account-switcher.tsx`**: GitHub account switching interface

### UI Components
- **Background System**: `enhanced-grid-background.tsx`, `professional-background.tsx`, etc.
- **Editor Components**: `github-readme-editor.tsx`, `modern-readme-editor.tsx`
- **List Components**: `repositories-list.tsx`, `history-list.tsx`

### Configuration Files
- **`next.config.js`**: Next.js configuration with TypeScript/ESLint overrides
- **`vercel.json`**: Deployment configuration for hybrid Next.js + Python setup
- **`tailwind.config.js`**: Extended Tailwind configuration with custom animations
- **`.github/workflows/vercel-deploy.yml`**: GitHub Actions deployment workflow

## Development Workflow

### Adding New Features
1. **Frontend changes**: Work in `src/` directory using Next.js patterns
2. **API changes**: Add/modify Python functions in `api/` directory  
3. **UI components**: Follow established pattern with Framer Motion animations
4. **Styling**: Use Tailwind with custom CSS variables defined in globals.css

### Working with the AI System
- **Prompt engineering**: Modify prompts in `generate_readme_with_gemini()` functions
- **Analysis system**: Enhance repository analysis in `analyze_codebase()` functions
- **Streaming**: Use `api/stream.py` for real-time generation updates

### Database Operations
The project uses GitHub repositories as databases:
- User history stored as JSON files in `users/{user_id}/history.json`
- Operations handled through GitHub API in `api/database.py`
- Automatic file management with SHA-based version control

### Performance Considerations
- **Background animations**: Optimized with `will-change` and `transform3d`
- **Streaming generation**: Real-time updates without blocking UI
- **Component lazy loading**: Suspense boundaries for better loading experience
- **Image optimization**: Next.js Image component with remote patterns

## Deployment Architecture

### Vercel Configuration
- **Next.js build**: Handles frontend and Next.js API routes
- **Python serverless**: Handles AI processing and GitHub operations
- **Route mapping**: Complex routing in `vercel.json` for hybrid architecture
- **CORS handling**: Configured for cross-origin requests

### Production Considerations
- **Environment variables**: Set in Vercel dashboard
- **GitHub OAuth**: Update redirect URIs for production domain
- **Error monitoring**: Comprehensive logging throughout Python functions
- **Rate limiting**: Managed through Vercel's built-in limits

## Key Claude Configuration

The project includes Claude-specific configuration in `.claude/`:
- **System prompts**: Spec workflow for feature development
- **Settings**: KFC (Keep Files Clean) configuration for code organization

## Troubleshooting Common Issues

### Authentication Problems
- Check GitHub OAuth app configuration and redirect URIs
- Verify environment variables are set correctly
- Clear cookies if switching between development/production

### AI Generation Failures
- Verify Google API key is valid and has credits
- Check repository accessibility (public repos work best)
- Review error logs in Vercel dashboard for detailed messages

### Build Issues
- TypeScript errors are ignored in production (`ignoreBuildErrors: true`)
- ESLint errors are ignored during builds (`ignoreDuringBuilds: true`)
- Ensure all dependencies are properly installed

### Performance Issues
- Background animations can be disabled by modifying CSS variables
- Streaming can be disabled by using direct generation API
- Consider reducing history storage limit in database operations

## Architecture Decision Records

### Why Python + Next.js Hybrid?
- **AI Processing**: Python excels at repository analysis and AI integration
- **Modern UI**: Next.js provides superior developer experience and performance
- **Serverless**: Vercel's platform optimally supports both technologies

### Why GitHub-based Database?
- **Simplicity**: No external database dependencies
- **Version Control**: Built-in history and backup
- **Free Tier**: GitHub provides generous free storage and API limits
- **Security**: Repository-based access control

### Why Multiple Background Components?
- **Customization**: Different visual styles for different contexts  
- **Performance**: Optimized animations with minimal performance impact
- **User Experience**: Consistent visual theming across the application
