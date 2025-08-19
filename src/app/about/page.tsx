"use client"

import { motion } from 'framer-motion'
import { Heart, Zap, Users, Target, Lightbulb, Code2, Coffee, Github } from 'lucide-react'
import LayoutWrapper from '@/components/layout-wrapper'

export default function AboutPage() {
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
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">About AutoDoc AI</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A passion project born from the simple idea that great documentation shouldn't be hard to create.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    AutoDoc AI was created with a simple mission: to democratize great documentation. 
                    We believe every project deserves professional, comprehensive documentation, 
                    regardless of the developer's writing skills or available time.
                  </p>
                  <p>
                    By leveraging the power of artificial intelligence, we're making it possible 
                    for developers to create stunning README files in minutes, not hours.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 border border-green-400/20 rounded-xl p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Fast</h3>
                    <p className="text-sm text-gray-400">Generate READMEs in minutes</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Accessible</h3>
                    <p className="text-sm text-gray-400">For developers of all levels</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Accurate</h3>
                    <p className="text-sm text-gray-400">AI-powered content analysis</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Open</h3>
                    <p className="text-sm text-gray-400">Built in public, for everyone</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-black/40 border border-green-400/20 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-green-400" />
                <h2 className="text-3xl font-bold text-white">The Story</h2>
              </div>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">This page is currently being crafted with love! ✨</strong>
                </p>
                <p>
                  AutoDoc AI started as a weekend project that quickly grew into something much bigger. 
                  As a developer who's spent countless hours writing and rewriting README files, 
                  I knew there had to be a better way.
                </p>
                <p>
                  The idea was simple: what if we could use AI to understand a project's structure, 
                  purpose, and features, then generate professional documentation automatically? 
                  After months of experimentation with different AI models and approaches, 
                  AutoDoc AI was born.
                </p>
                <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-6 my-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">🚧 Content Coming Soon</h3>
                  <p className="text-gray-300">
                    We're working on expanding this section with more details about our journey, 
                    the technology behind AutoDoc AI, and our vision for the future of developer documentation.
                  </p>
                </div>
                <p>
                  What started as a solution to my own problem has now helped thousands of developers 
                  create better documentation for their projects. And we're just getting started!
                </p>
              </div>
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-gray-400">The principles that guide everything we build</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Code2,
                  title: "Developer First",
                  description: "Every feature is designed with developers in mind. We understand your workflow because we live it every day."
                },
                {
                  icon: Heart,
                  title: "Open & Transparent",
                  description: "Built in public, open source, and community-driven. No black boxes, no hidden agendas, just great tools."
                },
                {
                  icon: Zap,
                  title: "Innovation with Purpose",
                  description: "We don't use AI just because it's trendy. Every feature solves a real problem that developers face."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-black/40 border border-green-400/20 rounded-xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Built With Modern Technology</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { name: "Next.js", category: "Framework" },
                  { name: "TypeScript", category: "Language" },
                  { name: "Tailwind CSS", category: "Styling" },
                  { name: "Google Gemini", category: "AI" }
                ].map((tech, index) => (
                  <div key={index} className="p-4 bg-black/40 rounded-lg border border-green-400/20">
                    <h3 className="font-semibold text-white mb-1">{tech.name}</h3>
                    <p className="text-xs text-gray-400">{tech.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Community & Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <div className="bg-black/40 border border-green-400/20 rounded-xl p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Coffee className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Let's Connect</h2>
              </div>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                AutoDoc AI is built by developers, for developers. Whether you have feedback, 
                want to contribute, or just want to say hi, I'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="https://github.com/Deepender25"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                >
                  <Github className="w-5 h-5" />
                  Follow on GitHub
                </motion.a>
                <motion.a
                  href="mailto:yadavdeepender65@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-green-400/50 text-green-400 hover:bg-green-400/10 font-semibold rounded-lg transition-all duration-300"
                >
                  Send Email
                </motion.a>
              </div>
              
              <div className="mt-8 pt-6 border-t border-green-400/20">
                <p className="text-sm text-gray-500">
                  Made with ❤️ by{' '}
                  <a 
                    href="https://github.com/Deepender25" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Deepender Yadav
                  </a>
                  {' '}• This page will be expanded with more content soon!
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </LayoutWrapper>
  )
}
