
import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-0">
        {/* Generate animated snowflakes */}
        {Array.from({ length: 50 }).map((_, index) => (
          <div 
            key={index} 
            className="absolute rounded-full bg-white/70 dark:bg-white/30 animate-fall"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `-${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
