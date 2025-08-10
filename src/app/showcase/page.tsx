"use client"

import { Suspense } from 'react'
import GitHubOAuthNavbar from '@/components/blocks/navbars/github-oauth-navbar'
import MinimalGridBackground from '@/components/minimal-geometric-background'
import { motion } from 'framer-motion'
import { 
  Star, 
  Github, 
  Users, 
  Heart,
  Trophy,
  Sparkles,
  Quote,
  ArrowRight,
  ExternalLink,
  GitBranch,
  Eye,
  Download,
  Code,
  Globe,
  Zap,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CenteredWithLogo } from '@/components/blocks/footers/centered-with-logo'
import { useSmoothNavigation } from '@/hooks/use-smooth-navigation'

function ShowcaseContent() {
  const { navigateWithPreload } = useSmoothNavigation()

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "AutoDoc AI transformed how we document our projects. What used to take hours now takes minutes, and the quality is consistently excellent.",
      rating: 5,
      project: "React Dashboard",
      stars: "2.3k"
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Engineer",
      company: "StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The GitHub integration is seamless. I can generate and commit professional READMEs directly from the platform. It's a game-changer for our workflow.",
      rating: 5,
      project: "Node.js API",
      stars: "1.8k"
    },
    {
      name: "Emily Watson",
      role: "Open Source Maintainer",
      company: "Independent",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "As someone who maintains multiple open source projects, AutoDoc AI has been invaluable. The AI understands context better than I expected.",
      rating: 5,
      project: "Python Library",
      stars: "4.2k"
    },
    {
      name: "David Kim",
      role: "DevOps Engineer",
      company: "CloudTech",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The templates are beautiful and professional. Our documentation now looks as good as our code performs. Highly recommended!",
      rating: 5,
      project: "Kubernetes Tools",
      stars: "3.1k"
    }
  ]

  const showcaseProjects = [
    {
      title: "AI-Powered Chat App",
      description: "Modern chat application with real-time messaging and AI integration",
      author: "Alex Thompson",
      language: "TypeScript",
      stars: "5.2k",
      forks: "892",
      color: "from-blue-400 to-cyan-600",
      tags: ["React", "Socket.io", "AI", "Real-time"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop"
    },
    {
      title: "Blockchain Wallet",
      description: "Secure cryptocurrency wallet with multi-chain support",
      author: "Maria Garcia",
      language: "Rust",
      stars: "3.8k",
      forks: "654",
      color: "from-orange-400 to-red-600",
      tags: ["Blockchain", "Security", "Crypto", "Web3"],
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop"
    },
    {
      title: "ML Model Trainer",
      description: "Automated machine learning pipeline for model training and deployment",
      author: "Dr. James Wilson",
      language: "Python",
      stars: "7.1k",
      forks: "1.2k",
      color: "from-green-400 to-emerald-600",
      tags: ["Machine Learning", "Python", "AI", "Automation"],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud infrastructure management platform",
      author: "Team DevOps",
      language: "Go",
      stars: "2.9k",
      forks: "445",
      color: "from-purple-400 to-pink-600",
      tags: ["DevOps", "Cloud", "Infrastructure", "Kubernetes"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop"
    },
    {
      title: "Mobile Game Engine",
      description: "Cross-platform game engine optimized for mobile devices",
      author: "GameDev Studio",
      language: "C++",
      stars: "4.6k",
      forks: "789",
      color: "from-indigo-400 to-purple-600",
      tags: ["Game Dev", "Mobile", "C++", "Graphics"],
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop"
    },
    {
      title: "E-commerce Platform",
      description: "Full-featured e-commerce solution with modern architecture",
      author: "Commerce Team",
      language: "JavaScript",
      stars: "6.3k",
      forks: "1.1k",
      color: "from-teal-400 to-blue-600",
      tags: ["E-commerce", "Full-stack", "React", "Node.js"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop"
    }
  ]

  const achievements = [
    {
      icon: Users,
      title: "50,000+",
      subtitle: "Active Users",
      description: "Developers worldwide trust AutoDoc AI"
    },
    {
      icon: Github,
      title: "100,000+",
      subtitle: "READMEs Generated",
      description: "Professional documentation created"
    },
    {
      icon: Star,
      title: "4.9/5",
      subtitle: "Average Rating",
      description: "Based on user feedback"
    },
    {
      icon: Globe,
      title: "150+",
      subtitle: "Countries",
      description: "Global developer community"
    }
  ]

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <MinimalGridBackground />
      </div>
      
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GitHubOAuthNavbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-20"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-400 text-sm font-medium mb-6"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(0, 255, 136, 0.3)',
                    '0 0 20px rgba(0, 255, 136, 0.5)',
                    '0 0 0px rgba(0, 255, 136, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-4 h-4" />
                Community Showcase
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-green-400 to-white bg-clip-text text-transparent mb-6">
                Success Stories
              </h1>
              
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Discover how developers worldwide are using AutoDoc AI to create amazing documentation 
                and build better projects. Join our thriving community of creators.
              </p>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="text-center p-6 bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] group hover:border-green-400/30 transition-all duration-300"
                >
                  <achievement.icon className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-white mb-1">{achievement.title}</div>
                  <div className="text-sm font-medium text-green-400 mb-2">{achievement.subtitle}</div>
                  <div className="text-xs text-gray-400">{achievement.description}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Featured Projects */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Amazing projects built by our community, all with beautiful READMEs generated by AutoDoc AI.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {showcaseProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="group relative"
                  >
                    <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden hover:border-green-400/30 transition-all duration-300">
                      {/* Gradient background */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                      
                      <div className="relative">
                        {/* Project Image */}
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                {project.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <span>by {project.author}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Code className="w-3 h-3" />
                                  {project.language}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                {project.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitBranch className="w-4 h-4" />
                                {project.forks}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-400 hover:bg-green-400/10"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">What Developers Say</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Real feedback from developers who have transformed their documentation workflow.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.1)] p-8 hover:border-green-400/30 transition-all duration-300"
                  >
                    <Quote className="w-8 h-8 text-green-400 mb-4" />
                    
                    <p className="text-gray-300 leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full border border-green-400/30"
                        />
                        <div>
                          <div className="font-semibold text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-400">{testimonial.role}</div>
                          <div className="text-xs text-green-400">{testimonial.company}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">{testimonial.project}</div>
                        <div className="text-xs text-green-400">{testimonial.stars} stars</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center"
            >
              <div className="bg-[rgba(26,26,26,0.7)] backdrop-blur-xl rounded-3xl border border-[rgba(255,255,255,0.1)] p-12 relative overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl blur-lg opacity-20" />
                <div className="relative">
                  <Rocket className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Join the Community
                  </h2>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Be part of the next generation of developers creating amazing documentation. 
                    Your project could be featured here next!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigateWithPreload('/')}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Start Creating
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <Button
                      onClick={() => navigateWithPreload('/features')}
                      variant="outline"
                      className="border-green-400/50 text-green-400 hover:bg-green-400/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:border-green-400"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <CenteredWithLogo />
      </div>
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShowcaseContent />
    </Suspense>
  )
}