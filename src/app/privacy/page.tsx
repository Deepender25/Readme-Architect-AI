"use client"

import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react'
import LayoutWrapper from '@/components/layout-wrapper'

export default function PrivacyPolicyPage() {
  return (
    <LayoutWrapper showBreadcrumbs={true} maxWidth="7xl">
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400 text-lg">
              Your privacy is important to us. Here's how we handle your data.
            </p>
            <p className="text-sm text-green-400 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  ReadmeForge is designed with privacy in mind. When you use our README generator, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Repository information you choose to analyze (URLs, code structure)</li>
                  <li>Generated README content and customizations</li>
                  <li>Basic usage analytics to improve our service</li>
                  <li>Technical information like IP address and browser type for security</li>
                </ul>
              </div>
            </motion.section>

            {/* How We Use Your Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Generate high-quality README files for your repositories</li>
                  <li>Improve our AI models and service quality</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Ensure security and prevent abuse of our service</li>
                  <li>Send important updates about our service (with your consent)</li>
                </ul>
              </div>
            </motion.section>

            {/* Data Security */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Data Security</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  We take data security seriously and implement industry-standard measures:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All data transmission is encrypted using HTTPS/TLS</li>
                  <li>We don't store your repository code permanently</li>
                  <li>Generated READMEs are processed temporarily and can be deleted upon request</li>
                  <li>Access to your data is strictly limited to necessary operations</li>
                  <li>Regular security audits and updates to our systems</li>
                </ul>
              </div>
            </motion.section>

            {/* Third-Party Services */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Third-Party Services</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  ReadmeForge uses third-party services to provide our features:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Gemini AI:</strong> For README generation and content analysis</li>
                  <li><strong>GitHub API:</strong> For accessing repository information (with your permission)</li>
                  <li><strong>Analytics Services:</strong> For usage statistics and performance monitoring</li>
                </ul>
                <p className="mt-4">
                  These services have their own privacy policies, and we recommend reviewing them.
                </p>
              </div>
            </motion.section>

            {/* Your Rights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Request access to your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of certain data processing activities</li>
                  <li>Data portability (receive your data in a structured format)</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:yadavdeepender65@gmail.com" className="text-green-400 hover:text-green-300">
                    yadavdeepender65@gmail.com
                  </a>
                </p>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-green-400/10 border border-green-400/30 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Questions?</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  If you have any questions about this privacy policy or our practices, please reach out:
                </p>
                <div className="flex flex-col gap-2">
                  <p>
                    Email:{' '}
                    <a href="mailto:yadavdeepender65@gmail.com" className="text-green-400 hover:text-green-300">
                      yadavdeepender65@gmail.com
                    </a>
                  </p>
                  <p>
                    GitHub:{' '}
                    <a 
                      href="https://github.com/Deepender25" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-green-400 hover:text-green-300"
                    >
                      @Deepender25
                    </a>
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Disclaimer */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center py-8"
            >
              <p className="text-sm text-gray-500">
                This is a fun personal project. While we take privacy seriously, 
                this tool is provided as-is for educational and development purposes.
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
