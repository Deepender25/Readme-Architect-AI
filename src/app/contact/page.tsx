"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Github, Instagram, MapPin, Clock, Send, Heart, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import LayoutWrapper from '@/components/layout-wrapper'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      console.log('📧 Attempting to send contact form...')
      
      // Try Next.js API route first
      let response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let result = await response.json()

      // If Next.js route fails, try Python fallback
      if (!response.ok) {
        console.log('⚠️ Next.js route failed, trying Python fallback...')
        response = await fetch('/api/python/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        result = await response.json()
      }

      if (response.ok) {
        setSubmitStatus('success')
        setStatusMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!')
        setFormData({ name: '', email: '', subject: '', message: '' }) // Reset form
        console.log('✅ Contact form sent successfully')
      } else {
        setSubmitStatus('error')
        setStatusMessage(result.error || 'Something went wrong. Please try again.')
        console.error('❌ Contact form failed:', result.error)
      }
    } catch (error) {
      console.error('❌ Contact form network error:', error)
      setSubmitStatus('error')
      setStatusMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions, feedback, or ideas? I'd love to hear from you! ReadmeArchitect is built by the community, for the community.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-black/40 border border-green-400/20 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/40 border border-green-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/40 border border-green-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/40 border border-green-400/30 rounded-lg text-white focus:outline-none focus:border-green-400 focus:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a topic</option>
                      <option value="General Feedback">General Feedback</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/40 border border-green-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-black/60 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Tell me about your experience with ReadmeArchitect, share your ideas, or ask any questions..."
                    ></textarea>
                  </div>

                  {/* Status Message */}
                  {submitStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        submitStatus === 'success'
                          ? 'bg-green-400/10 border-green-400/30 text-green-400'
                          : 'bg-red-400/10 border-red-400/30 text-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {submitStatus === 'success' ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <p className="text-sm">{statusMessage}</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="cube-loader-global cube-loader-inline">
                          <div className="cube-global"></div>
                          <div className="cube-global"></div>
                          <div className="cube-global"></div>
                          <div className="cube-global"></div>
                        </div>
                        <span className="ml-2">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center">
                    ✅ Contact form is now fully functional! You'll receive a confirmation email after submitting.
                  </p>
                </form>
              </div>
            </motion.section>

            {/* Contact Info */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Direct Contact */}
              <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Direct Contact</h2>
                
                <div className="space-y-4">
                  <motion.a
                    href="mailto:yadavdeepender65@gmail.com"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-black/40 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all"
                  >
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <p className="text-gray-400 text-sm">yadavdeepender65@gmail.com</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://github.com/Deepender25"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-black/40 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all"
                  >
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                      <Github className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">GitHub</h3>
                      <p className="text-gray-400 text-sm">@Deepender25</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://www.instagram.com/itsadi.art?igsh=NGthdzVkbTlzOXRr"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-black/40 border border-green-400/20 rounded-lg hover:border-green-400/40 transition-all"
                  >
                    <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Instagram</h3>
                      <p className="text-gray-400 text-sm">@itsadi.art</p>
                    </div>
                  </motion.a>
                </div>
              </div>

              {/* Response Times */}
              <div className="bg-black/40 border border-green-400/20 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Response Times</h3>
                </div>
                
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                    <span>General Inquiries</span>
                    <span className="text-green-400 font-semibold">24-48 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                    <span>Bug Reports</span>
                    <span className="text-green-400 font-semibold">12-24 hours</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                    <span>Feature Requests</span>
                    <span className="text-green-400 font-semibold">2-5 days</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Collaborations</span>
                    <span className="text-green-400 font-semibold">1-3 days</span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-black/40 border border-green-400/20 rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Project Details</h3>
                </div>
                
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-white font-medium mb-1">Open Source</h4>
                    <p className="text-sm">ReadmeArchitect is completely open source and available on GitHub.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Community Driven</h4>
                    <p className="text-sm">Built by developers, for developers. Your feedback shapes the future.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Always Improving</h4>
                    <p className="text-sm">Regular updates and new features based on community needs.</p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* FAQ Quick Links */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Quick Help</h2>
              <p className="text-gray-400">Looking for immediate answers? Check these resources first:</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "How to Use",
                  description: "Step-by-step guide to using ReadmeArchitect",
                  link: "/tutorials",
                  icon: "📖"
                },
                {
                  title: "Examples",
                  description: "See AutoDoc AI in action with real examples",
                  link: "/examples",
                  icon: "🎯"
                },
                {
                  title: "GitHub Issues",
                  description: "Report bugs or request features",
                  link: "https://github.com/Deepender25/Readme-Architect-AI/issues",
                  icon: "🐛"
                }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block bg-black/40 border border-green-400/20 rounded-xl p-6 hover:border-green-400/40 transition-all"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Community Note */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-400/20 to-green-600/20 border border-green-400/30 rounded-xl p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Built with Community in Mind</h2>
              </div>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                AutoDoc AI is more than just a tool – it's a community project. Every message, 
                suggestion, and piece of feedback helps make it better for everyone. 
                Don't hesitate to reach out, no matter how small your question might seem!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/Deepender25/Readme-Architect-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </motion.a>
                <motion.a
                  href="/about"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-green-400/50 text-green-400 hover:bg-green-400/10 font-semibold rounded-lg transition-all duration-300"
                >
                  Learn More About Us
                </motion.a>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </LayoutWrapper>
  )
}
