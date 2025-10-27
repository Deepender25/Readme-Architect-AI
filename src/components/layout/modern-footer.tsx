'use client';

import { motion } from 'framer-motion';
import { Github, Instagram, Mail, Heart, FileText, Zap, Code2, Star, ArrowRight } from 'lucide-react';

export default function ModernFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: 'Features', href: '/features' },
      { name: 'Documentation', href: '/documentation' },
      { name: 'Examples', href: '/examples' }
    ],
    resources: [
      { name: 'GitHub', href: 'https://github.com/Deepender25/Readme-Architect-AI' },
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
    <footer className="relative mt-16 border-t border-green-400/20 bg-black/80 backdrop-blur-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-400/10 via-green-400/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand Section - Responsive spacing */}
            <div className="lg:col-span-5 mb-8 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Brand Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white">ReadmeArchitect</h3>
                    <p className="text-green-400 font-medium">README Generator</p>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-base leading-relaxed max-w-md">
                  Transform your repositories with AI-powered README generation. 
                  Create professional documentation in seconds with our advanced 
                  machine learning algorithms.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-bold text-lg">10K+</span>
                    <span className="text-gray-300 text-sm sm:text-base">READMEs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-bold text-lg">99%</span>
                    <span className="text-gray-300 text-sm sm:text-base">Accuracy</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 sm:gap-4">
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
                        className="p-2.5 sm:p-3 bg-green-400/10 border border-green-400/20 rounded-xl text-green-400 hover:bg-green-400/20 hover:border-green-400/40 transition-all duration-300 group"
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Navigation Links - Responsive layout */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-400" />
                  Navigation
                </h4>
                <ul className="space-y-4">
                  {footerLinks.navigation.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-base flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="font-bold text-white mb-6 text-lg">Resources</h4>
                <ul className="space-y-4">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-base flex items-center gap-2 group"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Fun Project */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="font-bold text-white mb-6 text-lg">Fun Project</h4>
                <ul className="space-y-4">
                  {footerLinks.funProject.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-base flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="py-6 sm:py-8 border-t border-green-400/20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Copyright */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
              <span className="font-medium">© {currentYear} ReadmeArchitect.</span>
              <div className="flex items-center gap-2">
                <span>Made with</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    color: ['#10b981', '#ef4444', '#10b981']
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </motion.div>
                <span>for developers</span>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center gap-4 sm:gap-8 text-gray-300 text-sm sm:text-base">
              <a 
                href="/privacy" 
                className="hover:text-green-400 transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="hover:text-green-400 transition-colors duration-300 font-medium"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}