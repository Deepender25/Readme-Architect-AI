'use client';

import { motion } from 'framer-motion';
import { Github, Instagram, Mail, Heart, FileText, Zap, Code2, Star, Clock } from 'lucide-react';

export default function ModernFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: 'Features', href: '/features' },
      { name: 'Documentation', href: '/documentation' },
      { name: 'Examples', href: '/examples' }
    ],
    pricing: [
      { name: 'Pricing', href: '/pricing', comingSoon: true }
    ],
    resources: [
      { name: 'GitHub', href: 'https://github.com/Deepender25/Readme-Architect-AI' },
      { name: 'API Reference', href: '/docs/api', comingSoon: true },
      { name: 'Tutorials', href: '/tutorials' },
      { name: 'Blog', href: '/blog' }
    ],
    funProject: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/Deepender25' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/itsadi.art?igsh=NGthdzVkbTlzOXRr' },
    { name: 'Email', icon: Mail, href: 'mailto:yadavdeepender65@gmail.com' }
  ];

  return (
    <footer className="relative border-t border-green-400/20 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-green-400/5 to-transparent" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">AutoDoc AI</h3>
                  <p className="text-sm text-green-400">README Generator</p>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md"
              >
                Transform your repositories with AI-powered README generation. 
                Create professional documentation in seconds with our advanced 
                machine learning algorithms.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-6 mb-6"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">10K+</span>
                  <span className="text-gray-400">READMEs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">99%</span>
                  <span className="text-gray-400">Accuracy</span>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-green-400/10 border border-green-400/20 rounded-lg text-green-400 hover:bg-green-400/20 hover:border-green-400/40 transition-all duration-300"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-8 lg:col-span-3">
              {/* Navigation Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-green-400" />
                  Navigation
                </h4>
                <ul className="space-y-3">
                  {footerLinks.navigation.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Pricing Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  Pricing
                </h4>
                <ul className="space-y-3">
                  {footerLinks.pricing.map((link) => (
                    <li key={link.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">
                          {link.name}
                        </span>
                        {link.comingSoon && (
                          <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <div className="flex items-center gap-2">
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm"
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {link.name}
                        </a>
                        {link.comingSoon && (
                          <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Fun Project Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="font-semibold text-white mb-4">Fun Project</h4>
                <ul className="space-y-3">
                  {footerLinks.funProject.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-6 border-t border-green-400/20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} AutoDoc AI. Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#10b981', '#ef4444', '#10b981']
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
              <span>for developers</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-green-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}