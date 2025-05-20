
import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-0">
        {/* Generate animated lines */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className={`absolute border-t border-dashed ${index % 2 === 0 ? 'border-accent/20' : 'border-primary/20'} 
            animate-line-movement`}
            style={{
              top: `${(index + 1) * 10}%`,
              left: 0,
              right: 0,
              animationDelay: `${index * 0.5}s`,
              height: '1px'
            }}
          />
        ))}
        
        {/* Generate animated dots */}
        {Array.from({ length: 20 }).map((_, index) => (
          <div 
            key={`dot-${index}`} 
            className="absolute rounded-full animate-pulse-slow bg-accent/20"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Network connecting lines */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={`network-${index}`} 
            className="absolute w-px h-px animate-float"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
              background: `linear-gradient(90deg, transparent, hsl(var(--accent)/30%), transparent)`,
              width: `${100 + Math.random() * 200}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
