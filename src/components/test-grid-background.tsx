'use client';

export default function TestGridBackground() {
  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{ 
        zIndex: 1,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Red tint for debugging
        backgroundImage: `
          linear-gradient(rgba(0, 255, 136, 1) 2px, transparent 2px),
          linear-gradient(90deg, rgba(0, 255, 136, 1) 2px, transparent 2px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}
