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
    <div className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-[#111111] px-8 py-24 w-full overflow-hidden">
      {/* Optimized Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static Grid Pattern - No Animation for Performance */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 120% 60% at 50% 100%, 
                rgba(0, 255, 136, 0.08) 0%, 
                rgba(0, 255, 136, 0.04) 40%, 
                rgba(0, 255, 136, 0.02) 60%, 
                transparent 80%),
              linear-gradient(to right, rgba(0, 255, 136, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 255, 136, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 100px 100px',
            backgroundPosition: '0 0, 0 0, 0 0',
          }} 
        />
        
        {/* Reduced Floating Particles - Only 8 for Performance */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-green-400/40 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${70 + (i % 3) * 10}%`
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Simplified Glow Effects */}
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-400/3 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-green-400/2 rounded-full blur-2xl opacity-40" />
        
        {/* Subtle Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-green-400/5 via-transparent to-transparent"
          animate={{
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 6,
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
                <Zap className="w-3 h-3 animate-pulse" />
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
                    className="group"
                  >
                    <Link
                      href={page.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-all duration-200 group-hover:translate-x-1"
                    >
                      <page.icon className="w-4 h-4 transition-all duration-200 group-hover:text-green-400 group-hover:scale-110" />
                      <span className="transition-all duration-200">
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
                  <Link
                    key={`social-${idx}`}
                    href={social.href}
                    className="w-12 h-12 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-400/50 hover:bg-green-400/10 hover:scale-110 hover:-translate-y-1 transition-all duration-200 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 transition-all duration-200 group-hover:scale-110" />
                  </Link>
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
            <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
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
      className="group inline-flex items-center relative hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-center gap-3">
        {/* Logo Icon */}
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:rotate-3 transition-transform duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <Code className="w-5 h-5 text-black relative z-10" />
          
          {/* Simple Sparkle Effect */}
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Logo Text */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white font-mono group-hover:text-green-100 transition-colors duration-200">
            AutoDoc AI
          </span>
          <span className="text-xs text-green-400 font-medium tracking-wider">
            README GENERATOR
          </span>
        </div>

        {/* Simple Animated Cursor */}
        <span className="text-green-400 text-2xl font-mono animate-pulse">
          _
        </span>
      </div>
    </Link>
  );
};