# AutoDoc AI

A modern Next.js application for generating professional README files using AI, featuring a beautiful UI with powerful README generation capabilities.

## 🚀 Features

- **Modern Next.js 15** with TypeScript
- **Beautiful UI** with Framer Motion animations and Tailwind CSS
- **AI-Powered README Generation** using Google Gemini
- **Real-time Streaming** generation with progress updates
- **GitHub Integration** for repository analysis
- **Live Editor** with split-pane view and syntax highlighting
- **Responsive Design** with dark theme and glassmorphism effects

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **UI Components:** Radix UI, Lucide React
- **AI Integration:** Google Gemini API
- **Styling:** Custom CSS variables, animations, and effects
- **Backend:** Next.js API routes + Python serverless functions

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. **Home Page:** Enter a GitHub repository URL
2. **Editor View:** Configure generation options and generate README
3. **Live Preview:** See real-time markdown rendering
4. **Export:** Copy or download the generated README

## 🏗️ Project Structure

```
├── api/                         # Python serverless functions
│   ├── index.py                 # Main API handler (auth, repos, history)
│   ├── generate.py              # README generation endpoint
│   ├── stream.py                # Streaming generation endpoint
│   └── database.py              # Database operations
├── src/                         # Next.js application
│   ├── app/                     # App router pages and API routes
│   ├── components/              # React components
│   └── lib/                     # Utility functions
├── static/                      # Static assets for legacy interface
└── vercel.json                  # Deployment configuration
```

## 🎨 Design Features

- **Animated Background:** Geometric grid with floating elements
- **Glassmorphism:** Translucent cards with backdrop blur
- **Green Accent Theme:** Consistent #00ff88 color scheme
- **Responsive Layout:** Mobile-first design approach
- **Smooth Animations:** Framer Motion powered transitions

## 🔧 Development

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS with custom CSS variables
- **TypeScript:** Full type safety throughout
- **Components:** Modular, reusable component architecture
- **API:** RESTful endpoints with streaming support

## 🔧 Architecture

This project combines:
- ✅ **Next.js Frontend**: Modern React application with TypeScript
- ✅ **Python Backend**: Serverless functions for AI processing
- ✅ **Dual Interface**: Both modern Next.js UI and legacy static interface
- ✅ **GitHub Integration**: OAuth authentication and repository access
- ✅ **AI Generation**: Google Gemini for README creation
- ✅ **Database**: Supabase for user history and data persistence

## 🚀 Deployment

The project is configured for Vercel deployment with both Next.js and Python serverless functions.

```bash
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.