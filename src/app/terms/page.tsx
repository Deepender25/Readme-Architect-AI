"use client"

import { motion } from 'framer-motion'
import { FileText, AlertTriangle, CheckCircle, Scale, Gavel, Clock } from 'lucide-react'
import LayoutWrapper from '@/components/layout-wrapper'

export default function TermsOfServicePage() {
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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400 text-lg">
              Please read these terms carefully before using ReadmeArchitect.
            </p>
            <p className="text-sm text-green-400 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  By accessing and using ReadmeArchitect ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These terms apply to all visitors, users, and others who access or use the service.
                </p>
              </div>
            </motion.section>

            {/* Description of Service */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Description of Service</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  ReadmeArchitect is an AI-powered README generator that helps developers create professional documentation for their repositories. Our service includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Automated README generation based on repository analysis</li>
                  <li>Customizable templates and content suggestions</li>
                  <li>Integration with popular version control platforms</li>
                  <li>AI-powered content optimization and improvements</li>
                </ul>
              </div>
            </motion.section>

            {/* User Obligations */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Gavel className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">User Obligations</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>As a user of this service, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the service only for lawful purposes</li>
                  <li>Not attempt to reverse engineer or copy our AI models</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not use the service to generate harmful or misleading content</li>
                  <li>Provide accurate information when required</li>
                  <li>Not attempt to overwhelm our servers or disrupt the service</li>
                </ul>
              </div>
            </motion.section>

            {/* Intellectual Property */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Your Content</h3>
                  <p>
                    You retain full ownership of your repository content and any READMEs you create using our service. 
                    You can use, modify, and distribute the generated content freely.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Our Service</h3>
                  <p>
                    ReadmeArchitect, including its AI models, interface, and underlying technology, is proprietary to us and protected by intellectual property laws.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Disclaimer */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-semibold text-white">Disclaimer</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-amber-400">Important:</strong> This is a personal fun project created for educational and development purposes.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The service is provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee 100% uptime or availability</li>
                  <li>Generated content may contain errors and should be reviewed</li>
                  <li>We are not liable for any damages arising from use of this service</li>
                  <li>The service may be modified or discontinued at any time</li>
                </ul>
              </div>
            </motion.section>

            {/* Privacy and Data */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Privacy and Data</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Your privacy is important to us. Please review our{' '}
                  <a href="/privacy" className="text-green-400 hover:text-green-300 underline">
                    Privacy Policy
                  </a>{' '}
                  to understand how we collect, use, and protect your information.
                </p>
                <p>
                  By using our service, you also agree to our data handling practices as outlined in the Privacy Policy.
                </p>
              </div>
            </motion.section>

            {/* Modifications */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-black/40 border border-green-400/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">Modifications to Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.
                </p>
                <p>
                  Your continued use of the service after any changes constitutes acceptance of the new terms.
                </p>
                <p>
                  We encourage you to review these terms periodically for any changes.
                </p>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-green-400/10 border border-green-400/30 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Contact Us</h2>
              <div className="text-gray-300">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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
                  <p>
                    Project Repository:{' '}
                    <a 
                      href="https://github.com/Deepender25/Readme-Architect-AI" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-green-400 hover:text-green-300"
                    >
                      Readme-Architect-AI
                    </a>
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Fun Project Notice */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-center py-8"
            >
              <p className="text-sm text-gray-500">
                🚀 This is a passion project built with ❤️ for the developer community. 
                Use it, enjoy it, and feel free to contribute!
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
