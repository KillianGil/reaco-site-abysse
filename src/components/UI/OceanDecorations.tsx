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
      {/* ========== FLOATING BUBBLES (no animation, just drift) ========== */}
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

      {/* ========== STATIC LIGHT RAYS (no pulse) ========== */}
      <div 
        className="fixed inset-0 pointer-events-none z-[4] overflow-hidden"
        style={{ opacity: Math.max(0, 0.3 - scrollProgress * 1.2) }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute top-0 origin-top"
            style={{
              left: `${20 + i * 25}%`,
              width: "2px",
              height: "70vh",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent 50%)",
              transform: `rotate(${-5 + i * 5}deg)`,
            }}
          />
        ))}
      </div>

      {/* ========== STATIC PLANKTON (very slow drift, no flash) ========== */}
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

      {/* ========== SUBTLE SEAWEED ========== */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-28 pointer-events-none z-[6]"
        style={{ opacity: Math.min(scrollProgress * 0.6, 0.2) }}
      >
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 Q12,90 25,105 Q40,75 55,95 L55,120 Z" fill="rgba(0,40,60,0.25)" className="animate-sway-gentle" style={{ transformOrigin: "bottom" }} />
          <path d="M45,120 Q60,85 75,100 Q90,70 105,90 L105,120 Z" fill="rgba(0,35,55,0.2)" className="animate-sway-gentle-reverse" style={{ transformOrigin: "bottom", animationDelay: "1s" }} />
          <path d="M1080,120 Q1095,85 1110,100 Q1125,75 1140,95 L1140,120 Z" fill="rgba(0,40,60,0.25)" className="animate-sway-gentle" style={{ transformOrigin: "bottom", animationDelay: "0.5s" }} />
          <path d="M1120,120 Q1140,80 1155,100 Q1170,70 1185,90 L1185,120 Z" fill="rgba(0,35,55,0.2)" className="animate-sway-gentle-reverse" style={{ transformOrigin: "bottom", animationDelay: "1.5s" }} />
        </svg>
      </div>

      {/* ========== STATIC BIOLUMINESCENCE (no blink, just fade in/out slowly) ========== */}
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

      {/* ========== CORNER DECORATIONS ========== */}
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

      {/* ========== SUBTLE DEPTH GRADIENT ========== */}
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
