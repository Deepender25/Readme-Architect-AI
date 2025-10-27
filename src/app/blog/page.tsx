"use client"

import { motion } from 'framer-motion'
import { PenTool, Calendar, Clock, User, ArrowRight, Zap, Code2, Sparkles } from 'lucide-react'
import LayoutWrapper from '@/components/layout-wrapper'

export default function BlogPage() {
  const featuredPost = {
    title: "Introducing ReadmeArchitect: Revolutionizing README Creation with Artificial Intelligence",
    excerpt: "Learn how we built an AI-powered README generator that transforms the way developers document their projects, making professional documentation accessible to everyone.",
    author: "Deepender Yadav",
    date: "December 19, 2024",
    readTime: "8 min read",
    image: "/api/placeholder/800/400",
    tags: ["AI", "Machine Learning", "Developer Tools", "Documentation"]
  }

  const recentPosts = [
    {
      title: "Best Practices for Writing Developer Documentation",
      excerpt: "Essential tips for creating documentation that developers actually want to read and use.",
      date: "Coming Soon",
      readTime: "6 min read",
      category: "Documentation"
    },
    {
      title: "The Future of AI in Software Development",
      excerpt: "Exploring how artificial intelligence is transforming the software development lifecycle.",
      date: "Coming Soon",
      readTime: "10 min read",
      category: "AI & Development"
    },
    {
      title: "Open Source Success: Building in Public",
      excerpt: "Lessons learned from building and sharing ReadmeArchitect as an open-source project.",
      date: "Coming Soon",
      readTime: "7 min read",
      category: "Open Source"
    }
  ]

  return (
    <LayoutWrapper showBreadcrumbs={true} maxWidth="7xl">
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">ReadmeArchitect Blog</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Insights, tutorials, and stories about AI-powered development tools and the future of documentation.
            </p>
          </motion.div>

          {/* Featured Post */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-green-400/10 to-green-600/10 border border-green-400/20 rounded-xl overflow-hidden">
              {/* Featured Badge */}
              <div className="px-8 pt-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-400/20 text-green-400 text-sm font-semibold rounded-full">
                  <Sparkles className="w-4 h-4" />
                  Featured Post
                </span>
              </div>
              
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-black/40 border border-green-400/30 text-green-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Image Placeholder */}
                  <div className="bg-black/40 rounded-xl p-8 border border-green-400/20">
                    <div className="w-full h-64 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Code2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <p className="text-green-400 font-semibold">Featured Article</p>
                        <p className="text-gray-400 text-sm">AI-Powered Documentation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Article Content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-black/40 border border-green-400/20 rounded-xl p-8">
              <div className="max-w-4xl mx-auto prose prose-invert prose-green">
                <h3 className="text-2xl font-bold text-white mb-6">The Story Behind ReadmeArchitect</h3>
                
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p>
                    As developers, we've all been there – staring at a blank README file, wondering how to best describe our project. 
                    What started as a simple frustration became the inspiration for ReadmeArchitect, an intelligent README generator 
                    that understands your code and creates professional documentation in seconds.
                  </p>

                  <h4 className="text-xl font-semibold text-white mt-8 mb-4">The Problem</h4>
                  <p>
                    Creating good documentation is crucial for project success, but it's often treated as an afterthought. 
                    Developers spend hours crafting README files, often struggling with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Finding the right structure and sections to include</li>
                    <li>Writing clear installation and usage instructions</li>
                    <li>Describing features in an engaging, professional manner</li>
                    <li>Keeping documentation updated as projects evolve</li>
                  </ul>

                  <h4 className="text-xl font-semibold text-white mt-8 mb-4">The AI Solution</h4>
                  <p>
                    ReadmeArchitect leverages the power of Google's Gemini AI to analyze your repository structure, 
                    understand your codebase, and generate comprehensive README files tailored to your project. 
                    Here's how we made it happen:
                  </p>

                  <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-6 my-6">
                    <h5 className="text-lg font-semibold text-green-400 mb-3">Key Features</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Intelligent code analysis and structure detection</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Customizable templates for different project types</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Real-time editing with live preview</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Export options and version history</span>
                      </li>
                    </ul>
                  </div>

                  <h4 className="text-xl font-semibold text-white mt-8 mb-4">Building in Public</h4>
                  <p>
                    ReadmeArchitect is more than just a tool – it's a learning experience built in public. 
                    As a passionate developer, I wanted to create something that solves a real problem 
                    while exploring the latest in AI and web technologies.
                  </p>

                  <p>
                    The entire project is open source and available on GitHub. Whether you're looking to 
                    contribute, learn from the codebase, or simply use the tool for your own projects, 
                    the community is at the heart of what we're building.
                  </p>

                  <h4 className="text-xl font-semibold text-white mt-8 mb-4">What's Next?</h4>
                  <p>
                    This is just the beginning. We're working on exciting features like:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Direct GitHub integration for seamless README updates</li>
                    <li>Advanced customization options and themes</li>
                    <li>Support for multiple programming languages and frameworks</li>
                    <li>Collaborative editing and team features</li>
                  </ul>

                  <div className="bg-black/60 border border-green-400/30 rounded-lg p-6 my-8 text-center">
                    <h5 className="text-lg font-semibold text-white mb-3">Ready to Try ReadmeArchitect?</h5>
                    <p className="text-gray-300 mb-4">
                      Experience the future of documentation creation. Generate your first AI-powered README in under 5 minutes.
                    </p>
                    <motion.a
                      href="/generate"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                    >
                      <Zap className="w-5 h-5" />
                      Get Started Now
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Recent Posts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">More Articles Coming Soon</h2>
              <p className="text-gray-400">
                Stay tuned for more insights about AI, development tools, and documentation best practices.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-black/40 border border-green-400/20 rounded-xl p-6 hover:border-green-400/40 transition-all duration-300"
                >
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-green-400/10 text-green-400 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Newsletter Signup */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-green-400/20 to-green-600/20 border border-green-400/30 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get notified when we publish new articles about AI development tools, documentation best practices, 
                and ReadmeArchitect updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-black/40 border border-green-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam, unsubscribe at any time. This feature is coming soon!
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </LayoutWrapper>
  )
}
