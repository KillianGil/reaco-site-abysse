"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface DepthGaugeProps {
  scrollProgress: number;
}

export function DepthGauge({ scrollProgress }: DepthGaugeProps) {
  const maxDepth = 11000;
  const depth = Math.round(scrollProgress * maxDepth);
  const [mounted, setMounted] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number>();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth animation for the progress bar
  useEffect(() => {
    if (isDragging) return; // Ne pas animer pendant le drag

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
  }, [scrollProgress, isDragging]);

  // ✅ GESTION DU DRAG
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / rect.height));

    setDisplayProgress(progress);

    // Scroll la page
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'auto',
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Touch events
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      handleDragEnd();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // ✅ CLICK SUR LA TRACK pour jump
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const progress = Math.max(0, Math.min(1, y / rect.height));

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * scrollHeight,
      behavior: 'smooth',
    });
  }, []);

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
    <div className="fixed right-4 md:right-auto md:left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 select-none">
      {/* Depth value */}
      <div className="relative">
        <div className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">
          -{formatDepth(depth)}
          <span className="text-lg ml-1 font-normal opacity-80">m</span>
        </div>
      </div>

      {/* Track container */}
      <div className="relative flex items-start gap-3">
        {/* Main track - CLICKABLE */}
        <div
          ref={trackRef}
          className="relative w-2 h-44 bg-white/20 rounded-full overflow-hidden shadow-inner cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Fill */}
          <div
            className="absolute top-0 left-0 w-full rounded-full pointer-events-none"
            style={{
              height: `${fillPercent}%`,
              background: "linear-gradient(to bottom, #4CBBD5, #1a8aaa, #0a6080)",
            }}
          />

          {/* Tick marks */}
          <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-px bg-white/30" />
            ))}
          </div>
        </div>

        {/* Current position indicator - DRAGGABLE */}
        <div
          className={`absolute w-4 h-4 rounded-full bg-white shadow-lg -left-1 transition-transform ${isDragging ? 'scale-125 cursor-grabbing' : 'cursor-grab'
            }`}
          style={{
            top: `${dotPosition}px`,
            transform: `translateY(-50%) ${isDragging ? 'scale(1.25)' : ''}`,
            boxShadow: isDragging
              ? "0 0 12px #fff, 0 0 24px #4CBBD5"
              : "0 0 8px #fff, 0 0 16px #4CBBD5"
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />

        {/* Depth labels */}
        <div className="flex flex-col justify-between h-44 text-[10px] font-medium text-white/60 ml-4 pointer-events-none">
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