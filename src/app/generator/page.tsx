"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ModernNavbar from '@/components/layout/modern-navbar';
import ModernFooter from '@/components/layout/modern-footer';
import ReadmeGeneratorFlow from '@/components/readme-generator-flow';

function GeneratorContent() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerationComplete = async (readme: string, repoUrl: string, projName: string, genParams: any) => {
    // Store the README data in sessionStorage for the output page
    const readmeData = {
      content: readme,
      repositoryUrl: repoUrl,
      projectName: projName,
      generationParams: genParams,
      createdAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('readme-output-data', JSON.stringify(readmeData));
    
    // Auto-save to history for authenticated users
    try {
      console.log('💾 Auto-saving README to history...');
      
      // Generate a unique session ID for this generation
      const sessionId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repository_url: repoUrl,
          repository_name: projName || repoUrl.split('/').pop() || 'Unknown',
          project_name: projName,
          readme_content: readme,
          generation_params: genParams,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        console.log('✅ README auto-saved to history successfully');
      } else {
        const errorData = await response.json();
        console.warn('⚠️ Failed to auto-save README to history:', errorData.error);
      }
    } catch (error) {
      console.error('❌ Error auto-saving to history:', error);
    }
    
    // Redirect to the README output page
    router.push('/output');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="cube-loading-container">
          <div className="flex flex-col items-center">
            <div className="cube-loader-global">
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-400 text-lg font-medium">Loading Generator...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-[99999]">
        <ModernNavbar />
      </div>

      {/* Main Content - Centered with proper padding for all screen sizes */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="w-full max-w-4xl mx-auto flex flex-col justify-center flex-1 space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium glow-green"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Documentation
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal leading-tight text-white px-4"
              style={{ 
                textShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.2)',
                background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))'
              }}
            >
              Generate Perfect <span className="text-green-400">READMEs</span> in Seconds
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Transform your repositories with AI-powered README generation.
              <br className="hidden sm:block" />
              Just paste your GitHub URL and watch the magic happen.
            </motion.p>
          </div>

          {/* Generator Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full"
          >
            <ReadmeGeneratorFlow onComplete={handleGenerationComplete} />
          </motion.div>
        </div>
      </div>

      {/* Footer - Visible on scroll */}
      <div className="relative z-10 mt-auto">
        <ModernFooter />
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="cube-loading-container">
          <div className="flex flex-col items-center">
            <div className="cube-loader-global">
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
              <div className="cube-global"></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-green-400 text-lg font-medium">Loading Generator...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <GeneratorContent />
    </Suspense>
  );
}
