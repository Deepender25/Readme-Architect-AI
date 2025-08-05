# AutoDoc AI - Next.js Version

A modern Next.js application for generating professional README files using AI, featuring the beautiful UI from the `rd` folder integrated with the powerful README generation logic from the main project.

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
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # README generation API
│   │   └── stream/route.ts      # Streaming generation API
│   ├── globals.css              # Global styles and theme
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── blocks/
│   │   ├── footers/             # Footer components
│   │   ├── heros/               # Hero section components
│   │   └── navbars/             # Navigation components
│   ├── ui/                      # Reusable UI components
│   ├── github-readme-editor.tsx # Main editor component
│   └── minimal-geometric-background.tsx
└── lib/
    └── utils.ts                 # Utility functions
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

## 📝 Migration Notes

This project successfully migrates:
- ✅ Modern UI from `rd/` folder
- ✅ Component structure and styling
- ✅ Animation and interaction patterns
- ✅ README generation logic integration
- ✅ Streaming API implementation
- ✅ TypeScript configuration

## 🚀 Deployment

The project is configured for Vercel deployment with both Next.js and Python serverless functions.

```bash
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.