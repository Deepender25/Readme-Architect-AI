"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, Github, Instagram, Clock, Send, Heart, CheckCircle, AlertCircle } from 'lucide-react'
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
      let response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      let result = await response.json()

      if (!response.ok) {
        response = await fetch('/api/python/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        result = await response.json()
      }

      if (response.ok) {
        setSubmitStatus('success')
        setStatusMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
        setStatusMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setStatusMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <LayoutWrapper showBreadcrumbs={true} maxWidth="7xl">
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mb-6 shadow-2xl shadow-green-500/30">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or ideas? I'd love to hear from you! 
              <br className="hidden md:block" />
              ReadmeArchitect is built by the community, for the community.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            
            {/* Contact Form - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-green-400/20 rounded-2xl p-8 md:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Send a Message</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
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
                        className="w-full px-4 py-3.5 bg-black/50 border border-green-400/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all disabled:opacity-50"
                        placeholder="Your Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
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
                        className="w-full px-4 py-3.5 bg-black/50 border border-green-400/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all disabled:opacity-50"
                        placeholder="Your Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 bg-black/50 border border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all disabled:opacity-50"
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
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3.5 bg-black/50 border border-green-400/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all resize-none disabled:opacity-50"
                      placeholder="Tell me about your experience, share your ideas, or ask any questions..."
                    ></textarea>
                  </div>

                  {submitStatus !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        submitStatus === 'success'
                          ? 'bg-green-400/10 border-green-400/30 text-green-400'
                          : 'bg-red-400/10 border-red-400/30 text-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {submitStatus === 'success' ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium">{statusMessage}</p>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="cube-loader-global cube-loader-inline">
                          <div className="cube-global"></div>
                          <div className="cube-global"></div>
                          <div className="cube-global"></div>
                          <div className="cube-global"></div>
                        </div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar - Takes 1 column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Direct Contact */}
              <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-6">Direct Contact</h3>
                
                <div className="space-y-3">
                  <motion.a
                    href="mailto:yadavdeepender65@gmail.com"
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center gap-3 p-3 bg-black/40 border border-green-400/20 rounded-xl hover:border-green-400/40 hover:bg-black/60 transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                      <Mail className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">Email</p>
                      <p className="text-gray-400 text-xs truncate">yadavdeepender65@gmail.com</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://github.com/Deepender25"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center gap-3 p-3 bg-black/40 border border-green-400/20 rounded-xl hover:border-green-400/40 hover:bg-black/60 transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                      <Github className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">GitHub</p>
                      <p className="text-gray-400 text-xs">@Deepender25</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href="https://www.instagram.com/itsadi.art?igsh=NGthdzVkbTlzOXRr"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center gap-3 p-3 bg-black/40 border border-green-400/20 rounded-xl hover:border-green-400/40 hover:bg-black/60 transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                      <Instagram className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">Instagram</p>
                      <p className="text-gray-400 text-xs">@itsadi.art</p>
                    </div>
                  </motion.a>
                </div>
              </div>

              {/* Response Times */}
              <div className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Response Times</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: 'General Inquiries', time: '24-48h' },
                    { label: 'Bug Reports', time: '12-24h' },
                    { label: 'Feature Requests', time: '2-5 days' },
                    { label: 'Collaborations', time: '1-3 days' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-green-400/10 last:border-0">
                      <span className="text-gray-300 text-sm">{item.label}</span>
                      <span className="text-green-400 font-bold text-sm">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-400/30 rounded-3xl p-10 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-green-400" />
                <h2 className="text-3xl font-bold text-white">Built with Community in Mind</h2>
              </div>
              <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                ReadmeArchitect is more than just a tool – it's a community project. Every message, 
                suggestion, and piece of feedback helps make it better for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/Deepender25/Readme-Architect-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
