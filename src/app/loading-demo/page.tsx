'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GridLoadingAnimation, GridLoader } from '@/components/ui/grid-loading-animation';
import { CubeLoader } from '@/components/ui/cube-loader';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import LoadingPage from '@/components/ui/loading-page';
import { 
  PageLoader, 
  InlineLoader, 
  ButtonLoader, 
  ModalLoader, 
  OverlayLoader,
  LoadingWrapper,
  useLoadingState
} from '@/utils/loading-utils';

export default function LoadingDemoPage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, startLoading, stopLoading } = useLoadingState();

  const handleTestLoading = () => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-green-400/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-green-400">Loading Animation Demo</h1>
          <p className="text-gray-400 mt-2">Testing all grid-based loading animations</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        
        {/* Size Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Grid Loading Animation Sizes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Small</h3>
              <GridLoadingAnimation size="sm" showMessage message="Small loader" />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Medium</h3>
              <GridLoadingAnimation size="md" showMessage message="Medium loader" />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Large</h3>
              <GridLoadingAnimation size="lg" showMessage message="Large loader" />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">XL</h3>
              <GridLoadingAnimation size="xl" showMessage message="XL loader" />
            </div>
          </div>
        </section>

        {/* Speed Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Animation Speeds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Slow</h3>
              <GridLoadingAnimation size="md" speed="slow" intensity={3} />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Normal</h3>
              <GridLoadingAnimation size="md" speed="normal" intensity={3} />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Fast</h3>
              <GridLoadingAnimation size="md" speed="fast" intensity={3} />
            </div>
          </div>
        </section>

        {/* Intensity Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Animation Intensity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((intensity) => (
              <div key={intensity} className="glass p-6 text-center">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Level {intensity}</h3>
                <GridLoadingAnimation size="md" intensity={intensity as 1|2|3|4|5} />
              </div>
            ))}
          </div>
        </section>

        {/* Updated Legacy Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Updated Legacy Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">CubeLoader</h3>
              <CubeLoader size="md" showMessage message="Cube Loader" />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">LoadingAnimation</h3>
              <LoadingAnimation size="md" message="Loading Animation" />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Inline CubeLoader</h3>
              <div className="flex justify-center">
                <CubeLoader size="inline" showMessage message="Loading..." />
              </div>
            </div>
          </div>
        </section>

        {/* Utility Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Utility Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Page Loader</h3>
              <PageLoader message="Loading page..." />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Modal Loader</h3>
              <ModalLoader message="Processing..." />
            </div>
            <div className="glass p-6 text-center">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Inline Loader</h3>
              <div className="flex items-center justify-center gap-3">
                <InlineLoader />
                <span className="text-gray-300">Loading data...</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Tests */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Interactive Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Loading Wrapper Test */}
            <div className="glass p-6">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Loading Wrapper</h3>
              <button
                onClick={handleTestLoading}
                className="mb-4 px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-300 transition-colors"
              >
                Test 3s Loading
              </button>
              <LoadingWrapper loading={loading} context="modal" message="Loading wrapper test...">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-green-400">Content loaded successfully!</p>
                  <p className="text-sm text-gray-400 mt-2">This content shows when not loading</p>
                </div>
              </LoadingWrapper>
            </div>

            {/* Modal Test */}
            <div className="glass p-6">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Modal Loader</h3>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-300 transition-colors"
              >
                Show Modal
              </button>
              {showModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => setShowModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass p-8 m-4 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <ModalLoader message="Processing modal content..." />
                      <button
                        onClick={() => setShowModal(false)}
                        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Overlay Test */}
            <div className="glass p-6">
              <h3 className="text-sm font-medium mb-4 text-gray-300">Overlay Loader</h3>
              <button
                onClick={() => setShowOverlay(true)}
                className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-300 transition-colors"
              >
                Show Overlay
              </button>
              {showOverlay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setShowOverlay(false)}
                >
                  <div className="text-center">
                    <OverlayLoader message="Full screen loading overlay..." />
                    <button
                      onClick={() => setShowOverlay(false)}
                      className="mt-6 px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-300 transition-colors"
                    >
                      Close Overlay
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Button Loading States */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400 border-b border-green-400/20 pb-2">
            Button Loading States
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 px-4 py-2 bg-green-400 text-black rounded-lg">
              <ButtonLoader />
              Loading Button
            </button>
            <button className="flex items-center gap-3 px-6 py-3 bg-gray-700 text-white rounded-lg">
              <InlineLoader />
              Processing...
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg">
              <GridLoader size="sm" />
              Large Button Loading
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
