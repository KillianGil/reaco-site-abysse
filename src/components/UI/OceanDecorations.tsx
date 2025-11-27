"use client";

import { useEffect, useState } from "react";

interface OceanDecorationsProps {
  scrollProgress: number;
}

export function OceanDecorations({ scrollProgress }: OceanDecorationsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Bulles flottantes */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full animate-float-up"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-5%`,
              animationDuration: `${25 + Math.random() * 30}s`,
              animationDelay: `${Math.random() * 20}s`,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      {/* Plancton bioluminescent */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={`plankton-${i}`}
            className="absolute rounded-full animate-drift-slow"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(255,255,255,0.15)",
              animationDuration: `${40 + Math.random() * 40}s`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Bioluminescence dans les profondeurs */}
      {scrollProgress > 0.55 && (
        <div className="fixed inset-0 pointer-events-none z-[5]">
          {[...Array(6)].map((_, i) => (
            <div
              key={`bio-${i}`}
              className="absolute rounded-full animate-glow-slow"
              style={{
                width: `${3 + Math.random() * 2}px`,
                height: `${3 + Math.random() * 2}px`,
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
                background: "rgba(120,255,200,0.3)",
                boxShadow: "0 0 8px rgba(120,255,200,0.2)",
                animationDuration: `${8 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Décorations des coins */}
      <div className="fixed top-5 left-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/60 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/60 to-transparent" />
      </div>
      
      <div className="fixed top-5 right-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-white/60 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      <div className="fixed bottom-5 left-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-white/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      <div className="fixed bottom-5 right-5 w-10 h-10 pointer-events-none z-20 opacity-20">
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white/60 to-transparent" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      {/* Gradient de profondeur subtil */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[3]"
        style={{
          background: "linear-gradient(to top, rgba(0,15,25,0.25), transparent)",
          opacity: scrollProgress * 0.8
        }}
      />
    </>
  );
}