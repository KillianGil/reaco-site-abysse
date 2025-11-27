"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LenisProvider } from "@/providers/LenisProvider";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Overlay, DepthGauge, Navbar, OceanDecorations } from "@/components/UI";

gsap.registerPlugin(ScrollTrigger);

const Scene = dynamic(
  () => import("@/components/Canvas/Scene").then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#1a7a9a] z-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-white/20 border-t-[#4CBBD5] rounded-full animate-spin" />
          </div>
          <span className="text-sm text-white/50">Plongée en cours...</span>
        </div>
      </div>
    ),
  }
);

function PageContent() {
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    ScrollTrigger.refresh();
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <>
      <Scene scrollProgress={scrollProgress} />
      <Navbar />
      <DepthGauge scrollProgress={scrollProgress} />
      <OceanDecorations scrollProgress={scrollProgress} />
      <Overlay />
      
      {/* Grain overlay for texture */}
      <div className="grain-overlay" />
    </>
  );
}

export default function Home() {
  return (
    <LenisProvider>
      <main className="relative">
        <PageContent />
      </main>
    </LenisProvider>
  );
}
