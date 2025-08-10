"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Code, GitBranch, Star, Zap, BrainCircuit, Bot, Wand2 } from 'lucide-react';
import ReadmeGeneratorFlow from '@/components/readme-generator-flow';
import ModernReadmeOutput from '@/components/modern-readme-output';
import { ScrollAnimatedDiv } from '@/components/ui/scroll-animated-div';

const PlexusBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: any[] = [];
    const particleCount = 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 0.4 - 0.2,
          vy: Math.random() * 0.4 - 0.2,
          radius: 1.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
        ctx.fill();
      }

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 136, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10" />;
};

export default function SimpleCentered() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [generationParams, setGenerationParams] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const repoParam = urlParams.get('repo');
      if (repoParam) {
        setShowGenerator(true);
      }
    }
  }, []);

  const handleStartGeneration = () => setShowGenerator(true);

  const handleGenerationComplete = (readme: string, repoUrl: string, projName: string, genParams: any) => {
    setGeneratedReadme(readme);
    setRepositoryUrl(repoUrl);
    setProjectName(projName);
    setGenerationParams(genParams);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setShowGenerator(false);
    setGeneratedReadme('');
    setRepositoryUrl('');
    setProjectName('');
    setGenerationParams({});
  };

  const features = [
    {
      icon: <BrainCircuit size={28} className="text-green-400" />,
      title: 'AI-Powered Analysis',
      description: 'Our AI delves deep into your codebase to understand its structure, dependencies, and purpose.',
      image: 'https://placehold.co/600x400/0a0a0a/00ff88?text=Code+Analysis',
    },
    {
      icon: <Bot size={28} className="text-green-400" />,
      title: 'Automated Generation',
      description: 'Generate a complete, professional README.md file in seconds, saving you time and effort.',
      image: 'https://placehold.co/600x400/0a0a0a/00ff88?text=README+Generation',
    },
    {
      icon: <Wand2 size={28} className="text-green-400" />,
      title: 'Live Editor',
      description: 'A beautiful, modern interface with a live editor to tweak and perfect your generated README.',
      image: 'https://placehold.co/600x400/0a0a0a/00ff88?text=Live+Editor',
    },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white">
      <PlexusBackground />
      <div className="relative isolate px-6 pt-0 lg:px-8 min-h-screen flex flex-col justify-center">
        <div className="mx-auto max-w-4xl py-12 sm:py-16 lg:py-20">
          <AnimatePresence mode="wait">
            {showEditor ? (
              <motion.div
                key="editor-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg"
              >
                <ModernReadmeOutput 
                  content={generatedReadme}
                  repositoryUrl={repositoryUrl}
                  projectName={projectName}
                  generationParams={generationParams}
                  onClose={handleEditorClose}
                />
              </motion.div>
            ) : (
              <motion.div
                key="hero-content"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <ScrollAnimatedDiv delay={0} duration={0.8} yOffset={60}>
                  <motion.h1
                    className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
                    style={{ textShadow: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.2)' }}
                  >
                    Generate Perfect READMEs in Seconds
                  </motion.h1>
                </ScrollAnimatedDiv>
                
                <ScrollAnimatedDiv delay={0.2} duration={0.8} yOffset={40}>
                  <motion.p className="mt-6 text-lg font-medium text-gray-300 sm:text-xl/8 max-w-2xl mx-auto">
                    Transform your repositories with AI-powered README generation. Just paste your GitHub URL and watch the magic happen.
                  </motion.p>
                </ScrollAnimatedDiv>
                
                <ScrollAnimatedDiv delay={0.4} duration={0.8} yOffset={30} className="mt-10">
                  {!showGenerator ? (
                    <div className="max-w-md mx-auto">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartGeneration}
                            className="w-full px-6 py-4 bg-green-500 text-black font-semibold rounded-lg transition-all duration-300 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black text-lg"
                            style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' }}
                          >
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

        {!showGenerator && !showEditor && (
          <div className="w-full max-w-6xl mx-auto mt-20 mb-10">
            <ScrollAnimatedDiv delay={0.6} duration={0.8} yOffset={50}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-left overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <img src={feature.image} alt={feature.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollAnimatedDiv>
          </div>
        )}
      </div>
    </div>
  );
}