"use client";

import { useEffect, useState, useMemo } from "react";

interface OceanDecorationsProps {
  scrollProgress: number;
}

// Generate random values once
function generateBubbles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 2,
    left: Math.random() * 100,
    duration: 25 + Math.random() * 30,
    delay: Math.random() * 20,
  }));
}

function generatePlankton(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1 + Math.random() * 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 40 + Math.random() * 40,
    delay: Math.random() * 20,
  }));
}

function generateBio(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 3 + Math.random() * 2,
    left: 15 + Math.random() * 70,
    top: 15 + Math.random() * 70,
    duration: 8 + Math.random() * 6,
    delay: Math.random() * 8,
  }));
}

export function OceanDecorations({ scrollProgress }: OceanDecorationsProps) {
  const [mounted, setMounted] = useState(false);

  // Memoize random values - generated once
  const bubbles = useMemo(() => generateBubbles(12), []);
  const plankton = useMemo(() => generatePlankton(15), []);
  const bioLights = useMemo(() => generateBio(6), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Bulles flottantes */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={`bubble-${b.id}`}
            className="absolute rounded-full animate-float-up"
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: `${b.left}%`,
              bottom: `-5%`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>

      {/* Plancton bioluminescent */}
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
        {plankton.map((p) => (
          <div
            key={`plankton-${p.id}`}
            className="absolute rounded-full animate-drift-slow"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: "rgba(255,255,255,0.15)",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Bioluminescence dans les profondeurs */}
      {scrollProgress > 0.55 && (
        <div className="fixed inset-0 pointer-events-none z-[5]">
          {bioLights.map((bio) => (
            <div
              key={`bio-${bio.id}`}
              className="absolute rounded-full animate-glow-slow"
              style={{
                width: `${bio.size}px`,
                height: `${bio.size}px`,
                left: `${bio.left}%`,
                top: `${bio.top}%`,
                background: "rgba(120,255,200,0.3)",
                boxShadow: "0 0 8px rgba(120,255,200,0.2)",
                animationDuration: `${bio.duration}s`,
                animationDelay: `${bio.delay}s`,
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