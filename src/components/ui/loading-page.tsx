'use client';

import { motion } from 'framer-motion';

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="container mb-6 relative">
          <div className="loader" />
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-green-400 text-lg"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
