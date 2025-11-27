"use client";

import { useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollTop = window.scrollY;
    const newProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
    
    // Smooth the progress value slightly
    setProgress((prev) => prev + (newProgress - prev) * 0.1 || newProgress);
  }, []);

  useEffect(() => {
    // Initial calculation
    updateProgress();

    // Create ScrollTrigger for updates
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: updateProgress,
    });

    // Backup listeners
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    // RAF loop for smooth updates
    let rafId: number;
    const tick = () => {
      updateProgress();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      trigger.kill();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(rafId);
    };
  }, [updateProgress]);

  return progress;
}
