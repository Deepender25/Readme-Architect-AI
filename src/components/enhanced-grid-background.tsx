'use client';

export default function EnhancedGridBackground() {
  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: -10,
        minHeight: '100vh',
        minWidth: '100vw',
        overflow: 'hidden'
      }}
    >
      {/* Base black background */}
      <div className="absolute inset-0 bg-black w-full h-full" />
      
      {/* Main grid pattern - enhanced visibility */}
      <div 
        className="absolute inset-0 opacity-40 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Secondary finer grid - enhanced visibility */}
      <div 
        className="absolute inset-0 opacity-25 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.18) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.18) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Dramatic fade overlay - creates random faded areas */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.8) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(0,0,0,0.7) 0%, transparent 35%),
            radial-gradient(circle at 60% 80%, rgba(0,0,0,0.6) 0%, transparent 45%),
            radial-gradient(circle at 15% 70%, rgba(0,0,0,0.5) 0%, transparent 30%),
            radial-gradient(ellipse at 90% 60%, rgba(0,0,0,0.4) 0%, transparent 50%),
            linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 20%, rgba(0,0,0,0.2) 60%, transparent 80%)
          `,
          zIndex: 2
        }}
      />
      
      {/* Highlight areas - subtle grid enhancement */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 40% 60%, rgba(0, 255, 136, 0.08) 0%, transparent 25%),
            radial-gradient(ellipse at 70% 30%, rgba(0, 255, 136, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 25% 85%, rgba(0, 255, 136, 0.05) 0%, transparent 20%)
          `,
          zIndex: 1
        }}
      />
      
      {/* Darken header area for better readability */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          zIndex: 3,
        }}
      />
    </div>
  );
}
