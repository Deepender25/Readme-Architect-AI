"use client";

import { motion } from 'framer-motion';
import { Github, Code, GitBranch, Star, Zap, FileText, Bot, Sparkles, Terminal, Cpu } from 'lucide-react';

export default function AnimatedGeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dynamic Grid System */}
      <div className="absolute inset-0">
        {/* Horizontal Grid Lines */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`h-line-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/15 to-transparent"
            style={{ top: `${i * 4}%` }}
            animate={{
              opacity: [0.05, 0.4, 0.05],
              scaleX: [0.6, 1.2, 0.6],
              x: ['-10%', '10%', '-10%']
            }}
            transition={{
              duration: 6 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
        
        {/* Vertical Grid Lines */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`v-line-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-green-400/15 to-transparent"
            style={{ left: `${i * 4}%` }}
            animate={{
              opacity: [0.05, 0.4, 0.05],
              scaleY: [0.6, 1.2, 0.6],
              y: ['-10%', '10%', '-10%']
            }}
            transition={{
              duration: 7 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute border border-green-400/25"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${15 + (i * 6)}%`,
            width: `${20 + (i % 3) * 10}px`,
            height: `${20 + (i % 3) * 10}px`,
            clipPath: i % 3 === 0 
              ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' // Hexagon
              : i % 3 === 1 
              ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
              : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' // Octagon
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.4, 0.8],
            opacity: [0.1, 0.6, 0.1],
            x: [0, 20, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 15 + (i * 2),
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Enhanced Floating Code Snippets */}
      {[
        { text: "# 🚀 Awesome Project", top: '8%', left: '12%', delay: 0, size: 'text-lg' },
        { text: "const ai = new ReadmeGenerator()", top: '22%', left: '75%', delay: 1, size: 'text-sm' },
        { text: "## Installation", top: '35%', left: '8%', delay: 2, size: 'text-base' },
        { text: "npm install awesome-readme", top: '48%', left: '82%', delay: 1.5, size: 'text-sm' },
        { text: "### Features ✨", top: '62%', left: '15%', delay: 3, size: 'text-base' },
        { text: "export { magic } from './ai'", top: '75%', left: '70%', delay: 2.5, size: 'text-sm' },
        { text: "## Contributing 🤝", top: '88%', left: '25%', delay: 4, size: 'text-base' },
        { text: "git commit -m 'feat: ✨'", top: '18%', left: '45%', delay: 0.8, size: 'text-xs' },
        { text: "[![Build Status]", top: '42%', left: '55%', delay: 3.2, size: 'text-xs' },
        { text: "## License MIT", top: '68%', left: '88%', delay: 1.8, size: 'text-sm' }
      ].map((item, index) => (
        <motion.div
          key={`code-${index}`}
          className={`absolute font-mono ${item.size} select-none pointer-events-none`}
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -20, 0],
            x: [0, 8, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.9, 1.1, 0.9],
            filter: [
              `drop-shadow(0 0 3px rgba(0, 255, 136, 0.3))`,
              `drop-shadow(0 0 12px rgba(0, 255, 136, 0.7))`,
              `drop-shadow(0 0 3px rgba(0, 255, 136, 0.3))`
            ]
          }}
          transition={{
            duration: 5 + (index % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay
          }}
        >
          <span className="text-green-400/60 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
            {item.text}
          </span>
        </motion.div>
      ))}

      {/* Tech Icons Constellation */}
      {[
        { icon: Github, size: 28, top: '12%', left: '88%', delay: 0 },
        { icon: Code, size: 24, top: '28%', left: '5%', delay: 1 },
        { icon: GitBranch, size: 26, top: '45%', left: '92%', delay: 2 },
        { icon: Star, size: 22, top: '65%', left: '3%', delay: 1.5 },
        { icon: Zap, size: 20, top: '82%', left: '85%', delay: 0.5 },
        { icon: FileText, size: 24, top: '15%', left: '25%', delay: 2.5 },
        { icon: Bot, size: 26, top: '55%', left: '25%', delay: 1.8 },
        { icon: Sparkles, size: 22, top: '38%', left: '35%', delay: 3 },
        { icon: Terminal, size: 24, top: '72%', left: '45%', delay: 0.8 },
        { icon: Cpu, size: 20, top: '25%', left: '60%', delay: 2.2 }
      ].map((item, index) => (
        <motion.div
          key={`icon-${index}`}
          className="absolute select-none pointer-events-none"
          style={{ top: item.top, left: item.left }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 10 + (index * 1.5),
            repeat: Infinity,
            ease: "linear",
            delay: item.delay
          }}
        >
          <item.icon 
            className="text-green-400/50" 
            size={item.size}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(0, 255, 136, 0.6))'
            }}
          />
        </motion.div>
      ))}

      {/* Energy Particles System */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-green-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            scale: [0.3, 2, 0.3],
            opacity: [0.1, 1, 0.1],
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            boxShadow: [
              '0 0 3px rgba(0, 255, 136, 0.5)',
              '0 0 15px rgba(0, 255, 136, 1)',
              '0 0 3px rgba(0, 255, 136, 0.5)'
            ]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Central Neural Network */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: [0, 360],
          scale: [0.9, 1.2, 0.9],
          opacity: [0.1, 0.4, 0.1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Concentric circles */}
        <div className="absolute inset-0 border border-green-400/15 rounded-full" />
        <div className="absolute inset-8 border border-green-400/25 rounded-full rotate-45" />
        <div className="absolute inset-16 border border-green-400/35 rounded-full -rotate-45" />
        <div className="absolute inset-24 border border-green-400/45 rounded-full rotate-90" />
        <div className="absolute inset-32 border border-green-400/55 rounded-full -rotate-90" />
        
        {/* Center pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-green-400 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 10px rgba(0, 255, 136, 0.5)',
              '0 0 30px rgba(0, 255, 136, 1)',
              '0 0 10px rgba(0, 255, 136, 0.5)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Ambient Glow Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-green-400/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.4, 0.1],
          x: [-30, 30, -30],
          y: [-20, 20, -20]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] bg-green-400/6 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.3, 0.05],
          x: [30, -30, 30],
          y: [20, -20, 20]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-green-400/4 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.2, 0.03],
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Data Flow Lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`flow-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent"
          style={{
            top: `${20 + i * 15}%`,
            left: '0%',
            width: '100%',
            transform: `rotate(${i * 30}deg)`,
            transformOrigin: 'center'
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scaleX: [0, 1, 0],
            x: ['-100%', '100%', '-100%']
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5
          }}
        />
      ))}
    </div>
  );
}