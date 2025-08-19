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
      
      {/* Main grid pattern - no animation */}
      <div 
        className="absolute inset-0 opacity-20 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Secondary finer grid - no animation */}
      <div 
        className="absolute inset-0 opacity-10 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Darken header area for better readability */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />
    </div>
  );
}
