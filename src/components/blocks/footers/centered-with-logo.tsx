"use client"

import { cn } from "@/lib/utils";
import { Github, Twitter, Mail, ExternalLink, Code, Star, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollAnimatedDiv } from "@/components/ui/scroll-animated-div";

export function CenteredWithLogo() {
  const pages = [
    {
      title: "Features",
      href: "#",
      icon: Star
    },
    {
      title: "Pricing", 
      href: "#",
      icon: Zap
    },
    {
      title: "Documentation",
      href: "#",
      icon: Code
    },
    {
      title: "GitHub",
      href: "#",
      icon: Github
    },
    {
      title: "Support",
      href: "#",
      icon: Heart
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  return (
    <div className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-[#0f0f0f] px-8 py-24 w-full overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(ellipse 150% 80% at 50% 100%, 
              rgba(0, 255, 136, 0.12) 0%, 
              rgba(0, 255, 136, 0.06) 30%, 
              rgba(0, 255, 136, 0.03) 50%, 
              transparent 70%),
            linear-gradient(to right, rgba(0, 255, 136, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 80px 80px',
          backgroundPosition: '0 0, 0 0, 0 0',
        }} />
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${60 + Math.random() * 40}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Glow Orbs */}
        <motion.div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [-30, 30, -30]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-400/3 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [30, -30, 30]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Logo and Description */}
          <ScrollAnimatedDiv
            delay={0}
            duration={0.8}
            yOffset={60}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <Logo />
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Transform your repositories with AI-powered README generation. 
                Built for developers who value quality documentation.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-3 h-3" />
                </motion.div>
                <span>Powered by GPT-4</span>
              </div>
            </div>
          </ScrollAnimatedDiv>

          {/* Navigation Links */}
          <ScrollAnimatedDiv
            delay={0.2}
            duration={0.8}
            yOffset={60}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg">Quick Links</h3>
              <ul className="space-y-4">
                {pages.map((page, idx) => (
                  <motion.li 
                    key={`page-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      href={page.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-all duration-300 group"
                    >
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <page.icon className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
                      </motion.div>
                      <span className="group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]">
                        {page.title}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollAnimatedDiv>

          {/* Social Links and CTA */}
          <ScrollAnimatedDiv
            delay={0.4}
            duration={0.8}
            yOffset={60}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-lg">Connect</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <motion.div
                    key={`social-${idx}`}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 5,
                      y: -5
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      href={social.href}
                      className="w-12 h-12 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-400/50 hover:bg-green-400/10 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">Stay updated with new features</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-400 focus:bg-[rgba(255,255,255,0.08)] transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </div>
          </ScrollAnimatedDiv>
        </div>

        {/* Animated Divider */}
        <ScrollAnimatedDiv
          delay={0.6}
          duration={0.8}
          yOffset={30}
        >
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </ScrollAnimatedDiv>

        {/* Bottom Section */}
        <ScrollAnimatedDiv
          delay={0.8}
          duration={0.8}
          yOffset={30}
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© 2024 AutoDoc AI. Built with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </motion.div>
            <span>for developers.</span>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </ScrollAnimatedDiv>
      </div>
    </div>
  );
}



const Logo = () => {
  return (
    <Link
      href="/"
      className="group inline-flex items-center relative"
    >
      <motion.div
        className="flex items-center gap-3"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {/* Logo Icon */}
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center relative overflow-hidden"
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          <Code className="w-5 h-5 text-black relative z-10" />
          
          {/* Sparkle Effect */}
          <motion.div
            className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
          />
        </motion.div>

        {/* Logo Text */}
        <div className="flex flex-col">
          <motion.span
            className="text-2xl font-bold text-white font-mono"
            whileHover={{
              textShadow: "0 0 20px rgba(0, 255, 136, 0.8)",
            }}
            transition={{ duration: 0.3 }}
          >
            AutoDoc AI
          </motion.span>
          <motion.span
            className="text-xs text-green-400 font-medium tracking-wider"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            README GENERATOR
          </motion.span>
        </div>

        {/* Animated Cursor */}
        <motion.span
          className="text-green-400 text-2xl font-mono"
          animate={{
            opacity: [1, 0, 1],
            textShadow: [
              "0 0 10px rgba(0, 255, 136, 0.8)", 
              "0 0 20px rgba(0, 255, 136, 1)",
              "0 0 10px rgba(0, 255, 136, 0.8)"
            ],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          _
        </motion.span>
      </motion.div>
    </Link>
  );
};