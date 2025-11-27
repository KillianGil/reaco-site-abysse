"use client";

import { useEffect, useState, useRef } from "react";

interface DepthGaugeProps {
  scrollProgress: number;
}

export function DepthGauge({ scrollProgress }: DepthGaugeProps) {
  const maxDepth = 11000;
  const depth = Math.round(scrollProgress * maxDepth);
  const [mounted, setMounted] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth animation for the progress bar
  useEffect(() => {
    const animate = () => {
      setDisplayProgress(prev => {
        const diff = scrollProgress - prev;
        if (Math.abs(diff) < 0.001) return scrollProgress;
        return prev + diff * 0.15;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [scrollProgress]);

  const formatDepth = (d: number) => {
    if (d >= 1000) {
      return d.toLocaleString("fr-FR");
    }
    return d.toString();
  };

  if (!mounted) return null;

  const fillPercent = displayProgress * 100;
  const trackHeight = 176; // h-44 = 11rem = 176px
  const dotPosition = (fillPercent / 100) * trackHeight;

  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      {/* Depth value */}
      <div className="relative">
        <div className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
          -{formatDepth(depth)}
          <span className="text-lg ml-1 font-normal opacity-80">m</span>
        </div>
      </div>

      {/* Track container */}
      <div className="relative flex items-start gap-3">
        {/* Main track */}
        <div className="relative w-2 h-44 bg-white/20 rounded-full overflow-hidden shadow-inner">
          {/* Fill */}
          <div
            className="absolute top-0 left-0 w-full rounded-full"
            style={{ 
              height: `${fillPercent}%`,
              background: "linear-gradient(to bottom, #4CBBD5, #1a8aaa, #0a6080)",
            }}
          />
          
          {/* Tick marks */}
          <div className="absolute inset-0 flex flex-col justify-between py-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-px bg-white/30" />
            ))}
          </div>
        </div>

        {/* Current position indicator - properly aligned */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-lg -left-1"
          style={{ 
            top: `${dotPosition}px`,
            transform: "translateY(-50%)",
            boxShadow: "0 0 8px #fff, 0 0 16px #4CBBD5"
          }}
        />

        {/* Depth labels */}
        <div className="flex flex-col justify-between h-44 text-[10px] font-medium text-white/60 ml-4">
          <span>0m</span>
          <span>3km</span>
          <span>6km</span>
          <span>9km</span>
          <span>11km</span>
        </div>
      </div>

      {/* Zone label */}
      <div className="px-3 py-1.5 rounded bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-white leading-none text-center whitespace-nowrap">
          {depth < 200 && "Surface"}
          {depth >= 200 && depth < 1000 && "Mésopélagique"}
          {depth >= 1000 && depth < 4000 && "Bathyal"}
          {depth >= 4000 && depth < 6000 && "Abyssal"}
          {depth >= 6000 && "Zone Hadale"}
        </span>
      </div>
    </div>
  );
}
