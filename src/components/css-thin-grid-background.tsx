"use client"

export default function CSSThicGridBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base background with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 255, 136, 0.01) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)
          `
        }}
      />
      
      {/* Thin grid pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 0',
          animation: 'gridPulse 8s ease-in-out infinite'
        }}
      />
      
      {/* Dot intersections */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.15) 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
          animation: 'dotPulse 6s ease-in-out infinite'
        }}
      />
      
      {/* Subtle overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%)
          `
        }}
      />
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% {
            opacity: 0.4;
            transform: translate(0, 0);
          }
          50% {
            opacity: 0.6;
            transform: translate(2px, 2px);
          }
        }
        
        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
