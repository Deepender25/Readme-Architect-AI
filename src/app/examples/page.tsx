"use client"

import { Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { motion } from 'framer-motion'
import { 
  Github, 
  Code, 
  FileText, 
  Star, 
  GitBranch, 
  Eye, 
  Download,
  ExternalLink,
  CheckCircle,
  Zap,
  Sparkles,
  ArrowRight,
  Copy,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CenteredWithLogo } from '@/components/blocks/footers/centered-with-logo'
import { useSmoothNavigation } from '@/hooks/use-smooth-navigation'

function ExamplesContent() {
  const { navigateWithPreload } = useSmoothNavigation()

  const examples = [
    {
      title: "React TypeScript App",
      description: "Modern React application with TypeScript, featuring comprehensive documentation, installation guides, and usage examples.",
      language: "TypeScript",
      stars: "2.4k",
      forks: "312",
      color: "from-blue-400 to-blue-600",
      repo: "react-typescript-starter",
      author: "Sarah Chen",
      company: "TechCorp",
      generatedIn: "28s",
      features: ["Component Documentation", "API Reference", "Testing Guide", "Deployment Instructions"],
      preview: `# React TypeScript Starter 🚀

A modern, fully-typed React application starter template with best practices and comprehensive tooling.

## ✨ Features

- ⚡ **Vite** for lightning-fast development
- 🔷 **TypeScript** for type safety
- ⚛️ **React 18** with latest features
- 🎨 **Tailwind CSS** for styling
- 🧪 **Vitest** for testing
- 📦 **ESLint & Prettier** for code quality

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📖 Documentation

Visit our [documentation](./docs) for detailed guides and API references.`
    },
    {
      title: "Python Data Science",
      description: "Comprehensive data science project with Jupyter notebooks, data analysis workflows, and machine learning models.",
      language: "Python",
      stars: "1.8k",
      forks: "245",
      color: "from-yellow-400 to-orange-600",
      repo: "python-data-science",
      author: "Dr. Maria Rodriguez",
      company: "DataLab",
      generatedIn: "22s",
      features: ["Jupyter Notebooks", "Data Visualization", "ML Models", "API Documentation"],
      preview: `# Data Science Toolkit 📊

A comprehensive Python toolkit for data analysis, visualization, and machine learning.

## 🔬 What's Inside

- 📈 **Data Analysis** with Pandas & NumPy
- 📊 **Visualization** with Matplotlib & Seaborn
- 🤖 **Machine Learning** with Scikit-learn
- 📓 **Jupyter Notebooks** with examples

## 🛠️ Installation

\`\`\`bash
pip install -r requirements.txt
jupyter notebook
\`\`\`

## 📚 Notebooks

1. \`01_data_exploration.ipynb\` - Data exploration and cleaning
2. \`02_visualization.ipynb\` - Creating stunning visualizations
3. \`03_machine_learning.ipynb\` - Building ML models`
    },
    {
      title: "Node.js REST API",
      description: "Production-ready REST API with Express.js, featuring authentication, database integration, and comprehensive testing.",
      language: "JavaScript",
      stars: "3.1k",
      forks: "428",
      color: "from-green-400 to-emerald-600",
      repo: "nodejs-rest-api",
      author: "Alex Thompson",
      company: "DevStudio",
      generatedIn: "31s",
      features: ["Authentication", "Database Integration", "API Documentation", "Testing Suite"],
      preview: `# Node.js REST API 🌐

A production-ready REST API built with Express.js, featuring authentication, database integration, and comprehensive testing.

## 🚀 Features

- 🔐 **JWT Authentication** with refresh tokens
- 🗄️ **MongoDB** with Mongoose ODM
- 📝 **API Documentation** with Swagger
- 🧪 **Comprehensive Testing** with Jest
- 🔒 **Security** with Helmet & CORS
- 📊 **Logging** with Winston

## 🛠️ Quick Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📋 API Endpoints

- \`POST /auth/login\` - User authentication
- \`GET /users\` - Get all users
- \`POST /users\` - Create new user
- \`PUT /users/:id\` - Update user`
    },
    {
      title: "Flutter Mobile App",
      description: "Cross-platform mobile application with Flutter, featuring state management, API integration, and native features.",
      language: "Dart",
      stars: "1.2k",
      forks: "189",
      color: "from-cyan-400 to-blue-600",
      repo: "flutter-mobile-app",
      author: "Emily Watson",
      company: "MobileFirst",
      generatedIn: "26s",
      features: ["State Management", "API Integration", "Native Features", "Testing"],
      preview: `# Flutter Mobile App 📱

A beautiful cross-platform mobile application built with Flutter, featuring modern UI and seamless user experience.

## ✨ Features

- 🎨 **Beautiful UI** with Material Design
- 🔄 **State Management** with Riverpod
- 🌐 **API Integration** with Dio
- 📱 **Native Features** (Camera, GPS, etc.)
- 🧪 **Widget Testing** included

## 🚀 Getting Started

\`\`\`bash
flutter pub get
flutter run
\`\`\`

## 📦 Dependencies

- \`riverpod\` - State management
- \`dio\` - HTTP client
- \`go_router\` - Navigation
- \`shared_preferences\` - Local storage`
    },
    {
      title: "Go Microservice",
      description: "Scalable microservice architecture with Go, featuring gRPC, Docker containerization, and Kubernetes deployment.",
      language: "Go",
      stars: "892",
      forks: "156",
      color: "from-indigo-400 to-purple-600",
      repo: "go-microservice",
      author: "David Kim",
      company: "CloudTech",
      generatedIn: "19s",
      features: ["gRPC API", "Docker", "Kubernetes", "Monitoring"],
      preview: `# Go Microservice 🐹

A scalable microservice built with Go, featuring gRPC communication, Docker containerization, and Kubernetes deployment.

## 🏗️ Architecture

- 🚀 **gRPC** for high-performance communication
- 🐳 **Docker** for containerization
- ☸️ **Kubernetes** for orchestration
- 📊 **Prometheus** for monitoring
- 🗄️ **PostgreSQL** for data persistence

## 🛠️ Development

\`\`\`bash
go mod download
go run main.go
\`\`\`

## 🐳 Docker

\`\`\`bash
docker build -t go-microservice .
docker run -p 8080:8080 go-microservice
\`\`\``
    },
    {
      title: "Rust CLI Tool",
      description: "High-performance command-line tool built with Rust, featuring async operations, error handling, and cross-platform support.",
      language: "Rust",
      stars: "654",
      forks: "87",
      color: "from-orange-400 to-red-600",
      repo: "rust-cli-tool",
      author: "James Wilson",
      company: "SystemsLab",
      generatedIn: "24s",
      features: ["Async Operations", "Error Handling", "Cross-platform", "Performance"],
      preview: `# Rust CLI Tool ⚡

A blazingly fast command-line tool built with Rust, featuring async operations and robust error handling.

## 🦀 Features

- ⚡ **Blazing Fast** performance
- 🔄 **Async Operations** with Tokio
- 🛡️ **Robust Error Handling**
- 🌍 **Cross-platform** support
- 📦 **Easy Installation** via Cargo

## 🚀 Installation

\`\`\`bash
cargo install rust-cli-tool
\`\`\`

## 💻 Usage

\`\`\`bash
rust-cli-tool --help
rust-cli-tool process --input file.txt
rust-cli-tool analyze --format json
\`\`\`

## 🔧 Development

\`\`\`bash
cargo build --release
cargo test
\`\`\``
    }
  ]

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-20"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-6"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(0, 255, 136, 0.3)',
                    '0 0 20px rgba(0, 255, 136, 0.5)',
                    '0 0 0px rgba(0, 255, 136, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
                Real Project Examples
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-green-400 to-white bg-clip-text text-transparent mb-6">
                README Examples
              </h1>
              
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Explore professionally generated READMEs across different programming languages and project types. 
                See how AutoDoc AI creates comprehensive documentation that developers love.
              </p>
            </motion.div>

            {/* Examples Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-20">
              {examples.map((example, index) => (
                <motion.div
                  key={example.repo}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden hover:border-green-400/30 transition-all duration-300">
                    {/* Gradient background */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${example.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    
                    <div className="relative p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${example.color} rounded-xl flex items-center justify-center`}>
                              <Github className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{example.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-1">
                                <span className="flex items-center gap-1">
                                  <Code className="w-4 h-4" />
                                  {example.language}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4" />
                                  {example.stars}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GitBranch className="w-4 h-4" />
                                  {example.forks}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-green-400">
                                <span>by {example.author} • {example.company}</span>
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  Generated in {example.generatedIn}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-400 leading-relaxed mb-4">
                            {example.description}
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-white mb-3">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {example.features.map((feature, featureIndex) => (
                            <motion.div
                              key={feature}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 + featureIndex * 0.05 }}
                              className="flex items-center gap-2 text-sm text-gray-400"
                            >
                              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                              <span>{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* README Preview */}
                      <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 mb-6 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-white">README.md Preview</span>
                        </div>
                        <pre className="text-xs text-gray-300 overflow-hidden leading-relaxed">
                          {example.preview}
                        </pre>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => navigateWithPreload('/')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Similar
                        </Button>
                        <Button
                          variant="outline"
                          className="border-green-400/50 text-green-400 hover:bg-green-400/10 rounded-lg"
                          onClick={() => {
                            // Create a modal or expand the preview
                            console.log('View full README for', example.title)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Full
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-600/10 rounded-lg"
                          onClick={() => {
                            navigator.clipboard.writeText(example.preview)
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-3xl border border-[rgba(255,255,255,0.1)] p-12 relative overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-lg opacity-20" />
                <div className="relative">
                  <Heart className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Love What You See?
                  </h2>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Create your own professional README in seconds. Join thousands of developers who trust AutoDoc AI.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigateWithPreload('/')}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start Creating
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <Button
                      onClick={() => navigateWithPreload('/features')}
                      variant="outline"
                      className="border-green-400/50 text-green-400 hover:bg-green-400/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:border-green-400"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <CenteredWithLogo />
      </div>
    </div>
  )
}

export default function ExamplesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamplesContent />
    </Suspense>
  )
}