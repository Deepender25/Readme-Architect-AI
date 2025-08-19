'use client';

export default function EnhancedGridBackground() {
  return (
    <div 
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: -10 }}
    >
      {/* Base black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Main grid pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'moveGrid 20s linear infinite',
        }}
      />
      
      {/* Secondary finer grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.2) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.2) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '20px 20px',
          animation: 'moveGrid 30s linear infinite reverse',
        }}
      />
      
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />
    </div>
  );
}
