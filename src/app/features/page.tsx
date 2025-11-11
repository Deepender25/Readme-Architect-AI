"use client"

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Github, 
  FileText, 
  Sparkles,
  Code,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Rocket,
  Brain,
  Target,
  Layers,
  GitBranch,
  Download,
  Eye,
  Settings,
  Palette,
  Database,
  Lock,
  Workflow
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import LayoutWrapper from '@/components/layout-wrapper'
import PageHeader from '@/components/layout/page-header'
import ContentSection from '@/components/layout/content-section'
import { useRouter } from 'next/navigation'

function FeaturesContent() {
  const router = useRouter()

  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Advanced AI analyzes your codebase and generates comprehensive, contextual documentation in under 30 seconds.",
      color: "from-purple-400 to-pink-600",
      features: ["Instant Code Analysis", "Context Understanding", "Smart Suggestions", "Professional Formatting"]
    },
    {
      icon: Github,
      title: "GitHub Integration",
      description: "Seamlessly connect with your GitHub repositories. Generate READMEs directly from your code and save them back to your repos.",
      color: "from-blue-400 to-cyan-600",
      features: ["OAuth Authentication", "Repository Access", "Direct Commits", "Branch Management"]
    },
    {
      icon: Rocket,
      title: "Lightning Fast",
      description: "Generate professional documentation in under 30 seconds with 24/7 uptime. Save hours of manual work with our optimized AI.",
      color: "from-green-400 to-emerald-600",
      features: ["< 30s Generation", "Real-time Preview", "Instant Edits", "24/7 Availability"]
    },
    {
      icon: Palette,
      title: "Professional Output",
      description: "Generate clean, well-structured documentation that follows industry best practices and looks professional.",
      color: "from-orange-400 to-red-600",
      features: ["Clean Format", "Best Practices", "Markdown Output", "Professional Look"]
    },
    {
      icon: Target,
      title: "Smart Customization",
      description: "Fine-tune every aspect of your README with intelligent suggestions and customization options.",
      color: "from-indigo-400 to-purple-600",
      features: ["Custom Sections", "Style Options", "Content Control", "Brand Integration"]
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description: "Built for teams and organizations with security, privacy, and collaboration features you can trust.",
      color: "from-teal-400 to-blue-600",
      features: ["Security First", "Team Collaboration", "Private Repos", "Enterprise Support"]
    }
  ]

  const additionalFeatures = [
    {
      icon: Code,
      title: "Multi-Language Support",
      description: "Works with all major programming languages and frameworks"
    },
    {
      icon: Layers,
      title: "Smart Structure",
      description: "Automatically organizes content into logical sections"
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Track changes and maintain documentation history"
    },
    {
      icon: Download,
      title: "Easy Export",
      description: "Download your README as Markdown or copy to clipboard"
    },
    {
      icon: Eye,
      title: "Live Preview",
      description: "See your README as you build it with real-time preview"
    },
    {
      icon: Settings,
      title: "Advanced Settings",
      description: "Fine-tune generation parameters for perfect results"
    },
    {
      icon: Database,
      title: "History & Backup",
      description: "Never lose your work with automatic saving and history"
    },
    {
      icon: Lock,
      title: "Privacy Focused",
      description: "Your code stays private and secure throughout the process"
    },
    {
      icon: Workflow,
      title: "CI/CD Integration",
      description: "Integrate with your existing development workflow"
    }
  ]

  const stats = [
    { number: "AI", label: "Powered", icon: FileText },
    { number: "< 30s", label: "Generation Time", icon: Clock },
    { number: "24/7", label: "Available", icon: Shield },
    { number: "Free", label: "To Use", icon: Users }
  ]

  return (
    <LayoutWrapper>
      <PageHeader
        title="Everything You Need"
        description="ReadmeArchitect combines cutting-edge artificial intelligence with developer-friendly tools to create professional documentation in under 30 seconds."
        badge="Powerful Features"
        icon={Sparkles}
      />

      <ContentSection background="none" padding="none" className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="text-center p-6 glass-card"
            >
              <stat.icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </ContentSection>

      <ContentSection background="none" padding="none" className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              className="group relative"
            >
              <div className="glass-card p-8 overflow-hidden">
                {/* Gradient background */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{feature.description}</p>
                  
                  {/* Feature List */}
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, itemIndex) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 + itemIndex * 0.05 }}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ContentSection>

      <ContentSection background="none" padding="none" className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">And Much More</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover all the powerful features that make ReadmeArchitect the ultimate documentation tool.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="glass-card p-6 group"
            >
              <feature.icon className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </ContentSection>

      <ContentSection background="gradient" className="text-center">
        <div className="relative">
          <Zap className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start creating professional documentation for your projects with our AI-powered tool.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-green-500/40 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Creating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => router.push('/examples')}
              variant="outline"
              className="border-green-400/50 text-green-400 hover:bg-green-400/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:border-green-400"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Examples
            </Button>
          </div>
        </div>
      </ContentSection>
    </LayoutWrapper>
  )
}

export default function FeaturesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeaturesContent />
    </Suspense>
  )
}