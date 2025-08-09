import React, { useMemo } from 'react';

const Background: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${25 + Math.random() * 20}s`,
      animationDelay: `${Math.random() * -45}s`,
      size: `${Math.floor(1 + Math.random() * 3)}px`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Static Glows */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-[50vw] h-[50vw] -translate-x-1/3 top-[-20%] left-[-10%] bg-accent-start/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[40vw] h-[40vw] translate-x-1/3 bottom-[-20%] right-[-10%] bg-accent-end/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Floating Particles */}
      <div className="absolute top-0 left-0 w-full h-full">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-white/90 animate-particle-float" style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.animationDuration, animationDelay: p.animationDelay }} />
        ))}
      </div>
    </div>
  );
};

export default Background;