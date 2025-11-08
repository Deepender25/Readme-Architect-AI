'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Info } from 'lucide-react';
import { useEffect } from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, userName }: LogoutModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with professional animation */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />

          {/* Modal with professional animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.4,
              ease: [0, 0, 0.2, 1], // Decelerate curve
            }}
            className="modal-content relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity',
            }}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sign Out</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Are you sure you want to sign out{userName ? ` as ${userName}` : ''}?
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="px-6 pb-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-400 mt-0.5">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-300 mb-1">Quick Sign-In Next Time</h4>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      We'll remember your account and give you the option to continue with it or use a different GitHub account when you sign back in.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-2 bg-gray-800/50">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                }}
                whileTap={{ 
                  scale: 0.98,
                  y: 0,
                  transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
                }}
                onClick={onClose}
                className="btn-professional flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-xl"
                style={{
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden',
                }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                }}
                whileTap={{ 
                  scale: 0.98,
                  y: 0,
                  transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
                }}
                onClick={onConfirm}
                className="btn-professional flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl"
                style={{
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}