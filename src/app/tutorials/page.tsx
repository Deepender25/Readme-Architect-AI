"use client"

import { motion } from 'framer-motion'
import { BookOpen, PlayCircle, CheckCircle, GitBranch, Zap, FileText, Settings, Download, Share2, Edit } from 'lucide-react'
import LayoutWrapper from '@/components/layout-wrapper'

export default function TutorialsPage() {
  const steps = [
    {
      icon: GitBranch,
      title: "Connect Your Repository",
      description: "Start by connecting your GitHub repository to ReadmeForge. Simply paste your repository URL or select from your connected repositories.",
      details: [
        "Copy your GitHub repository URL",
        "Paste it into the repository input field",
        "Click 'Analyze Repository' to begin",
        "Our AI will scan your project structure"
      ]
    },
    {
      icon: Settings,
      title: "Customize Your README",
      description: "Choose from various templates and customize the sections you want to include in your README file.",
      details: [
        "Select a template that fits your project type",
        "Choose which sections to include (Installation, Usage, Features, etc.)",
        "Add custom sections if needed",
        "Set your preferred tone and style"
      ]
    },
    {
      icon: Zap,
      title: "AI Generation",
      description: "Let our AI analyze your code and generate a comprehensive README based on your project structure and preferences.",
      details: [
        "AI analyzes your codebase structure",
        "Identifies key features and functionality",
        "Generates appropriate installation instructions",
        "Creates usage examples based on your code"
      ]
    },
    {
      icon: Edit,
      title: "Review & Edit",
      description: "Review the generated README and make any necessary edits using our built-in editor with live preview.",
      details: [
        "Use the split-screen editor with live preview",
        "Edit text, add images, and format content",
        "Add badges, shields, and visual elements",
        "Preview how it will look on GitHub"
      ]
    },
    {
      icon: Download,
      title: "Export & Use",
      description: "Download your README file or copy it directly to your repository. Save it to your project history for future updates.",
      details: [
        "Download as README.md file",
        "Copy content to clipboard",
        "Save to your project history",
        "Push directly to your repository (coming soon)"
      ]
    }
  ]

  const tips = [
    {
      icon: FileText,
      title: "Project Structure Matters",
      tip: "Organize your code with clear folder structures and meaningful file names. This helps our AI understand your project better."
    },
    {
      icon: GitBranch,
      title: "Use Meaningful Commit Messages",
      tip: "Good commit messages help the AI understand the evolution and purpose of your project features."
    },
    {
      icon: Settings,
      title: "Include a package.json or requirements.txt",
      tip: "Dependency files help the AI generate accurate installation instructions for your project."
    },
    {
      icon: Zap,
      title: "Add Comments to Complex Code",
      tip: "Well-commented code helps the AI understand functionality and generate better usage examples."
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
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">How to Use ReadmeForge</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Learn how to create professional README files for your repositories in just a few minutes using our AI-powered generator.
            </p>
          </motion.div>

          {/* Quick Start Video Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-green-400/10 to-green-600/10 border border-green-400/20 rounded-xl p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <PlayCircle className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Quick Start</h2>
              </div>
              <div className="bg-black/40 rounded-lg p-8 text-center">
                <div className="w-24 h-24 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-12 h-12 text-green-400" />
                </div>
                <p className="text-gray-300 mb-4">
                  Watch our quick 2-minute tutorial to get started with ReadmeForge
                </p>
                <p className="text-sm text-green-400">
                  📹 Video tutorial coming soon! For now, follow the step-by-step guide below.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Step-by-Step Guide */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Step-by-Step Guide</h2>
              <p className="text-gray-400">Follow these simple steps to generate your perfect README</p>
            </motion.div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-black/40 border border-green-400/20 rounded-xl p-8"
                >
                  <div className="flex items-start gap-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <step.icon className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                      
                      <p className="text-gray-300 mb-6">{step.description}</p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-3 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pro Tips Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Pro Tips</h2>
              <p className="text-gray-400">Get the best results from ReadmeForge with these expert tips</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-green-400/10 border border-green-400/30 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                      <p className="text-gray-300 text-sm">{tip.tip}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Common questions about using ReadmeForge</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "What types of projects work best with ReadmeForge?",
                  a: "ReadmeForge works with all types of software projects - web applications, mobile apps, APIs, libraries, and more. It's particularly effective with projects that have clear folder structures and dependency files."
                },
                {
                  q: "How accurate is the generated README content?",
                  a: "Our AI analyzes your actual code structure and generates content based on real project data. While generally very accurate, we recommend reviewing and editing the output to ensure it matches your specific needs."
                },
                {
                  q: "Can I edit the generated README?",
                  a: "Absolutely! Our built-in editor allows you to modify any part of the generated README. You can add custom sections, change wording, add images, and format the content exactly how you want it."
                },
                {
                  q: "Is my repository data stored or shared?",
                  a: "We only analyze your repository structure temporarily to generate the README. We don't store your code permanently. Check our Privacy Policy for detailed information about data handling."
                },
                {
                  q: "Can I regenerate a README for the same project?",
                  a: "Yes! You can generate multiple versions of your README and save them to your project history. This is useful when your project evolves or you want to try different approaches."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-black/40 border border-green-400/20 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                  <p className="text-gray-300">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Get Started CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-400/20 to-green-600/20 border border-green-400/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-6">
                Create your first AI-generated README in under 5 minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/generate"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                >
                  <Zap className="w-5 h-5" />
                  Generate README Now
                </motion.a>
                <motion.a
                  href="/examples"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-green-400/50 text-green-400 hover:bg-green-400/10 font-semibold rounded-lg transition-all duration-300"
                >
                  <FileText className="w-5 h-5" />
                  See Examples
                </motion.a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </LayoutWrapper>
  )
}
