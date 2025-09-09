# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**AutoDoc AI** is a modern full-stack application that automatically generates professional README files from GitHub repositories using AI analysis. It combines a Next.js frontend with Python serverless functions for a hybrid architecture.

### Core Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Framer Motion animations
- **Backend**: Python serverless functions deployed on Vercel
- **AI Engine**: Google Gemini 2.5 Flash for README generation
- **Authentication**: GitHub OAuth with persistent cookie sessions
- **Database**: GitHub repository-based storage for user history
- **Deployment**: Vercel with hybrid Next.js + Python architecture

## Common Development Commands

### Development Server
```bash
# Start Next.js development server
npm run dev

# Start local Python development server (for API testing)
python scripts/local_dev_server.py

# Test API endpoints directly
python scripts/test_api_direct.py
```

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server locally
npm run start

# Deploy to production
npm run deploy

# Deploy preview version
npm run deploy:preview

# Platform-specific deployment
./scripts/deploy.sh        # Unix/Linux/macOS
./scripts/deploy.bat       # Windows
```

### Testing and Quality
```bash
# Lint code
npm run lint

# Type checking
npx tsc --noEmit

# Test single components
python scripts/test_fixes.py
python scripts/test_error_notifications.py
python scripts/test_url_handling.py
```

## High-Level Architecture

### Dual Interface System
The application maintains two interfaces:
1. **Modern Next.js Interface** (`src/app/`): Primary React-based UI with advanced features
2. **Legacy Static Interface** (`static/`): HTML/JS fallback maintained for compatibility

### Request Flow Architecture
```
User Request → Vercel Router (vercel.json) → Next.js App OR Python Functions
                                          ↓
Next.js App (src/):                      Python API (api/):
- Authentication UI                       - Repository analysis
- Repository selection                    - AI generation (Gemini)  
- README editing/preview                  - History management
- History management UI                   - GitHub OAuth handling
```

### Python Serverless Functions
- **`api/index.py`**: Main handler for auth, repositories, history, contact
- **`api/generate.py`**: Repository analysis and README generation
- **`api/stream.py`**: Real-time streaming generation with Server-Sent Events
- **`api/database.py`**: GitHub-based data persistence operations
- **`api/error_notifier.py`**: Email notifications for system failures

### AI Generation Pipeline
1. **Repository Download**: Fetches GitHub repo as ZIP via API
2. **Deep Analysis**: AST parsing for Python files, dependency extraction
3. **Context Building**: File structure analysis, code summaries
4. **AI Processing**: Google Gemini with sophisticated prompts
5. **History Storage**: Saves to GitHub repository database

### Authentication Flow
```
GitHub Login → OAuth Authorization → Token Exchange → User Data → Encrypted Cookie → Dashboard
```

## Environment Configuration

### Required Environment Variables
```bash
# Core AI Integration
GOOGLE_API_KEY=your_google_gemini_api_key

# GitHub OAuth (for repository access)
GITHUB_CLIENT_ID=your_github_oauth_app_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
GITHUB_REDIRECT_URI=https://your-domain.com/api/auth/callback

# History Database (GitHub-based storage)
GITHUB_DATA_REPO_OWNER=your_username
GITHUB_DATA_REPO_NAME=your_data_repo
GITHUB_DATA_TOKEN=your_personal_access_token

# Email Services (contact form + error notifications)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
ERROR_NOTIFICATION_EMAIL=errors@your-domain.com
```

### Development Setup Process
1. Copy `.env.example` to `.env.local`
2. Create GitHub OAuth app at https://github.com/settings/developers
3. Set development redirect URI: `http://localhost:3000/api/auth/callback`
4. Create private GitHub repository for user data storage
5. Generate personal access token with `repo` scope
6. Configure Gmail app password for email services

## Key Component Architecture

### Background Animation System
The app uses multiple optimized background components:
- **`enhanced-grid-background.tsx`**: Main animated grid system
- **`professional-background.tsx`**: Clean geometric patterns  
- **`floating-particles-background.tsx`**: Dynamic particle effects
- **Performance optimizations**: CSS transforms, will-change, GPU acceleration

### Editor Components
- **`modern-readme-editor.tsx`**: Split-pane editor with syntax highlighting
- **`github-readme-editor.tsx`**: GitHub-integrated editing interface
- **Real-time preview**: Live markdown rendering with DOMPurify sanitization

### Authentication Components  
- **`withAuth.tsx`**: HOC for route protection
- **`seamless-account-switcher.tsx`**: Multi-account GitHub switching
- **Session management**: Encrypted cookies with base64 encoding

## Database Architecture

### GitHub Repository Storage
- **User data**: Stored as JSON files in `users/{user_id}/history.json`
- **Version control**: SHA-based updates through GitHub API
- **Privacy**: Each user gets isolated data files
- **Operations**: Full CRUD through `api/database.py`

### Data Structure
```typescript
interface HistoryItem {
  id: string
  repository_name: string
  repository_url: string  
  readme_content: string
  project_name?: string
  generation_params: object
  created_at: string
}
```

## Deployment Configuration

### Vercel Setup (`vercel.json`)
The application uses complex routing to handle the hybrid architecture:
- **Next.js routes**: Handle frontend and Next.js API routes
- **Python routes**: Route API calls to appropriate Python serverless functions
- **CORS configuration**: Headers for cross-origin requests
- **Route mapping**: `/api/python/*` → Python functions, others → Next.js

### Production Considerations
- **TypeScript errors**: Ignored in builds (`ignoreBuildErrors: true`)
- **ESLint**: Disabled during builds for faster deployment
- **Image optimization**: Remote patterns configured for GitHub avatars
- **Error monitoring**: Comprehensive logging with email notifications

## Development Patterns

### Code Organization
- **Monorepo structure**: Frontend and backend in single repository
- **TypeScript throughout**: Full type safety in Next.js components
- **Component isolation**: Each UI component in separate file
- **Hook extraction**: Custom hooks in `src/hooks/`

### Performance Optimizations
- **Lazy loading**: Dynamic imports for heavy components
- **Animation performance**: CSS transforms over layout changes
- **Streaming responses**: Server-Sent Events for AI generation
- **Image optimization**: Next.js Image with remote patterns

### Error Handling
- **Client-side**: Error boundaries and fallback components
- **Server-side**: Try-catch with detailed logging and email notifications
- **AI failures**: Graceful degradation with user-friendly messages
- **Network issues**: Retry logic and timeout handling

## Testing Strategy

### Manual Testing Scripts
- **`scripts/test_api_direct.py`**: Direct API endpoint testing
- **`scripts/test_fixes.py`**: Component integration tests
- **`scripts/test_error_notifications.py`**: Email notification testing
- **`scripts/test_url_handling.py`**: URL processing validation

### API Health Checks
```bash
# Test Python API health
curl "http://localhost:3000/api/python/generate?health=1"

# Test streaming endpoint
curl "http://localhost:3000/api/python/stream?health=1"
```

## Common Issues and Solutions

### Authentication Problems
- Verify GitHub OAuth redirect URIs match environment
- Check cookie domain settings in production vs development
- Clear browser cookies when switching environments

### AI Generation Failures
- Verify Google API key validity and credit balance
- Check repository accessibility (private repos need authentication)
- Review generation prompt limits and safety filters

### Build and Deployment Issues
- Ensure all environment variables are set in Vercel dashboard
- Check Python dependencies compatibility with Vercel runtime
- Verify Next.js configuration doesn't conflict with Vercel defaults

### Performance Issues  
- Disable background animations via CSS variables if needed
- Monitor Vercel function execution times and memory usage
- Consider reducing history item limits for large datasets

## Architecture Decisions

### Why Hybrid Next.js + Python?
- **Next.js**: Superior developer experience for modern React applications
- **Python**: Optimal for AI integration, repository analysis, and data processing  
- **Serverless**: Vercel platform excellently supports both technologies

### Why GitHub-Based Database?
- **Simplicity**: No external database setup or maintenance
- **Version Control**: Built-in backup and history tracking
- **Cost**: Free tier provides generous limits
- **Security**: Repository-based access control and encryption

### Why Multiple Background Components?
- **User Experience**: Consistent visual theming across different contexts
- **Performance**: Each optimized for specific use cases and performance requirements
- **Customization**: Easy to modify visual effects without affecting functionality
