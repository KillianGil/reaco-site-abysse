"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const updateTarget = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    targetRef.current = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
  }, []);

  useEffect(() => {
    updateTarget();

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: updateTarget,
    });

    window.addEventListener("resize", updateTarget, { passive: true });

    // Single RAF loop - uses ref for diff check to avoid stale closure
    const tick = () => {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentRef.current += diff * 0.12;
        setProgress(currentRef.current);
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", updateTarget);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateTarget]);

  return progress;
}
