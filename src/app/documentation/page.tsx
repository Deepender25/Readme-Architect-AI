"use client"

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Code, 
  FileText, 
  Zap, 
  Github, 
  Settings, 
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Rocket,
  Shield,
  Clock,
  Users,
  Star,
  Download,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import LayoutWrapper from '@/components/layout-wrapper'
import PageHeader from '@/components/layout/page-header'
import ContentSection from '@/components/layout/content-section'

function DocumentationContent() {

  const sections = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "Quick start guide to generate your first README",
      color: "from-blue-400 to-blue-600",
      items: [
        "Sign in with GitHub",
        "Paste your repository URL",
        "Choose generation options",
        "Download your README"
      ]
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Customize your README generation settings",
      color: "from-purple-400 to-purple-600",
      items: [
        "Template selection",
        "Content preferences",
        "Badge configuration",
        "Section customization"
      ]
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Integrate AutoDoc AI into your workflow",
      color: "from-green-400 to-green-600",
      items: [
        "REST API endpoints",
        "Authentication methods",
        "Request/response formats",
        "Rate limiting"
      ]
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      color: "from-orange-400 to-orange-600",
      items: [
        "Generation failures",
        "Authentication issues",
        "Format problems",
        "Performance tips"
      ]
    }
  ]

  const faqs = [
    {
      question: "How does AutoDoc AI analyze my repository?",
      answer: "AutoDoc AI uses advanced algorithms to scan your repository structure, analyze code files, read package.json/requirements.txt, and understand your project's architecture to generate comprehensive documentation."
    },
    {
      question: "What programming languages are supported?",
      answer: "We support 50+ programming languages including JavaScript, TypeScript, Python, Java, Go, Rust, C++, PHP, Ruby, Swift, Kotlin, and many more. The AI adapts to each language's conventions."
    },
    {
      question: "Can I customize the generated README?",
      answer: "Yes! You can choose from multiple templates, customize sections, add or remove badges, and edit the content after generation. The AI provides a solid foundation that you can build upon."
    },
    {
      question: "Is my repository data secure?",
      answer: "Absolutely. We only read public repository information and never store your code. All processing is done securely, and we follow industry-standard security practices to protect your data."
    },
    {
      question: "How accurate are the generated READMEs?",
      answer: "Our AI achieves 95%+ accuracy by analyzing multiple aspects of your project. While the generated content is highly accurate, we recommend reviewing and customizing it to match your specific needs."
    },
    {
      question: "Can I use AutoDoc AI for private repositories?",
      answer: "Yes, with proper GitHub authentication, AutoDoc AI can access and generate documentation for your private repositories while maintaining complete security and privacy."
    }
  ]

  const quickStart = [
    {
      step: 1,
      title: "Connect GitHub",
      description: "Sign in with your GitHub account to access your repositories",
      icon: Github
    },
    {
      step: 2,
      title: "Select Repository",
      description: "Choose a repository or paste a GitHub URL to analyze",
      icon: FileText
    },
    {
      step: 3,
      title: "Generate README",
      description: "Let our AI analyze your project and create documentation",
      icon: Zap
    },
    {
      step: 4,
      title: "Download & Use",
      description: "Download your README and add it to your repository",
      icon: Download
    }
  ]

  return (
    <LayoutWrapper>
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
                <BookOpen className="w-4 h-4" />
                Complete Guide
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-green-400 to-white bg-clip-text text-transparent mb-6">
                Documentation
              </h1>
              
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about AutoDoc AI. From quick start guides to advanced configuration, 
                we've got you covered with comprehensive documentation.
              </p>
            </motion.div>

            {/* Quick Start Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-20"
            >
              <h2 className="text-4xl font-bold text-center text-white mb-4">
                Quick Start Guide
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Get up and running with AutoDoc AI in just 4 simple steps
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStart.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="relative group"
                  >
                    <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 text-center hover:border-green-400/30 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                          {item.step}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Documentation Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-4xl font-bold text-center text-white mb-4">
                Documentation Sections
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Explore detailed guides for every aspect of AutoDoc AI
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                    className="group relative"
                  >
                    <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8 hover:border-green-400/30 transition-all duration-300 relative overflow-hidden">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${section.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                      
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                          <section.icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">{section.description}</p>
                        
                        <ul className="space-y-3 mb-6">
                          {section.items.map((item, itemIndex) => (
                            <motion.li
                              key={item}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.1 + itemIndex * 0.05 }}
                              className="flex items-center gap-3 text-gray-400"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <Button
                          variant="outline"
                          className="border-green-400/50 text-green-400 hover:bg-green-400/10 w-full"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-20"
            >
              <h2 className="text-4xl font-bold text-center text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Find answers to common questions about AutoDoc AI
              </p>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 hover:border-green-400/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <HelpCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center"
            >
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-3xl border border-[rgba(255,255,255,0.1)] p-12 relative overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-lg opacity-20" />
                <div className="relative">
                  <Lightbulb className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Join thousands of developers who have streamlined their documentation process with AutoDoc AI
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigateWithPreload('/')}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start Generating
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <Button
                      onClick={() => navigateWithPreload('/examples')}
                      variant="outline"
                      className="border-green-400/50 text-green-400 hover:bg-green-400/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:border-green-400"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      View Examples
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
    </LayoutWrapper>
  )
}

export default function DocumentationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentationContent />
    </Suspense>
  )
}