"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Code, GitBranch, Star, Zap } from 'lucide-react';
import ReadmeGeneratorFlow from '@/components/readme-generator-flow';
import ModernReadmeEditor from '@/components/modern-readme-editor';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

export default function SimpleCentered() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState('');

  const handleStartGeneration = () => {
    setShowGenerator(true);
  };

  const handleGenerationComplete = (readme: string) => {
    setGeneratedReadme(readme);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setShowGenerator(false);
    setGeneratedReadme('');
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans">
      <div 
        className="relative isolate px-6 pt-0 lg:px-8 overflow-hidden min-h-screen"
      >
        {/* Enhanced Background with Geometric Grid */}
        <div className="fixed inset-0 -z-10 overflow-hidden w-full h-full" style={{ minHeight: '100vh', minWidth: '100vw' }}>
          {/* Animated Geometric Grid */}
          <div className="absolute inset-0">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`h-line-${i}`}
                  className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                  style={{ top: `${i * 5}%` }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scaleX: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`v-line-${i}`}
                  className="absolute h-full w-px bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
                  style={{ left: `${i * 5}%` }}
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scaleY: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 4 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15
                  }}
                />
              ))}
            </div>

            {/* Geometric Shapes */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`hexagon-${i}`}
                className="absolute w-16 h-16 border border-green-400/30"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${20 + i * 8}%`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 12 + (i * 2),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}

            {/* Floating Code Elements */}
            {[
              { text: "const readme = '🚀 README.md'", top: '10%', left: '15%', delay: 0 },
              { text: "function generate() { return magic }", top: '25%', left: '70%', delay: 1 },
              { text: "export default Component", top: '60%', left: '20%', delay: 2 },
              { text: "import { AI } from '@readme/gen'", top: '75%', left: '75%', delay: 3 },
              { text: "// Powered by Gemini", top: '40%', left: '85%', delay: 1.5 },
              { text: "README.md ✨", top: '85%', left: '40%', delay: 2.5 }
            ].map((item, index) => (
              <motion.div
                key={`code-${index}`}
                className="absolute font-mono text-sm"
                style={{ top: item.top, left: item.left }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 5, 0],
                  opacity: [0.3, 0.7, 0.3],
                  filter: [
                    `drop-shadow(0 0 2px rgba(0, 255, 136, 0.3))`,
                    `drop-shadow(0 0 8px rgba(0, 255, 136, 0.6))`,
                    `drop-shadow(0 0 2px rgba(0, 255, 136, 0.3))`
                  ]
                }}
                transition={{
                  duration: 4 + (index % 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay
                }}
              >
                <span className="text-green-400/50">{item.text}</span>
              </motion.div>
            ))}

            {/* Floating Icons */}
            {[
              { icon: Github, size: 24, top: '15%', left: '85%', delay: 0 },
              { icon: Code, size: 20, top: '35%', left: '10%', delay: 1 },
              { icon: GitBranch, size: 22, top: '65%', left: '90%', delay: 2 },
              { icon: Star, size: 18, top: '80%', left: '15%', delay: 1.5 },
              { icon: Zap, size: 16, top: '50%', left: '50%', delay: 0.5 }
            ].map((item, index) => (
              <motion.div
                key={`icon-${index}`}
                className="absolute"
                style={{ top: item.top, left: item.left }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 8 + (index * 2),
                  repeat: Infinity,
                  ease: "linear",
                  delay: item.delay
                }}
              >
                <item.icon 
                  className="text-green-400/40" 
                  size={item.size}
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.5))'
                  }}
                />
              </motion.div>
            ))}

            {/* Reactive Energy Nodes */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`node-${i}`}
                className="absolute w-2 h-2 bg-green-400 rounded-full"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`
                }}
                animate={{
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.1, 1, 0.1],
                  boxShadow: [
                    '0 0 5px rgba(0, 255, 136, 0.5)',
                    '0 0 20px rgba(0, 255, 136, 1)',
                    '0 0 5px rgba(0, 255, 136, 0.5)'
                  ]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3
                }}
              />
            ))}

            {/* Central Geometric Mandala */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute inset-0 border border-green-400/20 rounded-full" />
              <div className="absolute inset-4 border border-green-400/30 rounded-full rotate-45" />
              <div className="absolute inset-8 border border-green-400/40 rounded-full -rotate-45" />
              <div className="absolute inset-12 border border-green-400/50 rounded-full" />
            </motion.div>



            {/* Enhanced Glow Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.3, 0.1],
                x: [-20, 20, -20],
                y: [-10, 10, -10]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.div
              className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-green-400/5 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.2, 0.05],
                x: [20, -20, 20],
                y: [10, -10, 10]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        <div className="mx-auto max-w-2xl py-8 sm:py-12 lg:py-16">
          <AnimatePresence mode="wait">
            {showEditor ? (
              <motion.div
                key="editor-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black"
              >
                <ModernReadmeEditor 
                  content={generatedReadme}
                  onClose={handleEditorClose}
                />
              </motion.div>
            ) : (
              <motion.div
                key="hero-content"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center !w-full !h-full"
              >
                <ScrollAnimatedDiv
                  delay={0}
                  duration={0.8}
                  yOffset={60}
                >
                  <motion.h1
                    className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      textShadow: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.2), 0 0 60px rgba(0, 255, 136, 0.1)'
                    }}>
                    Generate Perfect READMEs in Seconds
                  </motion.h1>
                </ScrollAnimatedDiv>
                
                <ScrollAnimatedDiv
                  delay={0.2}
                  duration={0.8}
                  yOffset={40}
                >
                  <motion.p
                    className="mt-6 text-lg font-medium text-gray-400 sm:text-xl/8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}>
                    Transform your repositories with AI-powered README generation. Just paste your GitHub URL and watch the magic happen.
                  </motion.p>
                </ScrollAnimatedDiv>
                
                <ScrollAnimatedDiv
                  delay={0.4}
                  duration={0.8}
                  yOffset={30}
                  className="mt-8"
                >
                  
                  {!showGenerator ? (
                    <div className="max-w-md mx-auto">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-[rgba(26,26,26,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartGeneration}
                            className="w-full px-6 py-4 bg-green-400 text-black font-semibold rounded-lg transition-all duration-300 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black text-lg"
                            style={{
                              boxShadow: '0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2)'
                            }}>
                            Start README Generation
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ReadmeGeneratorFlow onComplete={handleGenerationComplete} />
                  )}
                </ScrollAnimatedDiv>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}